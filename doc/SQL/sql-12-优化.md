# sql优化实战之全值匹配和范围查询


## 数据准备

```sql
-- 创建表
CREATE TABLE `employees` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL DEFAULT '' COMMENT '姓名',
  `age` int(11) NOT NULL DEFAULT '0' COMMENT '年龄',
  `position` varchar(20) NOT NULL DEFAULT '' COMMENT '职位',
  `hire_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '入职时间',
  PRIMARY KEY (`id`),
  KEY `idx_name_age_position` (`name`,`age`,`position`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='员工记录表';
 
-- 插入3条数据
INSERT INTO employees(name,age,position,hire_time) VALUES('LiLei',22,'manager',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('HanMeimei', 23,'dev',NOW());
INSERT INTO employees(name,age,position,hire_time) VALUES('Lucy',23,'dev',NOW());
```

```sql
-- 使用存储过程 插入10w条数据
drop procedure if exists insert_emp;
delimiter ;;
create procedure insert_emp()
begin
declare i int;
set i=1;
while(i<=100000)do
insert into employees(name,age,position) values(CONCAT('zhangsan',i),i,'dev');
set i=i+1;
end while;
end;;
delimiter ;
call insert_emp();
```

## sql优化分析

sql优化主要针对索引的优化，目的是尽可能的使用索引进行查询检索，那么mysql是否走索引查询其实是由mysql优化器决定的，
针对一条sql语句mysql优化器会计算各种情况的成本，从而选择如何使用索引甚至全表扫描。这种优化结果是不确定的，
也就是说，针对同一条sql语句，可能第一次查询是走索引的，第二次查询就不走索引了。

总的来说mysql是否能够使用索引我们大概是可以预测的，但是预测的结果并不一定准确。

1.全值匹配

针对联合索引需要遵循最左前缀原则以及中间不可断

```sql
-- 联合索引使用 联合索引的三个字段都用到了
explain select * from employees where name = 'LiLei' and age = 22 and position='dev';-- type=ref, key=idx_name_age_position, key_len=140
-- 使用左边的两个索引字段
explain select * from employees where name = 'LiLei' and age = 22; -- type=ref, key=idx_name_age_position, key_len=78
-- 只有name和age 所以key_len 长度少了
-- 中间断开了联合索引的age字段
explain select * from employees where name = 'LiLei'  and position='dev'; -- type=ref, key_len=74
-- 只有name有匹配到
-- 没有使用最左的name字段
explain select * from employees where age = 22 and position='dev';-- type=all, 都没有匹配索引

```

2.范围查找(`>`,`like`,`in`,`or`等)

```sql
-- 联合索引的第一个字段就使用范围查询
explain select * from employees where name > 'LiLei' and age = 22 and position='dev';-- 结果：不会走联合索引
-- type=all, key=null
```
分析：mysql判断出可能需要走idx_name_age_position索引，但是实际key=null，没有走索引。按理说这个sql是可以走第一个name字段索引的，
但是mysql分析过后其实没有走name字段的。原因可能是：name使用的范围查找，查询的结果集较大，而且查询出来后需要回表查询，效率不高，
还没有进行全表扫描快。

```sql
-- 联合索引的第一个字段就使用范围查询
explain select * from employees where name > 'zzz' and age = 22 and position='dev';
-- type=range, key=idx_name_age_position
```

显而易见，这条查询是走了的索引的，虽然只是走了联合索引的name字段。
为什么呢？首先看一下和上面的一条sql的区别， 也就是name>'LiLei' 和 name > 'zzz'的区别，
我们知道字符串的排序是按照ascall码排序的，LiLei明显比zzz靠前，zzz几乎是排在最后的，
所以大于zzz的结果集比大于LiLei的结果集小的多，mysql计算这个回表成本小于全表扫描的成本，所以就走了索引

```sql
-- 使用覆盖索引
explain select id,name,age,position from employees where name > 'LiLei' and age = 22 and position='dev';
-- type=range
```

显而易见，也是走了索引的，为什么呢？首先回忆一下mysql的索引树，针对二级索引，
我们查询的结果在联合索引的索引树上都有，因此直接遍历二级索引树就可获取到结果，无需回表操作，因此mysql选择使用二级索引。

也就是说，某些场景我们是可以使用覆盖索引（即遍历索引树就可以取到返回的结果字段）来进行优化的。

```sql
-- 联合索引的第二个字段使用范围查询
explain select * from employees where name = 'LiLei' and age > 22 and position='dev';
-- type=range
```

在联合索引的第一个字段确认情况下，第二个字段使用范围查找，看下结果：

使用了索引，在name确认情况下，age是有序的所以走了name和age两个字段的索引。

```sql
-- 联合索引使用like查询
explain select * from employees where name like '%LiL%' and age = 22 and position='dev';-- type=ALL
explain select * from employees where name like '%LiL' and age = 22 and position='dev';-- type=ALL
explain select * from employees where name like 'LiL%' and age = 22 and position='dev';-- type=range
```
结果显示：前两条都是全表扫描，最后一条走了联合索引。

`%`在前面的都不会走索引，因为字符串的前面部分不确定，对于索引来说是没办法确定顺序的，mysql分析 如果走联合索引，`%LiLei`
或者`%LiLei%`得到的结果集可能很大，而且没法根据name按照顺序进行定位，查到结果还要回表，效率不一定有全表扫描快。

`%`在后面是走索引的，分析应该因为字符串的前面一部分已经确定了，每次定位都可以截取索引页中的name前几位进行匹配，
是可以按照顺序进行查询的，而且字符串前缀确定了结果集比 >'LiLei'要小很多，所以回表效率也比较高，因此可以走索引。

其实这里用到了索引下推，什么是索引下推：

对于联合索引(name,age,position)，按照最左前缀原则，
sql语句 `select * from employees where name like 'LiL%' and age = 22 and position='dev';`
按道理说应该只能用到name字段，在name字段值不确认情况下，age和position字段是不走索引的，但是实际情况是走索引的。

在Mysql5.6以前，是先走name索引，找到结果集，然后在回表，通过比较age和position字段确认查找的记录。

在Mysql5.6以后，是走name索引确定name的值，之后遍历二级索引树，根据age和position字段在过滤一遍，
然后拿到结果集（过滤后的结果集会少很多）再去回表，这样提高回表时的效率。这就是索引下推。


3. 针对in的查询操作

```sql
-- 针对表中10万条数据 使用in查询
explain select * from employees where name in ('LiLei','zhangsan') and age = 22 and position='dev';-- type=range
 
-- 针对表中3条数据  使用in查询
explain select * from employees_copy where name in ('LiLei','zhangsan') and age = 22 and position='dev';-- type=all
```

结果可知：同样的in操作，对于是否使用索引查询是不确定的，mysql会结合数据量各方面因素分析确认是否要走索引的，
上面的例子显然在数据量比较多的时候使用了索引，数据量比较少的时候没有使用索引。
数据量比较少时，走二级索引后还要回表操作，不一定有直接全表扫描快。
数据量比较多时，走二级索引可以过滤掉大部分数据，回表时效率比全表扫描要快，毕竟数据量多的时候全表扫描是很慢的。

4. 与in相比or的操作也是类似的

```sql
-- 针对表中10万条数据 使用or查询
explain select * from employees where name ='LiLei' or name ='zhangsan' and age = 22 and position='dev';-- type=range
 
-- 针对表中3条数据  使用or查询
explain select * from employees_copy where name ='LiLei' or name ='zhangsan' and age = 22 and position='dev';-- type=all

```

结果其实和in操作是一样的，原理也是类似的，这里就不贴出结果了。

总结：对于范围查找，根据不同情况mysql会自己计算选择是否走索引，同样的sql并不是每次都走索引的。

针对于'>','<','>='等查询sql，使用索引一般分下面几种情况（但也不是100%走，这里说的是大部分场景）：

1. 在数据量少的时候
2. 联合索引的第二个字段以及更后面的字段使用
3. 查询的范围值排在很后面的时候，例如>'zzz' 或者 < 'aaa'
4. 针对like查询，一般是`%`号在后面的时候使用索引，但是这样的sql也有不走索引的情况：

例如：表中有10w条数据，其中有90%的数据name字段值为`zhangsan`，
这个时候 like 'zha%' and age = 22 and position='dev'就不会走索引，甚至索引下推都不会使用。
因为结果集太大，筛选和回表效率不高，还不如直接全表扫描。

针对`in`，`or`查询，在某些情况下也不会走索引，例如：表中的数据很少，in中的值很多，
走索引范围没有全表扫描效率高，所以一般不会走索引。

但是表中数据量很多的话，in一般就会走索引，比如有几万条数据，使用in查询几十条，那么就会走索引。

# 总结

因此：mysql是否使用索引查询是不确定的，哪怕同一条sql在不同场景下是否走索引也是不一样的，
对于主键索引使用主键查询，大部分都会走索引查询。
对于二级索引，如果果集比结较小，那么mysql可能会选择走索引，
如果结果集很大，那么mysql可能选择全表扫描。
所以针对sql优化，是需要结合业务场景优化的，抛开业务场景优化sql并不一定能提高效率。

> link:
> https://blog.csdn.net/bugNoneNull/article/details/107606764

