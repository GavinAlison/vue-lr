# deadlock

mysql RR级别，间隙锁

```sql
create table `paidup_item`(
    `id` bigint(20) not null auto_increment comment '主键',
    `contract_id` bigint(20) default null comment '合同id',
    `paidup_id` bigint(20) default null comment '收退款id',
    `status` tiny_int(4) default '1' comment '状态',
    `update_by` varchar(20) comment '更新人id',
    `update_time` timestamp null default null comment '更新时间',
    primary key(`id`),
    key `idx_on_paidup_id`(`paidup_id`)
) engine=innodb auto_increment=179518 default charset=utf8 comment='付款明细表';

insert into `paidup_item` values(111, 128495, 1, 11, '2022-10-10 12:00:00'),
(222, 128496, 1, 12, '2022-10-10 12:00:00'),
(333, 128497, 1, 13, '2022-10-10 12:00:00');
```

session1:
```sql
begin;
update paidup_item set status = 0, update_time=now() where paidup_id=128498;

insert into `paidup_item` values(444, 128498, 1, 14, now());

commit;
```

session2:
```sql
begin;
update paidup_item set status = 0, update_time=now() where paidup_id=128499;
insert into `paidup_item` values(555, 128499, 1, 14, now());

commit;
```

## 异常是如何产生的

a) session-A 执行第1步：update paidup_item set status=0,updated_time=now() where paidup_id=128498;INNODB以独占锁锁定全部通过WHERE条件找到的索引项，并用共享锁锁定他们之间的间隙。符合条件的记录不存在，在index_on_paidup_id索引上不加行锁；在区间（128497，无穷大）上加共享的间隙锁。

b) session-B执行第2步：update paidup_item set status=0,updated_time=now() where paidup_id=128499;符合条件的记录不存在，在index_on_paidup_id索引上不加行锁；在区间（128497，无穷大）上加共享的间隙锁。

c) session-A执行第3步：insert into paidup_item (...) values (???)       paidup_id=128498        由于session-B也占用了index_on_paidup_id 上 区间（128497，无穷大）的间隙锁，session-A要插入的数据正好处于被占区间，因此session-A阻塞等待session-B释放间隙锁。

d) session-B执行第4步：insert into paidup_item (...) values (???)       paidup_id=128499由于session-A占用了index_on_paidup_id 上 区间（128497，无穷大）的间隙锁，session-B要插入的数据正好处于被占区间，此时，session-B也需要阻塞等待session-A释放锁资源。到这一步，mysql已经能主动检测到死锁，对其中一个事务进行回滚，另一个事务就能继续执行。因此出现session-B抛Deadlock found… ，而session-A执行成功。

## 解决方案

找到原因后，解决方案就有好多种，思路就是避免产生间隙锁。在作update之前 先select 看是否存在记录，存在才去update。已于11月25号上线，之后未出现类似异常。
