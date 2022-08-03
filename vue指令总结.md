vue 常用指令有：
- v-once指令
- v-show指令
- v-if指令
- v-else指令
- v-else-if指令
- v-for指令
- v-html指令
- v-text指令
- v-bind指令
- v-on指令
- v-model指令

1. v-once

加了 v-once指令 不会改变了

2. v-show

让元素不显示，
和v-if一样 区别是if是注释掉 v-show是给一个display：none的属性 让它不显示！  
v-show和v-if的区别：  
v-if 是真实的条件渲染，因为它会确保条件块在切换当中适当地销毁与重建条件块内的事件监听器和子组件； v-show 则只是简单地基于 CSS 切换。  

v-if 有更高的切换消耗而 v-show 有更高的初始渲染消耗。因此，如果需要频繁切换使用 v-show 较好，如果在运行时条件不大可能改变则使用 v-if 较好。  

3. v-if
   
v-if后面的是一个表达式或者也可以是返回true或false的表达式。 且值为true和fasle false的话就会被注释 v-show是给一个display：none的属性 让它不显示！ true就正常显示。

```
　<p v-if="height > 1.7">小明的身高是: {{height}}m</p>
```
4. v-else

必须和v-if一起用才可以 不能单独用 而且必须在v-if下面 中间有别的标签也会报错

5. v-else-if

```
<p v-if="score >= 90">优秀</p>
<p v-else-if="score >= 75">良好</p>
<p v-else-if="score >= 60">及格</p>
<p v-else>不及格</p>
```

6. v-for

基于数据渲染一个列表，类似于JS中的遍历。其数据类型可以是 Array | Object | number | string

该指令之值，必须使用特定的语法(item, index) in items, index是索引，可以省略。item是 为当前遍历元素提供别名(可以自己随便起名字) 。v-for的优先级别高于v-if之类的其他指令

```
<p v-for="(d,index) in msg">
    {{index +':'+d}}
</p>
```

7. v-html

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，你需要使用 v-html 而且给一个标签加了v-html 里面包含的标签都会被覆盖。

注意v-html要慎用 因为会出现安全问题 官网解释为：你的站点上动态渲染的任意 HTML 可能会非常危险，因为它很容易导致 XSS 攻击。请只对可信内容使用 HTML 插值，绝不要对用户提供的内容使用插值。

```
<div id="app" v-html="html">
　　<p v-text="msg">哈哈哈</p>  
</div>
<script type="text/javascript">
new Vue({
    el:'#app',
    data:{
        msg:'我爱敏敏！！',
        html:'<p>大海森林我都不爱！</p>'
    }
})
</script>
```

8. v-text

给一个便签加了v-text 会覆盖标签内部原先的内容 如下面的例子  

9. v-bind

```
<!-- 完整语法 --> 
<a v-bind:href="url">...</a> 
<!-- 缩写 --> <a :href="url">...</a>
```
绑定属性，还可以绑定类名和css样式等
```
<p v-for="(college, index) in colleges" :class="index === activeIndex ? 'active': ''" >
    {{college}}
</p>
<p :style="{color: fontColor}">今天的天气很好!</p>
```

10.  v-on

绑定事件的

```
<!-- 完整语法 -->
<a v-on:click="doSomething">...</a> 
<!-- 缩写 --> 
<a @click="doSomething">...</a>
```

11. v-model

v-model是一个指令，限制在`<input>、<select>、<textarea>、components`中使用 用于数据的双向绑定操作.






> https://www.php.cn/vuejs/464673.html