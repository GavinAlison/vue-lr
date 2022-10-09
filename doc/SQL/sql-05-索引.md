# table of contents
- 为什么索引能提高查询速度? MySQL索引原理：MySQL 的索引是什么？怎么优化？
- 一些原则
- 最左匹配原则
- 联合索引的存储结构是如何的？
- 什么是回表查询
- 聚簇索引和二级索引
- 添加索引方式
- MyISAM和InnoDB区别


# 为什么索引能提高查询速度? MySQL索引原理：MySQL 的索引是什么？怎么优化？

相比较与顺序遍历查找，索引由于其采用B+ tree 的数据结构，加快了查找速度

顺序遍历查找复杂度是O(n)， 二分查找的复杂度是O(logN)

顾名思义，B-tree索引使用B-tree的数据结构存储数据，不同的存储引擎以不同的方式使用B-Tree索引，
比如MyISAM使用前缀压缩技术使得索引空间更小，而InnoDB则按照原数据格式存储，且MyISAM索引在索引中记录了对应数据的物理位置，
而InnoDB则在索引中记录了对应的主键数值。B-Tree通常意味着所有的值都是按顺序存储，并且每个叶子页到根的距离相同。

B-Tree索引驱使存储引擎不再通过全表扫描获取数据，而是从索引的根节点开始查找，在根节点和中间节点都存放了指向下层节点的指针，
通过比较节点页的值和要查找值可以找到合适的指针进入下层子节点，直到最下层的叶子节点，
最终的结果就是要么找到对应的值，要么找不到对应的值。整个B-tree树的深度和表的大小直接相关。


# 一些原则

- 全键值匹配：和索引中的所有列都进行匹配，比如查找姓名为zhang san，出生于1982-1-1的人
- 最左前缀原则, 和索引中的最左边的列进行匹配，比如查找所有姓为zhang的人
- 匹配列前缀, 匹配索引最左边列的开头部分，比如查找所有以z开头的姓名的人
- 匹配范围值, 匹配索引列的范围区域值，比如查找姓在li和wang之间的人
- 精确匹配左边列并范围匹配右边的列, 比如查找所有姓为Zhang，且名字以K开头的人
- 只访问索引的查询, 查询结果完全可以通过索引获得，也叫做覆盖索引，比如查找所有姓为zhang的人的姓名
- like 'abc%', 不要like '%abc'
  
## 最左匹配原则
```
select * from user where name=xx and city=xx ; ／／可以命中索引
select * from user where name=xx ; // 可以命中索引
select * from user where city=xx ; // 无法命中索引
select * from user where city=xx and name=xx ; ／／可以命中索引,会产生索引下推，命中索引
```

## 联合索引的存储结构是如何的？ 

## 什么是回表查询

## 聚簇索引和二级索引

## 添加索引方式

```sql
-- add primary key
alter table `table_name` add primary key(`column`);
-- add unique key
alter table `table_name` add unique(`column`)
-- add normal key
alter table `table_name` add index idx_name (`column`)
-- add fulltext key
alter table `table_name` add fulltext(`column`)
-- add mutli columns
alter table `table_name` add index idx_name(`column1`, `column2`, `column3`)
```

```sql

--  查看表的引擎
show table status like 'table_name';
show variable like '%storage_engine%';

```

## MyISAM和InnoDB区别

1. 是否支持行级锁 : MyISAM 只有表级锁(table-level locking)，而InnoDB 支持行级锁(row-level locking)和表级锁,默认为行级锁。

3. 是否支持事务和崩溃后的安全恢复：MyISAM 强调的是性能，每次查询具有原子性,其执行比InnoDB类型更快，但是不提供事务支持。
   但是InnoDB 提供事务支持事务，外部键等高级数据库功能。具有事务(commit)、回滚(rollback)和崩溃修复能力(crash recovery capabilities)的事务安全(transaction-safe (ACID compliant))型表。

4. 是否支持外键： MyISAM不支持，而InnoDB支持。

5. 是否支持MVCC ：仅 InnoDB 支持。应对高并发事务, MVCC比单纯的加锁更高效;
   MVCC只在 READ COMMITTED 和 REPEATABLE READ 两个隔离级别下工作;MVCC可以使用 乐观(optimistic)锁 和
    悲观(pessimistic)锁来实现;各数据库中MVCC实现并不统一。

6. 索引的存储不同，MyIASM 数据和索引分别存储， InnoDB 数据和索引分别存储


## 乐观锁与悲观锁的区别

悲观锁， 共享资源每次只给一个线程使用，其它线程阻塞
    体现，数据库中，行锁、表锁、读锁、写锁等
        Java中，synchronized和ReentrantLock 独占锁

乐观锁， 乐观锁适用于多读的应用类型，这样可以提高吞吐量，像
    体现，数据库提供的类似于write_condition机制，
        Java中，java.util.concurrent.atomic包下面的原子变量类的CAS方式

两种锁的使用场景

乐观锁适用于写比较少的情况下（多读场景）
一般多写的场景下用悲观锁就比较合适。

## 大表优化

当MySQL单表记录数过大时，数据库的CRUD性能会明显下降，一些常见的优化措施如下：

1. 限定数据的范围
务必禁止不带任何限制数据范围条件的查询语句。比如：我们当用户在查询订单历史的时候，我们可以控制在一个月的范围内；

2. 读/写分离
经典的数据库拆分方案，主库负责写，从库负责读；

3. 垂直分区
根据数据库里面数据表的相关性进行拆分。 例如，用户表中既有用户的登录信息又有用户的基本信息，可以将用户表拆分成两个单独的表，甚至放到单独的库做分库。

简单来说垂直拆分是指数据表列的拆分，把一张列比较多的表拆分为多张表。 如下图所示，这样来说大家应该就更容易理解了。

拆分列成多表或者多库

4. 水平分区

保持数据表结构不变，通过某种策略存储数据分片。这样每一片数据分散到不同的表或者库中，达到了分布式的目的。
水平拆分可以支撑非常大的数据量。

水平拆分是指数据表行的拆分，表的行数超过200万行时，就会变慢，这时可以把一张的表的数据拆成多张表来存放。举个例子：我们可以将用户信息表拆分成多个用户信息表，这样就可以避免单一表数据量过大对性能造成影响。

水平拆分能够 支持非常大的数据量存储，应用端改造也少，但 分片事务难以解决 ，跨节点Join性能较差，逻辑复杂

尽量不要对数据进行分片，因为拆分会带来逻辑、部署、运维的各种复杂度.

一般的数据表在优化得当的情况下支撑千万以下的数据量是没有太大问题的。
如果实在要分片，尽量选择客户端分片架构，这样可以减少一次和中间件的网络I/O。

**下面补充一下数据库分片的两种常见方案：**

- 客户端代理： 分片逻辑在应用端，封装在jar包中，通过修改或者封装JDBC层来实现。 当当网的 Sharding-JDBC 、阿里的TDDL是两种比较常用的实现。

- 中间件代理： 在应用和数据中间加了一个代理层。分片逻辑统一维护在中间件服务中。 我们现在谈的 Mycat 、360的Atlas、网易的DDB等等都是这种架构的实现。

