# 数据库连接超时
1. 原理



venus： 数据库访问层中间件，平安银行PaaS中间件之一，负责数据库分库分表，读写分离，密码加解密等
分片：  分库分表
druid：数据库连接池中间件，阿里巴巴开源
apollo：配置中心
yaml： 数据格式
公共配置： Druid连接池的属性（重要，变动少，且必须要配置），由venus中间件团队维护，业务未配置的情况下，将自动配置完整


MySql的连接超时时间

   
Venus(Druid) --> JDBC Driver --> DB
其中与DB交互会有网络连接，就会涉及到网络连接的超时，以及读写超时

JDBC Driver 向DB创建TCP连接，涉及到 connectTimeout 超时，如果不设置，连接池在创建连接时回发生阻塞

创建TCP连接后，需要进行数据库用户密码验证，这里涉及到读写操作的 socketTimeout，但这个值如果设置太小会影响SQL操作的超时，所以会使用loginTimeout

JDBC URL 种的socket Timeout 覆盖所有的SQL操作超时的控制，这个值必须最大。

连接池种的queryTimeout， transactionQueryTimeout 作用跟 socketTimeout 类似，知识在不同的地方设置，连接池中的区分 事务和非事物的超时

如果应用中某些SQL要求的超时时间比较大，可以在mybatis中对该SQL 进行单独timeout设置，或者jdbc Statement 中设置，将会覆盖连接池的超时，但不会覆盖socketTimeout。

```
配置项  名称    作用域  配置方法    默认值  样例    其他说明
connectTimeout  创建连接超时    连接池初始化时，或连接池无连接，需要创建物理连接时  在jdbc url中配置connectTimeout,属于JDBC驱动的参数，单位ms   无  jdbc:mysql://xxx.xxx.xxx.xxx:3306/xxx?connectTimeout=1000   这里是操作系统层建立socket连接的超时
socketTimeout   与数据库socket通讯超时  从网络连接中读取数据；  
```
