# API
1. .length:  返回或设置一个数组中的元素个数
2. .concat():  将原数组与参数数组或者数据项连接，返回连接后的新数组。不改变原数组。



# 创建数组
## Array构造函数
1. new Array(): //创建一个数组
2. new Array(20); //创建一个length值为20的数组
3. new Array("red","blue"); //创建一个包括两个字符串值的数组
4. Array(3); //使用Array构造函数时可省略new操作符，创建一个包含3项的数组
5. Array("green"); //创建一个包含一项，即字符串"green"的数组

## 数组字面量
6. ["red","blue","green"]; //创建一个包含三个字符串的数组
7. []; //创建一个空数组

# 检测数组
1. value instanceof Array
2. Array.isArray(value)
3. [].constructor===Array;//true
4. Object.prototype.toString.call(arr);//"[object Array]"; s.match(/\[object (.*?)\]/)[1].toLowerCase()
   
# 方法
## 转换方法
1. toString(): 返回数组中以逗号分隔每个值的字符串形式拼接而成的的字符串
2. valueOf(): 数组, 不改变原数组    
3. toLocaleString(): 返回数组中以逗号分隔每个值的字符串形式拼接而成的的字符串
4. join(str): 接受一个参数，即用作分隔符的字符串，返回包含所有数组项的字符串
   
## 栈方法
5. push(): 方法（在数组结尾处）向数组添加一个新的元素, 改变原数组
6. pop(): 弹出数组最后一项，返回弹出项, 改变原数组

## 队列方法
7. shift(): 移出数组第一项，索引前移。返回移出的项, 改变原数组
8. unshift(): 方法（在数组开头处）向数组添加新的元素, 返回添加后的数组长度。改变原数组

## 重排序方法
9. reverse(): 反转数组,改变原数组
10. sort(fn(a,b)): 比较后重排,改变原数组

## 操作方法
11. concat(item1, item2): 将原数组与参数数组或者数据项连接，返回连接后的新数组。不改变原数组
12. slice([begin = 0 [, end = this.length - 1]]): 从数组中截取部分，默认截取全部。截取的新数组是原数组的浅拷贝数组。不改变数组
13. splice(start, deleteCount[, item1[, item2...]): 在指定位置删除数组元素并添加新元素。返回移除的元素数组。改变原数组
14. fill(value [,statrt = 0[, end = this.length]])): 向数组填充指定元素，不指定位置则默认全部填充。返回数组。改变原数组
15. copyWithin(target, start [, end = this.length]): 从数组中截取 start 到 end 的元素，然后从 target 位置开始替换数组的元素，遇到没有需要替换，或者没有可替换的值时停止。改变原数组
16. flat(level): 接受要递归摊平的层级，默认为 1, 不改变原数组
17. flatMap(): 对原数组的每个成员执行一个函数（相当于执行 Array.prototype.map() ），然后对返回值组成的数组执行 flat() 方法。该方法返回一个新数组，不改变原数组。只能展开一层数组。

## 数组查询
18. includes(searchItem, [, startIndex]): 是否包含该项
19. indexOf(searchItem[, startIndex = 0]): 返回索引值，没有查找到则返回 -1
20. lastIndexOf(searchItem[, startIndex = 0]): 返回索引值，没有查找到则返回 -1, 从后面开始查找。

## 数组遍历
21. findIndex((item,index)=>{return Boolean}): 查找到的索引
22. find((item,index)=>{return Boolean}): 查找到的数组项
23. some((item,index)=>{return Boolean}): boolean 是否存在符合要求的项,遍历数组，调用参数函数，若返回true 则查找到该项，停止遍历，返回 true
24. filter((item,index)=>{return Boolean}): 查找到的子数组, 遍历数组，调用参数函数，返回所有调用函数返回值为true 的项组成的新数组。
25. forEach((item,index)=>{ ... }): 遍历数组，调用参数函数
26. map((item,index)=>{ return newItem }): 参数函数返回值组成的新数组
27. reduce(callback[, initialValue]): 遍历调用函数之后的累加处理的值，任意类型
28. reduceRight(callback[, initialValue]): 遍历调用函数之后的累加处理的值，任意类型,从数组尾部开始遍历。
29. keys():  数组索引遍历器接口 Iterator
30. values(): 数组项遍历器接口 Iterator
31. entries(): 数组项遍历器接口 Iterator
32. hasOwnProperty(index): 是否存在索引项
33. propertyIsEnumerable(index): 该索引项是否可枚举。


## 引用

> https://juejin.cn/post/7033648982244982815
> https://www.bookstack.cn/read/es6-3rd/spilt.4.docs-array.md
> https://juejin.cn/post/6893006440181530631
> https://blog.csdn.net/huangpb123/article/details/76861748
> https://rescript-lang.org/docs/manual/latest/api/js/array