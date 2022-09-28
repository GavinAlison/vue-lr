var a = undefined;
// 或者
var a = null;
if (!undefined) {
    console.log('undefined is false'); // undefined is false
}


if (!null) {
    console.log('null is false'); // null is false
}

console.log(undefined == null)  // true

Number(null) // 0
5 + null // 5

Number(undefined) // NaN
5 + undefined // NaN

if ('') {
    console.log('boolean--true');
}
// 没有任何输出

if ([]) {
    console.log('true');
}
// true

if ({}) {
    console.log('true');
}
  // true