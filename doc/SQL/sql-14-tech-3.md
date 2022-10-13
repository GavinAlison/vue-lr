1. 请说出非关系型数据库的典型产品、特点及应用场景？

memcaced 纯内存
redis  持久化缓存
mongodb 面向文档

2. 请详细描述SQL语句分类及对应代表性关键字

sql语句分类如下

- DDL  数据定义语言，用来定义数据库对象：库、表、列
    代表性关键字：create alter drop select
- DML  数据操作语言，用来定义数据库记录
    代表性关键字:insert delete update
- DCL  数据控制语言，用来定义访问权限和安全级别
    代表性关键字:grant deny revoke

3. 请详细描述char(4)和varchar(4)的差别

char长度是固定不可变的，varchar长度是可变的（在设定内）   
比如同样写入cn字符，char类型对应的长度是4(cn+两个空格),但varchar类型对应长度是2

4. 如何授权mingongge用户从172.16.1.0/24访问数据库

grant all on *.* to mingongge@'172.16.1.0/24' identified by '123456';

5. 什么是MySQL多实例，如何配置MySQL多实例?

mysql多实例就是在同一台服务器上启用多个mysql服务，它们监听不同的端口，运行多个服务进程
它们相互独立，互不影响的对外提供服务

6. 如何加强MySQL安全，请给出可行的具体措施?

1、删除数据库不使用的默认用户
2、配置相应的权限（包括远程连接）
3、不可在命令行界面下输入数据库的密码
4、定期修改密码与加强密码的复杂度

7. delete和truncate删除数据的区别？

前者删除数据可以恢复，它是逐条删除速度慢
后者是物理删除，不可恢复，它是整体删除速度快

8. MySQL Sleep线程过多如何解决？

1、 可以杀掉sleep进程，kill PID
2、 修改配置，重启服务

```mysql
[mysqld]
wait_timeout=600
interactive_timeout=30
如果生产服务器不可随便重启可以使用下面的方法解决

set global wait_timeout=600
set global interactive_timeout=30;
```

9. sort_buffer_size参数作用？如何在线修改生效？

```text
在每个connection(session)第一次连接时需要使用到，来提访问性能
set global sort_buffer_size = 2M
```

10. 如何在线正确清理MySQL binlog？

MySQL中的binlog日志记录了数据中的数据变动，便于对数据的基于时间点和基于位置的恢复,但日志文件的大小会越来越大，点用大量的磁盘空间，因此需要定时清理一部分日志信息

**手工删除：**

首先查看主从库正在使用的binlog文件名称 
`show master(slave) status\G`
删除之前一定要备份
`purge master logs before'2017-09-01 00:00:00'; `
#删除指定时间前的日志
`purge master logs to'mysql-bin.000001';`
#删除指定的日志文件

自动删除：
通过设置binlog的过期时间让系统自动删除日志
`show variables like 'expire_logs_days'; `
`set global expire_logs_days = 30;`

#查看过期时间与设置过期时间

11. Binlog工作模式有哪些？各什么特点，企业如何选择？

1. Row(行模式)
  日志中会记录成每一行数据被修改的形式，然后在slave端再对相同的数据进行修改

2. Statement(语句模式)
  每一条修改的数据都会完整的记录到主库master的binlog里面，在slave上完整执行在master执行的sql语句

3. mixed(混合模式)
 结合前面的两种模式，如果在工作中有使用函数 或者触发器等特殊功能需求的时候，使用混合模式

数据量达到比较高时候，它就会选择 statement模式，而不会选择Row Level行模式

12. 误操作执行了一个drop库SQL语句，如何完整恢复？

1、停止主从复制，在主库上执行锁表并刷新binlog操作，接着恢复之前的全备文件（比如0点的全备）
2、将0点时的binlog文件与全备到故障期间的binlog文件合并导出成sql语句
`mysqlbinlog --no-defaults mysql-bin.000011 mysql-bin.000012 >bin.sql`
3、将导出的sql语句中drop语句删除，恢复到数据库中
`mysql -uroot -pmysql123 < bin.sql`

13. mysqldump备份使用了-A -B参数，如何实现恢复单表？

-A 此参数作用是备份所有数据库（相当于--all-databases）
-B databasename 备份指定数据（单库备份使用）

备份时指定数据库与表名即可在恢复时只恢复单表

14. 详述MySQL主从复制原理及配置主从的完整步骤

主从复制的原理如下：

主库开启binlog功能并授权从库连接主库，从库通过change master得到主库的相关同步信息然后连接主库进行验证，
主库IO线程根据从库slave线程的请求，从master.info开始记录的位置点向下开始取信息，
同时把取到的位置点和最新的位置与binlog信息一同发给从库IO线程,从库将相关的sql语句存放在relay-log里面，
最终从库的sql线程将relay-log里的sql语句应用到从库上，至此整个同步过程完成，之后将是无限重复上述过程

完整步骤如下：

1、主库开启binlog功能，并进行全备，将全备文件推送到从库服务器上
2、show master status\G 记录下当前的位置信息及二进制文件名
3、登陆从库恢复全备文件
4、执行change master to 语句
5、执行start slave and show slave status\G

15. 如何开启从库的binlog功能？

修改配置文件加上下面的配置

```mysql
log_bin=slave-bin
log_bin_index=slave-bin.index
```

需要重启服务

16. MySQL如何实现双向互为主从复制，并说明应用场景?

双向同步主要应用于解决单一主库写的压力，具体配置如下

主库配置

```mysql
[mysqld]
auto_increment_increment  = 2  #起始ID
auto_increment_offset  = 1  #ID自增间隔
log-slave-updates   
从库配置
[mysqld]
auto_increment_increment  = 2  #起始ID
auto_increment_offset  = 2  #ID自增间隔
log-slave-updates 主从库服务器都需要重启mysql服务
```

17. MySQL主从复制故障如何解决？

1、 登陆从库，执行stop slave;停止主从同步
然后set global sql_slave_skip_counter = 1;跳过一步错误
最后执行  start slave;并查看主从同步状态
2、 需要重新进行主从同步操作
进入主库，进行全备数据库并刷新binlog,查看主库此的状态
恢复全备文件到从库，然后执行change master 
开启主从同步start slave;并查看主从同步状态

18. 如何监控主从复制是否故障?

`mysql -uroot -ppassowrd -e "show slave status\G" |grep -E "Slave_IO_Running|Slave_SQL_Running"|awk '{print $2}'|grep -c Yes`

通过判断Yes的个数来监控主从复制状态，正常情况等于2

19. 生产一主多从从库宕机，如何手工恢复？

1、停止与主库的连接
2、 修复好从库数据库
3、 然后重新操作主库同步

20. 工作中遇到过哪些数据库故障，请描述2个例子？

1、开发使用root用户在从库上写入数据造成主从数据不一致，并且前端没有展示需要修改的内容（仍旧是老数据）
#没有控制好用户权限和从库没有设置只读
2、内网测试环境服务器突然断电造成主从同步故障

21. MySQL出现复制延迟有哪些原因？如何解决？

1、需要同步的从库数据太多
2、从库的硬件资源较差，需要提升
3、网络问题，需要提升网络带宽
4、主库的数据写入量较大，需要优配置和硬件资源
5、sql语句执行过长导致，需要优化

22. 给出企业生产大型MySQL集群架构可行备份方案？

1、双主多从，主从同步的架构，然后实行某个从库专业做为备份服务器
2、编写脚本实行分库分表进行备份，并加入定时任务
3、最终将备份服务推送至内网专业服务器，数据库服务器本地保留一周
4、备份服务器根据实际情况来保留备份数据（一般30天）

23. 请解释全备、增备、冷备、热备概念及企业实践经验？

全备：数据库所有数据的一次完整备份，也就是备份当前数据库的所有数据
增备：就在上次备份的基础上备份到现在所有新增的数据
冷备：停止服务的基础上进行备份操作
热备：实行在线进行备份操作，不影响数据库的正常运行

全备在企业中基本上是每周或天一次，其它时间是进行增量备份
热备使用的情况是有两台数据库在同时提供服务的情况，针对归档模式的数据库
冷备使用情况在企业初期，数据量不大且服务器数量不多，可能会执行某些库、表结构等重大操作时

24. 批量更新数据库字符集

```shell
# 通过mysqldump命令备份出一个sql文件，再使用sed命令替换
# 或者执行下面的脚本进行修改
#!/bin/sh
user=root
passwd=123456
cmd="mysql -u$user -p$passwd "
dump="mysqldump -u$user -p$passwd"
for database in `$cmd -e "show databases;"|sed '1,2d'|egrep -v "mysql|performance_schema"`
do
 for tables in `mysqldump -e "show tables from $databses;"|sed '1d'`
 do
  $cmd "alter table $database.$tables engine = InnoDB;"
  done
done
```
25. 网站打开慢，如是数据库慢导致，如何排查并解决？

可以使用top free 等命令分析系统性能等方面的问题
如是因为数据库的原因造成的，就需要查看慢查询日志去查找并分析问题所在

26. 如何调整生产线中MySQL数据库的字符集？

1、首先导出库的表结构 -d 只导出表结构，然后批量替换
2、导出库中的所有数据（在不产生新数据的前提下）
3、然后全局替换set names = xxxxx 
4、删除原有库与表，并新创建出来，再导入建库与建表语句与所有数据
