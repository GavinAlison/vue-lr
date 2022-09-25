

class Promise{
    callbacks = [];
    state = 'pending';
    value = null;
    constructor(fn){
        fn(this._resolve.bind(this))
    }
    then(onFulfilled){
        return new Promise(resolve => {
            this._handle({
                onFulfilled: onFulfilled || null,
                resolve: resolve
            });
        });
    }
    _handle(callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback);
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
        this.state = 'fulfilled';//改变状态
        this.value = value;//保存结果
        this.callbacks.forEach(fn => fn(value));
    }
}


function getUserId(url) {
    return new Promise(function (resolve) {
        //异步请求
        http.get(url, function (id) {
            resolve(id)
        })
    })
}
getUserId('some_url').then(function (id) {
    //do something
    return getNameById(id);
}).then(function (name) {
    //do something
    return getCourseByName(name);
}).then(function (course) {
    //do something
    return getCourseDetailByCourse(course);
}).then(function (courseDetail) {
    //do something
});