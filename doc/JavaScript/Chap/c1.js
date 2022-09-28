var x = 1;

switch (x) {
    case true:
        console.log('x 发生类型转换');
        break;
    default:
        console.log('x 没有发生类型转换');
}
// x 没有发生类型转换
var n = 1;
var even = (n % 2 === 0) ? true : false;
console.log(even)

// eventloop
// mainLoop
// if, switch, ?:
// while, for
// do...while
// break
// continue
// label,  break label