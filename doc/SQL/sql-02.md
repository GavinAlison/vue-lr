# 数据库分类

- 关系型数据库, oracle、mysql、sql server、db2、postgresql、sqlite3
- noSql数据库, redis、MongoDB、DB2、XML数据库

## SQL语句及其种类

- DDL 数据定义语句
  - create
  - drop
  - alter
- DML 数据操作语句
  - select
  - insert
  - update
  - delete
- DCL 数据控制语句
  - commit
  - rollback
  - grant
  - revoke  取消用户操作的权限

## 数据类型

- integer  数字型，但不能存储小数
- char  定长字符串类型，指定最大长度，不足使用空格填充
- varchar   可变长度字符串类型，指定最大长度，不足不填充
- date  存储日期，年/月/日 

## mysql 的基本操作

```sql
-- windows

-- 启动mysql
net start mysql
-- 创建windows服务
sc create mysql binPath= mysqld_bin_path (注意：等号与值之间有空格)

-- 连接数据库
mysql -h 地址 -P 端口 -u 用户名 -p 密码

SHOW PROCESSLIST -- 显示哪些线程正在运行
SHOW VARIABLES -- 显示系统变量信息

```

数据库操作
```sql
-- 查看当前数据库
select database();
-- 显示当前时间、用户名、数据库版本
select now(), user(), version();
-- 创建库
create database if not exists 数据库名 数据库选项
数据库选项
    character set charset_name
    collate collaction_name
-- 查看已有库
show databases [like 'pattern'];
-- 查看当前库信息
show create database 数据库名
-- 修改库的选项信息
ALTER DATABASE 库名 选项信息
-- 删除库
DROP DATABASE[ IF EXISTS] 数据库名
    同时删除该数据库相关的目录及其目录内容


```

表的操作

```sql
-- 创建表
CREATE [TEMPORARY] TABLE[ IF NOT EXISTS] [库名.]表名 ( 表的结构定义 )[ 表选项]
每个字段必须有数据类型
最后一个字段后不能有逗号
TEMPORARY 临时表，会话结束时表自动消失
对于字段的定义：
   字段名 数据类型 [NOT NULL | NULL] [DEFAULT default_value] [AUTO_INCREMENT] [UNIQUE [KEY] | [PRIMARY] KEY] [COMMENT 'string']
-- 表选项
  -- 字符集
  CHARSET = charset_name
  如果表没有设定，则使用数据库字符集
  -- 存储引擎
  ENGINE = engine_name
  表在管理数据时采用的不同的数据结构，结构不同会导致处理方式、提供的特性操作等不同
  常见的引擎：InnoDB MyISAM Memory/Heap BDB Merge Example CSV MaxDB Archive
  不同的引擎在保存表的结构和数据时采用不同的方式
  MyISAM表文件含义：.frm表定义，.MYD表数据，.MYI表索引
  InnoDB表文件含义：.frm表定义，表空间数据和日志文件
  SHOW ENGINES -- 显示存储引擎的状态信息
  SHOW ENGINE 引擎名 {LOGS|STATUS} -- 显示存储引擎的日志或状态信息
    -- 自增起始数
        AUTO_INCREMENT = 行数
    -- 数据文件目录
        DATA DIRECTORY = '目录'
    -- 索引文件目录
        INDEX DIRECTORY = '目录'
    -- 表注释
        COMMENT = 'string'
    -- 分区选项
        PARTITION BY ... (详细见手册)

-- 查看所有表
SHOW TABLES[ LIKE 'pattern']
SHOW TABLES FROM 表名

-- 查看表机构
SHOW CREATE TABLE 表名 （信息更详细）
DESC 表名 / DESCRIBE 表名 / EXPLAIN 表名 / SHOW COLUMNS FROM 表名 [LIKE 'PATTERN']
SHOW TABLE STATUS [FROM db_name] [LIKE 'pattern']

-- 修改表
   -- 修改表本身的选项
    ALTER TABLE 表名 表的选项
    eg: ALTER TABLE 表名 ENGINE=MYISAM;
    -- 对表进行重命名
    RENAME TABLE 原表名 TO 新表名
    RENAME TABLE 原表名 TO 库名.表名 （可将表移动到另一个数据库）
    -- RENAME可以交换两个表名
    -- 修改表的字段机构（13.1.2. ALTER TABLE语法）
       ALTER TABLE 表名 操作名
       -- 操作名
          ADD[ COLUMN] 字段定义       -- 增加字段
            AFTER 字段名          -- 表示增加在该字段名后面
            FIRST               -- 表示增加在第一个
            ADD PRIMARY KEY(字段名)   -- 创建主键
            ADD UNIQUE [索引名] (字段名)-- 创建唯一索引
            ADD INDEX [索引名] (字段名) -- 创建普通索引
            DROP[ COLUMN] 字段名      -- 删除字段
            MODIFY[ COLUMN] 字段名 字段属性     -- 支持对字段属性进行修改，不能修改字段名(所有原有属性也需写上)
            CHANGE[ COLUMN] 原字段名 新字段名 字段属性      -- 支持对字段名修改
            DROP PRIMARY KEY    -- 删除主键(删除主键前需删除其AUTO_INCREMENT属性)
            DROP INDEX 索引名 -- 删除索引
            DROP FOREIGN KEY 外键    -- 删除外键
-- 删除表
    DROP TABLE[ IF EXISTS] 表名 ...

-- 清空表数据
    TRUNCATE [TABLE] 表名

-- 复制表结构
    CREATE TABLE 表名 LIKE 要复制的表名

-- 复制表结构和数据
    CREATE TABLE 表名 [AS] SELECT * FROM 要复制的表名

-- 检查表是否有错误
    CHECK TABLE tbl_name [, tbl_name] ... [option] ...

-- 优化表
   OPTIMIZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ...

-- 修复表
   REPAIR [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ... [QUICK] [EXTENDED] [USE_FRM]

-- 分析表
   ANALYZE [LOCAL | NO_WRITE_TO_BINLOG] TABLE tbl_name [, tbl_name] ...
```


> link: https://www.zhihu.com/question/483663816/answer/2217840734
> https://mp.weixin.qq.com/s?__biz=MzI0MDQ4MTM5NQ==&mid=2247491863&idx=1&sn=8f391add16b37c3d0676952bd8891afd&chksm=e918840bde6f0d1d69c225ef74071658a066d2f7006eaea7ac9afa5bb92c14ce91c641459662&token=821580240&lang=zh_CN#rd

