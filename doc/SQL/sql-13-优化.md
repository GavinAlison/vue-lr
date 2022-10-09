
# 一、order by
## 针对联合索引：

mysql中InnoDB排序一般有两种排序方式，Using index和Using filesort。一个锁索引排序，效率高。一个是文件排序，效率低。

1. order by语句使用最左前列。
2. where子句和order by字句组合使用最左前列
3. 能使用覆盖索引尽量使用覆盖索引
4. group by 和order by很类似，实质是先排序后分组，如果不想排序，可以order by null禁止排序。

针对Using filesort有两种排序方式：

1. 单路排序：根据条件把需要的字段全局查询出来，加载到sortbuffer中，然后根据排序字段进行排序，最后直接从内存中把排好序的结果返回去。
2. 双路排序（回表排序）：根据条件把记录id，排序字段加载到sort buffer中，然后根据排序字段进行排序，在根据id回表查询，在把结构返回。

是选择单路排序还是双路排序，mysql根据系统变量max_length_for_sort_data（1024kb）比对，
如果查询的字段总长度超过这个值，则选择双路排序，如果小于这个值 则选择单路排序。这个变量是可以修改的（当然不见修改）。

对比两种排序方式：

1. 单路排序占用的内存空间较大，但是速度很快。
2. 双路排序占用的内存空间较小，但是速度较慢，还需要回表再次查询，效率不高。

## 二、limit 分页查询
例如：`select * from employees limit 10000,10;`

这条sql查询过程：先查询10010条数据，然后前10000条放弃，从10000条往后取10条数据。

这种情况一般是全表扫描的，效率不高。

**如何优化呢？**

如果我们对name字段建立索引：

是否可以使用索引字段优化，例如：
`select * from employees ORDER BY name limit 10000,10;`
经过分析这条sql也是不走索引的，但是我们用到了索引字段，没有走索引，**如何优化成走索引呢？**

是否可以使用覆盖索引，例如：
`select id,name from employees ORDER BY name limit 10000,10;`
经过EXPLAIN分析，这条sql是可以走索引的，那么 问题来了？如果我查询的字段很多，不仅仅索引字段，怎么办呢？

很简单：

上面的sql中通过索引查询，可以的到一个id的结构集，那么是否可以根据id结果，在主键索引树上定位数据呢？

例如：

`EXPLAIN select * from employees e inner join ( select id from employees ORDER BY name limit 10000,10) tem on tem.id = e.id;`
先根据name索引定位到主键id，在根据主键id去主键索引树查询到所有字段，把select id from employees ORDER BY name limit 10000,10的结果集(只有10条数据)放到一个临时表中，然后进行关联查询，这样就能高效利用索引进行分页查询。

# 三、join的关联查询
mysql表关联查询常见的两种算法

假设有两种表t1（1万条数据），t2（100条数据），两个表通过字段a和b两个字段关联，其中a是索引字段，b非索引字段

## 1.嵌套循环连接查询（Nest-Loop join NLJ）算法：主要针对索引字段连接查询到的

`select * from t1 inner join t2 on t2.a = t1.a；`
使用嵌套循环连接算法的查询过程：

1. 遍历t2表，取出一条数据
2. 根据取出的a字段的值，去t1表中定位查询，因为a是索引，所以速度最快查询1次就可得到结果。
我们把小表t2称为驱动表，t1称为被驱动表，小表驱动大表。按照上面的过程  我们查询到结果最快只要扫描200次就可得到结果。

## 2.基于块的嵌套循环连接算法（Block Nest-Loop join BNL）：主要针对非索引字段连接查询的

`select * from t1 inner join t2 on t2.b = t1.b；-- b是非索引字段`

先看一下这条sql如果使用NLJ算法大概需要扫描多少次？

从t2中取出一条数据，得到b字段的值，然后去t1表中扫描1万次（因为非索引字段），接着取出第二条数据，在去t1扫描1万次。
索引总共需要大概扫描200万次。

那么使用BNL算法呢？

步骤：
1. 先把t2的数据查询出来放到一个内存buffer中（这个过程需要扫描100次），
2. 然后从t1表中取出一条数据去内存buffer中比对，得到结果（内存比对速度很快 我们暂不考虑），然后再次从t1中取出一条数据，
3. 再次buffer中比对，知道取出第一万条数据。这个过程扫描t1表1万次，加上第一步的100次  公共扫描10100次。速度比使用NLJ块了很多倍。

# 总结：

1. 尽量使用索引字段尽量表的关联查询。
2. 进行join查询时尽量使用小表驱动大表
根据小表驱动大表的原则，我们还可以对in或者exists进行优化，
当tableA的数据少于tableB的，可以
`select * from tableA a where a.id in (select b.id from tableB b)`
当tableA的数据大于tableB的，可以
`select * from tableA a where exists （select 1 from tableB b.xx = a.xx）；`

# 四、计数效率对比

1. count(*)
2. count(1)
3. count(id)
4. count(字段)

两种情况：

如果字段建了索引的话，count(*)≈count(1)>count(字段)>count(id)

如果字段没有建索引，count(*)≈count(1)>count(id)>count(字段)

针对这种查询记录数量的，对于InnoDB而言是需要扫描表进行统计的。

count(*)并不会取出数据，按照记录累加，效率较高。

count(1)也不会取出字段数据比较，直接以常量1做累加，效率和count(*)差不多。

count(字段):需要取出字段判断是否为null，不为null的才计数，如果建了索引，遍历二级索引就可，比遍历主键索引树块（因为二级索引树小，叶子节点只保存id数据）。但是如果没有建立索引，则会全表扫描，效率肯定没有count(id)块。

count(id):扫描主键索引树，取出id字段进行计数。

> link
> https://blog.csdn.net/bugnonenull/category_10219130.html
> https://blog.csdn.net/bugNoneNull/article/details/107714656