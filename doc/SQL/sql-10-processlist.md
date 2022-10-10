# show processlist

 是显示用户正在运行的线程

show processlist 主要的字段

```text
id: 线程id,可以通过kill id,关闭该线程
User: 启动这个线程的用户
Host:  发送请求的客户端的 IP 和 端口号
DB: 当前执行的命令是在哪一个数据库上。如果没有指定数据库，则该值为 NULL 。
Command: 指此刻该线程正在执行的命令
Time: 表示该线程处于当前状态的时间。
State: 线程的状态
Info: 一般记录的是线程执行的语句。默认只显示前100个字符，也就是你看到的语句可能是截断了的，要看全部信息，需要使用 show full processlist。
```

有用的SQL

按客户端 IP 分组，看哪个客户端的链接数最多

```sql

select  client_ip, 
        count(client_ip) as client_num 
from ( 
        select substring_index(host, ':', 1) as client_ip 
        from `information_schema`.`processlist` 
    ) as connect_info 
group by client_ip 
order by client_num desc;
```

查看正在执行的线程，并按 Time 倒排序，看看有没有执行时间特别长的线程

```sql
select * 
from information_schema.processlist 
where Command != 'Sleep' 
order by Time desc;
```

找出所有执行时间超过 5 分钟的线程，拼凑出 kill 语句，方便后面查杀

```sql
select concat('kill ', id, ';')  as sqltext
from `information_schema`.`processlist` 
where Command != 'Sleep' 
    and Time > 300 
order by Time desc;
```


> https://www.cnblogs.com/ScarecrowAnBird/p/14192018.html