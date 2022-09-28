'abc'
"abc"


'key = "value"'
"It's a long journey"



'Did she say \'Hello\'?'
// "Did she say 'Hello'?"

"Did she say \"Hello\"?"
// "Did she say "Hello"?"

// var tmp = 'a
// b
// c'
// console.log(tmp)
// SyntaxError: Unexpected token ILLEGAL
var longString = 'Long \
long \
long \
string';

console.log(longString)

var longString = 'Long '
    + 'long '
    + 'long '
    + 'string';
console.log(longString)

    (function () { /*
line 1
line 2
line 3
*/}).toString().split('\n').slice(1, -1).join('\n')
// "line 1
// line 2
// line 3"

