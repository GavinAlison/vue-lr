# 事务特性

## ACID

A（Atomicity）： 原子性，要么做，要么不做
C（Consistency）：一致性，事务开始之前和事务结束以后，数据库的完整性约束没有被破坏。
I（Isolation）：多个事务并发访问时，事务之间是隔离的
D（Durability）： 该事务所对数据库所作的更改便持久的保存在数据库之中

## ACID 是如何实现的

原子性：通过undolog来实现。
持久性：通过binlog、redolog来实现。
隔离性：通过 (读写锁+MVCC)来实现。
一致性： MySQL通过原子性，持久性，隔离性最终实现（或者说定义）数据一致性。

MVCC: 多版本的并发控制, Multi-Version Concurrency Control

>[ACID原理](https://zhuanlan.zhihu.com/p/270209292) 这里简述undolog的重做机制log

redolog 保证持久性，一个事务包含100多条更新记录，直接commit 之后写数据库，会发生频繁写入操作导致数据库压力太大，
为了提高TPS,引入buffer pool缓存池，这个缓存池大小是128M，
然后在读的时候，先读buffer pool，若没，则读磁盘，在放入buffer pool，这个是在数据页上的，
在写时，先写入buffer pool,然后定时刷新到磁盘（刷脏），定时有两种方式，缓存满了或者定时
但是可能出现宕机的情况，需要redo log机制保证数据不丢失。
redo log 采用WAL机制（write-ahead logging预写式日志），先写日志，再更新到buffer pool中。

buffer pool 刷脏的特点，以数据页为单位，随机IO，比哪些顺序IO慢

## redo log 和 binlog的区别

1. redo log是重做日志，是保证宕机数据不丢失机制,binlog是二进制日志，是基于时间点的恢复机制，回滚误操作，也可以用于主从复制
2. redo log是innodb引擎实现，binlog是mysql服务器实现，
3. redo log是物理日志，内容基于磁盘的page；binlog 是二进制，显示方式也不一致，根据binlog_format参数可以是sql语句、数据本身或者二者之间


## 并发带来的问题

- 脏读（Dirty read）：当一个事务正在访问数据并且对数据进行了修改，而这种修改还没有提交到数据库中，这时另外一个事务也访问了这个数据，然后使用了这个数据。因为这个数据是还没有提交的数据，那么另外一个事务读到的这个数据是“脏数据”。
- 不可重复读（Unrepeatableread）：指在一个事务内多次读同一数据。在这个事务还没有结束时，另一个事务也访问该数据。那么，在第一个事务中的两次读数据之间，由于第二个事务的修改导致第一个事务两次读取的数据可能不太一样。这就发生了在一个事务内两次读到的数据是不一样的情况，因此称为不可重复读。
- 幻读（Phantom read）：它发生在一个事务（T1）读取了几行数据，接着另一个并发事务（T2）插入了一些数据时。在随后的查询中，第一个事务（T1）就会发现多了一些原本不存在的记录，就好像发生了幻觉一样，所以称为幻读。

**总结**

脏读： 读其他事务修改的数据
不可重复读： 读两次数据值不一样
幻读： 读两次发生多数据

**不可重复读和幻读区别**

不可重复读的重点是修改，幻读的重点在于新增或者删除。

## MySQL的默认隔离级别是？

RR
REPEATABLE-READ（可重读）

查看命令
```
select @@tx_isolation;
```

## SQL 标准定义了四个隔离级别

- READ-UNCOMMITTED(读取未提交)：允许读取尚未提交的数据变更，可能会导致脏读、幻读或不可重复读。
- READ-COMMITTED(读取已提交)： 允许读取并发事务已经提交的数据，可以阻止脏读，但是幻读或不可重复读仍有可能发生。
- REPEATABLE-READ(可重复读)： 对同一字段的多次读取结果都是一致的，除非数据是被本身事务自己所修改，可以阻止脏读和不可重复读，但幻读仍有可能发生。
- SERIALIZABLE(可串行化)： 最高的隔离级别，完全服从ACID的隔离级别。所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰，也就是说，该级别可以防止脏读、不可重复读以及幻读。


RU
RC
RR
SERI


隔离级别	        脏读	不可重复读	幻读
READ-UNCOMMITTED	√	√	√
READ-COMMITTED	    ×	√	√
REPEATABLE-READ	    ×	×	√
SERIALIZABLE	    ×	×	×

## 这些隔离级别是如何实现的？

serializable: 序列化，
主要是通过加表锁的方式，在读的时候，通过加表级共享锁之后，直到事务结束后释放。
在写的时候，通过加表级排他锁，直到事务结束后释放。

Read-UNCOMMITTED: 未提交读，RU
事务对当前被读取的数据不加锁；
事务在更新某数据的瞬间（就是发生更新的瞬间），必须先对其加行级共享锁，直到事务结束才释放。

提交读（RC）: 
事务对当前被读取的数据加行级共享锁（当读到时才加锁），一旦读完该行，立即释放该行级共享锁；
事务在更新某数据的瞬间（就是发生更新的瞬间），必须先对其加行级排他锁，直到事务结束才释放。

可重复读（RR）:
事务在读取某数据的瞬间（就是开始读取的瞬间），必须先对其加行级共享锁，直到事务结束才释放；
事务在更新某数据的瞬间（就是发生更新的瞬间），必须先对其加行级排他锁，直到事务结束才释放。


## 最好多举一些例子出来，说明一下

## RR 是如何 保证解决脏读、不可重复读、幻读

通过MVCC

## MVCC 机制
通过undo log 和 隐藏列 + readView 机制实现的。

RR解决脏读、不可重复读、幻读等问题，使用的是MVCC：MVCC全称Multi-Version Concurrency Control，即多版本的并发控制协议。

下面的例子很好的体现了MVCC的特点：在同一时刻，不同的事务读取到的数据可能是不同的(即多版本)——在T5时刻，
事务A和事务C可以读取到不同版本的数据。

MVCC最大的优点是读不加锁，因此读写不冲突，并发性能好。InnoDB实现MVCC，多个版本的数据可以共存，主要基于以下技术及数据结构：

1）隐藏列：InnoDB中每行数据都有隐藏列，隐藏列中包含了本行数据的事务id、指向undo log的指针等。

2）基于undo log的版本链：前面说到每行数据的隐藏列中包含了指向undo log的指针，而每条undo log也会指向更早版本的undo log，从而形成一条版本链。

3）ReadView：通过隐藏列和版本链，MySQL可以将数据恢复到指定版本；但是具体要恢复到哪个版本，则需要根据ReadView来确定。所谓ReadView，是指事务（记做事务A）在某一时刻给整个事务系统（trx_sys）打快照，之后再进行读操作时，会将读取到的数据中的事务id与trx_sys快照比较，从而判断数据对该ReadView是否可见，即对事务A是否可见。

trx_sys中的主要内容，以及判断可见性的方法如下：

low_limit_id：表示生成ReadView时系统中应该分配给下一个事务的id。如果数据的事务id大于等于low_limit_id，则对该ReadView不可见。
up_limit_id：表示生成ReadView时当前系统中活跃的读写事务中最小的事务id。如果数据的事务id小于up_limit_id，则对该ReadView可见。
rw_trx_ids：表示生成ReadView时当前系统中活跃的读写事务的事务id列表。如果数据的事务id在low_limit_id和up_limit_id之间，则需要判断事务id是否在rw_trx_ids中：如果在，说明生成ReadView时事务仍在活跃中，因此数据对ReadView不可见；如果不在，说明生成ReadView时事务已经提交了，因此数据对ReadView可见。

上面是一些比较规则，比较事务id，low和up_limit_id之间和rw_trx_ids活跃的事务

[深入学习MySQL事务：ACID特性的实现原理](https://www.cnblogs.com/kismetv/p/10331633.html) 这里面有事务的例子解决脏读、不可重复读
幻读的情况。


问题： ReadView 的事务快照是什么时候生成的？


脏读
```
时间	事务1	事务2
T1		        begin
T2	    begin	
T3	    update t set b=200 where a=2;	
T4	    commit	
T5		        select * from t where a=2;  // 200， 此时能读取到修改的数据，说明readView 是基于select的时候生成的事务快照
T6		        commit

------------------------
T1		        begin
T2	    begin	
T3	    update t set b=200 where a=2;	
T4		        select * from t where a=2;  //2，此时生成的readview，事务快照，发生事务1在当前活跃事务列表中，不可见
T5	    commit	
T6              commit
-----------------------

```

不可重复读
```
时间	事务1	事务2
T1		        begin
T2	    begin	
T3              select * from t where a=2;
T4	    update t set b=200 where a=2;	
T5	    commit	
T6		        select * from t where a=2;  // 2， 
T7		        commit

当事务2在T3时刻读取a的数值，会生成ReadView。此时事务1分两种情况讨论，
一种是如图中所示，事务已经开始未提交，此时其事务id在ReadView的rw_trx_ids中；
一种是事务B还没有开始，此时其事务id大于等于ReadView的low_limit_id。
无论是哪种情况，根据前面介绍的规则，事务B的修改对ReadView都不可见。

因此事务2根据指针指向的undo log查询上一版本的数据，得到a的数据为2，从而避免了不可重复读。
```

幻读  

和不可重复读的解决方法一样的，只是数量的不同


## RC和RR的区别

都使用了MVCC, 不同在于readView的生成机制

RC: 次执行select前都会重新建立一个新的ReadView，因此如果事务A第一次select之后，事务B对数据进行了修改并提交，那么事务A第二次select时会重新建立新的ReadView，因此事务B的修改对事务A是可见的。因此RC隔离级别可以避免脏读，但是无法避免不可重复读和幻读。

RR： 在事务开始后第一次执行select前创建ReadView，直到事务提交都不会再创建。根据前面的介绍，RR可以避免脏读、不可重复读和幻读。

