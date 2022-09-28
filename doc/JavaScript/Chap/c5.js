var obj = {
    foo: 'Hello',
    bar: 'World'
};

console.log(obj)

var obj1 = {
    'foo': 'Hello',
    'bar': 'World'
};

console.log(obj1)
obj = null
var obj = {
    1: 'a',
    3.2: 'b',
    1e2: true,
    1e-2: true,
    .234: true,
    0xFF: true
};

obj
// Object {
//   1: "a",
//   3.2: "b",
//   100: true,
//   0.01: true,
//   0.234: true,
//   255: true
// }

obj['100'] // true

console.log(obj)

// // 报错
// var obj = {
//     1p: 'Hello World'
//   };

// // 不报错
// var obj = {
//     '1p': 'Hello World',
//     'h w': 'Hello World',
//     'p+q': 'Hello World'
// };

var obj = {
    p: function (x) {
        return 2 * x;
    }
};

var res = obj.p(1) // 2
console.log(res)
console.log(obj.p)

var o1 = {};
var o2 = { bar: 'hello' };
o1.foo = o2;
o1.foo.bar // "hello"

var obj = {
    p: 123,
    m: function () { },
}

var obj = {};
obj.foo = 123;
obj.foo // 123
// ///////////////////
var o1 = {};
var o2 = o1;

o1.a = 1;
o2.a // 1

o2.b = 2;
o1.b // 2
// ///////////////////
var o1 = {};
var o2 = o1;

o1 = 1;
o2 // {}
// ///////////////////
var x = 1;
var y = x;

x = 2;
y // 1

//////////////////////////////////
{ foo: 123 } // 代码块
{ console.log(123) } // 123

({ foo: 123 }) // 正确  解释为对象
// ({ console.log(123) }) // 报错
eval('{foo: 123}') // 123
eval('({foo: 123})') // {foo: 123}

