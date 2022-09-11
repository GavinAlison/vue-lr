# 全局API
1. Vue.extend( options )：这个 API 用于创建一个“子类”，参数是一个包含组件选项的对象。用于创建组件构造器，具体在组件的注册有讲解
2. Vue.set( target, key, value )：用于设置 Vue 实例某个对象的属性值，目标对象不能是一个 Vue 实例或 Vue 实例的根数据对象。
3. Vue.delete(target, key)：用于删除Vue 实例某个对象的属性值，目标对象不能是一个 Vue 实例或 Vue 实例的根数据对象。
4. Vue.directive( id, [definition] )：用于注册或获取全局指令。在自定义指令有详细讲解
5. Vue.filter( id, [definition] )：用于注册或获取全局过滤器。在组件过滤器有详细讲解
6. Vue.component( id, [definition] )：注册或获取全局组件。在组件注册有详细讲解
7. Vue.mixin( mixin )：全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。混入除了全局混入还有局部混入，在组件混入有详细讲解

# Vue 实例中的选项

1. data：Vue 实例的数据对象，用于存放数据。实例创建之后，可以通过 vm.$data 访问原始数据对象。Vue 实例也代理了 data 对象上所有的 property，因此访问 vm.a 等价于访问 vm.$data.a。
2. props：props 可以是数组或对象，用于接收来自父组件的数据。
3. computed：Vue 实例的计算属性，用于对 data 中的数据做处理。
4. methods：Vue 实例的方法。
5. watch：Vue 实例的侦听器。
6. el：提供一个在页面上已存在的 DOM 元素作为 Vue 实例的挂载目标。在实例挂载之后，元素可以用 vm.$el 访问。
7. template`： 一个字符串模板作为 Vue 实例的标识使用。模板将会替换挂载的元素。挂载元素的内容都将被忽略，除非模板的内容有分发插槽。
8. 生命周期选项：beforeCreate、created、beforeMount、mounted 、beforeUpdate、updated、activated、deactivated、beforeDestroy、destroyed、errorCaptured
9. directives：Vue 实例的自定义指令。用于局部注册指令时使用
10. filters：Vue 实例的过滤器。用于局部注册过滤器时使用
11. components：Vue 实例的组件。用于局部注册组件时使用
12. mixins：Vue实例的混入。在使用局部混入时使用

# 实例属性与方法

Vue 实例中有一些有用的实例属性与方法，他们在创建实例时，写在配置对象中，创建实例后可以通过
添加前缀 $ 后的属性名调用，以便与用户定义的属性区分， 例如： data、prop。

1. vm.$data：Vue 实例观察的数据对象。
2. vm.$props：当前组件接收到的 props 对象。
3. vm.$el：Vue 实例使用的根 DOM 元素
4. vm.$parent：父实例，如果当前实例有的话。
5. vm.$root：当前组件树的根 Vue 实例。
6. vm.$children：当前实例的直接子组件
7. vm.slots：访问被插槽分发的内容 （子组件中获得插入的内容）
8. vm.$refs：一个对象，持有已注册过 ref 的所有子组件。（父组件中对子组件设置）
9. vm.$attrs：包含了父作用域中不被认为 (且不预期为) props 的特性绑定 (class 和 style 除外)。当一个组件没有声明任何 props 时，这里会包含所有父作用域的绑定 (class 和 style 除外)，并且可以通过 v-bind=”$attrs” 传入内部组件 （子组件中调用，得到父组件传入的没有在 props 属性中声明的属性）
10. vm.$on(event, callback)：监听当前实例上的自定义事件。事件可以由 vm.$emit 触发。回调函数会接收所有传入事件触发函数的额外参数。
12. vm.$once(event, callback)：与 vm.$on() 一致用法，监听一个自定义事件，但是只触发一次，在第一次触发之后移除监听器。

13. vm.$off([event, callback])：移除自定义事件监听器。如果没有提供参数，则移除所有的事件监听器；如果只提供了事件，则移除该事件所有的监听器；如果同时提供了事件与回调，则只移除这个回调的监听器。

14. vm.$mount()：如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。可以使用 vm.$mount() 手动地挂载一个未挂载的实例；参数为一个 dom 或者一个选择器

15. vm.$forceUpdate()：迫使 Vue 实例重新渲染。注意它仅仅影响实例本身和插入插槽内容的子组件，而不是所有子组件。

16. vm.$destroy()：完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。触发 beforeDestroy 和 destroyed 的钩子。



> 引用
> 
> https://blog.csdn.net/qq_45040919/article/details/110955899#:~:text=%E5%85%A8%E5%B1%80API%20Vue.extend%20%28options%29,%EF%BC%9A%E8%BF%99%E4%B8%AA%20API%20%E7%94%A8%E4%BA%8E%E5%88%9B%E5%BB%BA%E4%B8%80%E4%B8%AA%E2%80%9C%E5%AD%90%E7%B1%BB%E2%80%9D%EF%BC%8C%E5%8F%82%E6%95%B0%E6%98%AF%E4%B8%80%E4%B8%AA%E5%8C%85%E5%90%AB%E7%BB%84%E4%BB%B6%E9%80%89%E9%A1%B9%E7%9A%84%E5%AF%B9%E8%B1%A1%E3%80%82