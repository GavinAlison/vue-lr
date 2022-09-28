/**
 * Promise对象代表一个异步操作
 * Promise.resolve && Promise.reject
 * 
 * 用于将非 Promise 实例包装为 Promise 实例
 * 
 * Promise.resolve('foo')
 * 
 * 
 */
//Promise 完整的实现  + Log
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
    finally(onDone) {
        console.log('[%s]:finally', this.name);

        if (typeof onDone !== 'function') return this.then();

        let Promise = this.constructor;
        return this.then(
            value => Promise.resolve(onDone()).then(() => value),
            reason => Promise.resolve(onDone()).then(() => { throw reason })
        );
    }
    static resolve(value) {
        console.log('Promise::resolve');
        if (value && value instanceof Promise) {
            return value;
        } else if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise(resolve => {
                then(resolve);
            });
        } else if (value) {
            return new Promise(resolve => resolve(value));
        } else {
            return new Promise(resolve => resolve());
        }

    }
    static reject(value) {
        console.log('Promise::reject');
        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new Promise((resolve, reject) => {
                then(reject);
            });
        } else {
            return new Promise((resolve, reject) => reject(value));
        }
    }
    _handle(callback) {
        console.log('[%s]:_handle', this.name, 'state=', this.state);

        if (this.state === 'pending') {
            this.callbacks.push(callback);
            console.log('[%s]:_handle', this.name, 'callbacks=', this.callbacks);
            return;
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected;

        if (!cb) {//如果then中没有传递任何东西
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


// const p1 = new Promise((resolve, reject) => {
//   setTimeout(() => {
//     reject('fail1');
//   }, 5000)
// })

new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('success');
    }, 1000)
}).finally(() => {
    console.log('onDone')
})