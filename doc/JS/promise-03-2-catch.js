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
 * catch
 */
let promiseCount = 1;
class Promise {
    callbacks = [];
    name = '';
    state = 'pending';//增加状态
    value = null;//保存结果
    constructor(fn) {
        this.name = `Promse-${promiseCount++}`;
        console.log('[%s]:constructor', this.name);
        fn(this._resolve.bind(this), this._reject.bind(this));
    }
    then(onFulfilled, onRejected) {
        console.log('[%s]:then', this.name);
        return new Promise((resolve, reject) => {
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            });
        });
    }
    catch(onError) {
        console.log('[%s]:catch', this.name);
        return this.then(null, onError);
    }
    _handle(callback) {
        console.log('[%s]:_handle', this.name, 'state=', this.state);
        if (this.state === 'pending') {
            this.callbacks.push(callback);
            console.log('[%s]:_handle', this.name, 'callbacks=', this.callbacks);
            return;
        }
        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;
        if (!cb) {
            //如果then中没有传递任何东西
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
            cb(this.value);
            return;
        }
        let ret;

        try {
            ret = cb(this.value);
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject;
        } catch (error) {
            ret = error;
            cb = callback.reject
        } finally {
            cb(ret);
        }
    }
    _resolve(value) {
        console.log('[%s]:_resolve', this.name);
        console.log('[%s]:_resolve', this.name, 'value=', value);
        if (value && (typeof value === 'object' || typeof value === 'function')) {
            var then = value.then;
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this), this._reject.bind(this));
                return;
            }
        }

        this.state = 'fulfilled';//改变状态
        this.value = value;//保存结果
        this.callbacks.forEach(callback => this._handle(callback));
    }
    _reject(error) {

        console.log('[%s]:_reject', this.name);
        console.log('[%s]:_reject', this.name, 'value=', error);

        this.state = 'rejected';
        this.value = error;
        this.callbacks.forEach(callback => this._handle(callback));
    }
}

/**
 * 模拟异常异步请求
 * @param {*} url 
 * @param {*} s 
 * @param {*} callback 
 */
const mockAjax = (url, s, callback) => {
    setTimeout(() => {
        callback(url + '异步请求耗时' + s + '秒');
    }, 1000 * s)
}


const p1 = new Promise(function (resolve, reject) {
    setTimeout(() => reject(new Error('fail')), 3000)
})

const p2 = new Promise(function (resolve, reject) {
    setTimeout(() => resolve(p1), 1000)
})

p2
    .then(result => console.log(result))
    .catch(error => console.log(error))
