# 类型分类

早期

- 五种数据类型（对象、整数、浮点数、字符串和布尔值）

后期--正确

- 基础，原始类型，primitive type（数值number,字符串string,布尔值boolean）
- 合同，复合类型，complex type （对象，null, undefined）
  - 对象又分 普通对象，数组Array，函数function

# typeof运算符

运算符可以返回一个值的数据类型


```
JavaScript 有三种方法，可以确定一个值到底是什么类型。

typeof运算符
instanceof运算符
Object.prototype.toString方法

typeof 123 // "number"
typeof '123' // "string"
typeof false // "boolean"

function f() {}
typeof f  // "function"

typeof undefined // "undefined"

v // ReferenceError: v is not defined
typeof v  // "undefined"

// 正确的写法
if (typeof v === "undefined") {
  // ...
}

typeof window // "object"
typeof {} // "object"
typeof [] // "object"

var o = {};
var a = [];
o instanceof Array // false
a instanceof Array // true

typeof null // "object"
```

# null 和undefined

区别是这样的：null是一个表示“空”的对象，转为数值时为0；undefined是一个表示"此处无定义"的原始值，转为数值时为NaN

## 用法和含义

null表示空值，即该处的值现在为空。调用函数时，某个参数未设置任何值，这时就可以传入null，表示该参数为空。
比如，某个函数接受引擎抛出的错误作为参数，如果运行过程中未出错，那么这个参数就会传入null，表示未发生错误。

undefined表示“未定义”
```
// 变量声明了，但没有赋值
var i;
i // undefined

// 调用函数时，应该提供的参数没有提供，该参数等于 undefined
function f(x) {
  return x;
}
f() // undefined

// 对象没有赋值的属性
var  o = new Object();
o.p // undefined

// 函数没有返回值时，默认返回 undefined
function f() {}
f() // undefined
```

# 布尔值

下列运算符会返回布尔值：
```
前置逻辑运算符： ! (Not)
相等运算符：===，!==，==，!=
比较运算符：>，>=，<，<=
```
转换规则是除了下面六个值被转为false，其他值都视为true。
```
undefined
null
false
0
NaN
""或''（空字符串）
```

# 字符串

字符串就是零个或多个排在一起的字符，放在单引号或双引号之中。

## 转义

反斜杠（\）在字符串内有特殊含义，用来表示一些特殊字符，所以又称为转义符

```
\0 ：null（\u0000）
\b ：后退键（\u0008）
\f ：换页符（\u000C）
\n ：换行符（\u000A）
\r ：回车键（\u000D）
\t ：制表符（\u0009）
\v ：垂直制表符（\u000B）
\' ：单引号（\u0027）
\" ：双引号（\u0022）
\\ ：反斜杠（\u005C）
```

反斜杠还有三种特殊用法。
（1）\HHH

反斜杠后面紧跟三个八进制数（000到377），代表一个字符。HHH对应该字符的 Unicode 码点，比如\251表示版权符号。显然，这种方法只能输出256种字符。

（2）\xHH

\x后面紧跟两个十六进制数（00到FF），代表一个字符。HH对应该字符的 Unicode 码点，比如\xA9表示版权符号。这种方法也只能输出256种字符。

（3）\uXXXX

\u后面紧跟四个十六进制数（0000到FFFF），代表一个字符。XXXX对应该字符的 Unicode 码点，比如\u00A9表示版权符号。

如果在非特殊字符前面使用反斜杠，则反斜杠会被省略。

如果字符串的正常内容之中，需要包含反斜杠，则反斜杠前面需要再加一个反斜杠，用来对自身转义。

## 字符串与数组

字符串可以被视为字符数组，因此可以使用数组的方括号运算符，用来返回某个位置的字符（位置编号从0开始）。

如果方括号中的数字超过字符串的长度，或者方括号中根本不是数字，则返回undefined。

