## Promise

现在已经成为了主流的异步编程的操作方式,
Promise 主要是为了解决异步的回调地狱

## 状态, 3种

- 待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
- 已兑现（fulfilled）: 意味着操作成功完成。
- 已拒绝（rejected）: 意味着操作失败。


## Promise 基本用法
1. new Promise(function(resolve, reject){...}): 构造创建promise对象，异步对象
2. .then():  用来处理执行结果
3. .catch(): 当 promise 被拒绝时, catch 回调就会被执行:
4. Promise.all:  多个异步交互, 但只在所有请求完成之后then才会做出响应，; 如果某个 promise 被拒绝, 则 catch 将会被第一个拒绝(rejection)所触发
5. Promise.race:  只要某个 priomise 被 resolved 或者 rejected, 就会触发 Promise.race