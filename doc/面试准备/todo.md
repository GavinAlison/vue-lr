你准备面试项目有什么？

1. 整体流程
2. 我负责的项目，亮点，数据量支持多少，时间是多少？性能测试的比例是多少？
3. 业务流程的log查看，不用看黑窗口进行查看，到页面上查看，支持链路查看，定位问题
4. 为什么辞职？
   1. 不喜欢搞办公室PUA，嘴巴很臭，各种骂人的话，我就喜欢好好干活，加班太狠，几乎每天10点下班，经常通宵
   2. 产品需求，只是一直在基于不同的环境改，基于物理机器，docker, k8s环境，每天都变，同时在改
5. 技术面试
   1. 微服务的nacos, eureka,  openfeign, 链路调用
   2. 线程池，7大参数，策略模式
   3. spring 技术，缓存，多数据源，多租户，权限，认证sso
   4. 定时调度
   5. 批次处理，性能优化，框架并行化
   6. cas 和 lock 锁，AQS 机制
   7. 大数据量 7kw 条报表数据，数据源同步任务，运行获取数据sql超时。

```text
大数据量7kw条报表数据，数据源同步任务，运行获取数据sql超时。
因为数据库超时配置是10m,实际该sql运行时间3500s。此情况针对大数据量，有三种方案
1. 数据库连接超时配置加长
2. sql优化，通过分页处理
3. 将数据库从mysql替换成olap数据库gp，从网上的测试案例查看多表联查的聚合用时不超过1分钟

指标规则导入问题
1. 通过excel将指标的计算规则导入到系统中，发现对应的表达式没有做检查，直接通过，后面出现数据计算异常的情况

解决方案:
规范下指标规则的处理方式，通过手动录入一条条数据，并对规则做校验
同时通过excel将多个指标导入，导入之后显示对应的所有指标数据，然后通过规则校验，进行导入检查合法性

定时同步问题
1. 无法在页面上查看执行的过程，有多少同步任务，执行那一步出现错误

解决方案：
引入调度任务系统，可以通过可视化的方式查看同步任务的数据量，状态，执行过程的log，对任务进行启动，定时启动，暂停，停止，重跑等操作

批量插入问题
将数据全部插入到数据库中，使用的内存存储数据，一条条插入导致执行速度超级慢

解决方案：将一条条插入修改为5000条一次，然后添加对应的事务，时间由原来的1分钟缩短到2s中。

```

上班永远都是别人的产品，不是自己的产品，不可以自己掌握整体的方向，没有方向，上哪儿看
职场规则有时候是涨薪20%，只是因为你没有特别的能力，没有能力，那么这个只是上限
如何破除上限，实现自我价值体现，让自己可以获得更多的利益呢？

趋利避害是人的天性，想要更多利益没有错，由于想要利益更大化导致的不诚实，也不是什么大问题，不然你让满口瞎话的销售怎么活？

所以，你可以贪心，你也可以因为贪心而不诚实，但既然你选择了不诚实，那就要有完整的策略不被轻易识破。

天天加班的不去，没有自己的时间，没法让自己沉淀下来的也不去，薪资还是需要上去。
产品需要有自己的独特性
或者自己做些小东西，自己找出路

持续输出一个东西，这个东西是一个事业，同时是一个产品，而且这个东西只有自己参与，自己有绝对的把控权

调度的框架选择

- 通过timer，有问题
- 通过 ScheduledThreadPoolExecutor
- quartz
- 通过 xxl-job 调度平台
- 通过 elastic-job 调度平台
- 通过 dolphinScheduler 调度平台
