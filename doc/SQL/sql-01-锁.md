# MySQL锁分类

- 表锁
- 行锁-共享锁，互斥锁
- 间隙锁
- next-key lock

MySQL的索引和锁

## 间隙锁

在间隙里面加的锁，就叫间隙锁

## 行锁和间隙锁的区别

行锁之前会冲突，包括读写、写写；但是间隙锁不一样，跟间隙锁存在冲突关系的，是“往这个间隙中插入一个记录”这个操作。间隙锁之间不存在冲突关系。

间隙锁：只在RR级别下和RC级别下的外键生效。
四舍五入，你就默认间隙锁在RR级别下生效即可。

## next-key lock

其实next-key lock 就是行锁和间隙锁的合称。

前开后闭

## 加锁原则

- 原则1: 加锁的基本单位是next-key lock. 希望你还记得，next-key lock是前开后闭区间。
- 原则2：查找过程中访问到的对象才会加锁。
- 优化1：索引上的等值查询，给唯一锁加锁的时候，next-key lock退化为行锁。
- 优化2：索引上的等值查询，向右遍历时最后一个值不满足等值条件的时候，next-key lock 退化为间隙锁。
- 一个bug：唯一索引上的范围查询会访问到不满足条件的第一个值为止

例子

```
create table `t`(
    `id` int not null auto_increment,
    `a` int default null,
    `b` int default null,
    `c` int default null,
    primary key(`id`),
    key `idx_a_b_c` (`a`, `b`, `c`)
) engine =innodb auto_increment=1 default charset=utf8mb4  ;


insert into `t`(`id`, `a`, `b`, `c`) values(1, 1, 1, 1);
insert into `t`(`id`, `a`, `b`, `c`) values(5, 5, 5, 5);
insert into `t`(`id`, `a`, `b`, `c`) values(10, 10, 10, 10);


```

实验开始

事务1：
```
begin;
update `t` set a=123 where a=1; // 查看到数据，说明(-无穷,1] 加了间隙锁，(1,5)加了间隙锁，没有5
```

事务2：
```
begin;
insert into t values(0,0,0,0); // 卡住，说明上一个事务已经加了间隙锁，锁范围(-无穷, 1], 这个值1找到了，所以包括，如果没有找到，说明不包括
```

事务3：
```
begin;
insert into t values(1, 1, 1, 1);// 卡住， 说明存在锁
```

事务4：
```
begin;
insert into t values(2,2,2,2);
```

事务5：
```
begin;
insert into t values(5,5,5,5);// ERROR 1062 (23000): Duplicate entry '5' for key 'PRIMARY'
```

事务6：
```
begin;
insert into t values(6,6,6,6);// ok, 没有锁
```

事务7：
```
begin;
insert into t values(10,10,10,10); // ERROR 1062 (23000): Duplicate entry '10' for key 'PRIMARY'
```

事务8：
```
begin;
insert into t values(11,11,11,11);// ok， 没有锁
```

情况2：

如果 update t set b=10 where a = 5; 那么，此时在 (1, 5]加了间隙锁，(5, 10)加了间隙锁,其他地方没有加锁。
还有其他事务的读操作不会查到对应的影响。

