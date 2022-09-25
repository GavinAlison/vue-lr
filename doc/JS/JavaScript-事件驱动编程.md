并行度

1. 多线程 + 同步式IO
2. 异步式IO + 事件循环

同步/异步， 都是从调用者的角度触发

分布式事务
单机事务

一图胜万言

左：多线程同步式I/O 右：单线程异步式I/

![左：多线程同步式I/O 右：单线程异步式I/O](https://pic2.zhimg.com/v2-4fb2a063661313e5a263980e71ff6051_r.jpg)

然后对图进行解释

同步式I/O和异步式I/O的特点

![同步式I/O和异步式I/O的特点](https://pic1.zhimg.com/v2-164f865901fee147a6264a5683dd3c14_r.jpg)


消息队列
![1](https://pica.zhimg.com/v2-5a64d3fdb37c128fbd756d778c1b2552_720w.jpg?source=d16d100b)


增加micro-task和micro-task队列的概念后，用图表示函数调用这个过程就是：
![2](https://pica.zhimg.com/v2-65105529ae5c9c4bc85b149db9754bd6_720w.jpg?source=d16d100b)

macro-task: setTimeout、setInterval、setImmediate、I/O, UI rendering等

micro-task: process.nextTick、Promises.then、Object.observe等

## 对比
### Timer 在不同语言的差异

而在 Java.util.Timer 中，对于定时任务的解决方案是通过多线程手段实现的，任务对象存储在任务队列，由专门的调度线程，在新的子线程中完成任务的执行。通过 schedule() 方法注册一个异步任务时，调度线程在子线程立即开始工作，主线程不会阻塞任务的运行。

这就是 Javascript 与 Java/C#之类语言的一大差异，即 Javascript 的单线程机制。在现有浏览器环境中，Javascript 执行引擎是单线程的，主线程的语句和方法，会阻塞定时任务的运行，执行引擎只有在执行完主线程的语句后，定时任务才会实际执行，这期间的时间，可能大于注册任务时设置的延时时间。在这一点上，Javascript 与 Java/C#的机制很不同。


java Timer

![timer](http://www.alloyteam.com/wp-content/uploads/2015/10/Timer.png)
