/**
 * Promise对象代表一个异步操作，有三种状态：
 * Pending（进行中）、
 * Resolved（已完成 ，又称Fulfilled）和 
 * Rejected（已失败）
 * 
 * resolve(data)将这个promise标记为resolved，
 * 然后进行下一步then((data)=>{//do something})，
 * resolve里的参数就是传入then的数据
 * 
 * 执行到 resolve()这个方法的时候，就改变promise的状态为resolved，
 * 当状态为 resolved的时候就可以执行.then()
 * 
 * 当执行到 reject() 这个方法的时候，就改变 promise的状态为 reject，
 * 当promise为reject就可以.catch()这个promise了
 * 
 * 链式调用2-3
 */

let promiseCount = 1;
//完整的实现 测试Demo
class Promise {
    callbacks = [];
    name = '';
    state = 'pending';//增加状态
    value = null;//保存结果
    constructor(fn) {
        this.name = `Promse-${promiseCount++}`;
        console.log('[%s]:constructor', this.name);
        fn(this._resolve.bind(this));
    }
    then(onFulfilled) {
        console.log('[%s]:then', this.name);
        return new Promise(resolve => {
            this._handle({
                onFulfilled: onFulfilled || null,
                resolve: resolve
            });
        });
    }
    _handle(callback) {
        console.log('[%s]:_handle', this.name, 'state=', this.state);

        if (this.state === 'pending') {
            this.callbacks.push(callback);
            console.log('[%s]:_handle', this.name, 'callbacks=', this.callbacks);
            return;
        }
        //如果then中没有传递任何东西
        if (!callback.onFulfilled) {
            callback.resolve(this.value);
            return;
        }
        var ret = callback.onFulfilled(this.value);
        callback.resolve(ret);
    }
    _resolve(value) {
        console.log('[%s]:_resolve', this.name);
        console.log('[%s]:_resolve', this.name, 'value=', value);

        if (value && (typeof value === 'object' || typeof value === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this));
                return;
            }
        }

        this.state = 'fulfilled';//改变状态
        this.value = value;//保存结果
        this.callbacks.forEach(callback => this._handle(callback));
    }
}

/**
 * 模拟异步请求
 * @param {*} url 
 * @param {*} s 
 * @param {*} callback 
 */
const mockAjax = (url, s, callback) => {
    setTimeout(() => {
        callback(url + '异步请求耗时' + s + '秒');
    }, 1000 * s)
}

new Promise(resolve => {
    mockAjax('getUserId', 1, function (result) {
        resolve(result);
    })
}).then(result => {
    console.log(result);
    //对result进行第一层加工
    let exResult = '前缀:' + result;
    return exResult;
}).then(exResult => {
    console.log(exResult);
    let xxResult = exResult + ':后缀';
    return xxResult;
}).then(finalResult => {
    console.log(finalResult);
});
