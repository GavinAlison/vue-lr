html 的标签

> 引用： https://www.jianshu.com/p/04e541183329

html 标签分类
```
根元素:<html> 
文档元数据:<link>、<meta>、<style>、<style>
内容分区:<header>、<nav>、 <section>、<aside> 、<footer> 、<h1>~<h6> 、<article> 、<address>、<hgroup> 
文本内容:<main>、<div>、<p>、<pre>、<ol>、 <ul>、<li>、<dl> 、<dt>、<dd>、<figure> 、<figcaption>、<blockquote> 、<hr>
内联文本语义:
<span>、<a>、<strong>、<em>、<q>、<br>、<mark>、<code>、<abbr>、<b>、<bdi>、<bdo>、<sub>、<sup>、<time>、<i>、<u>、<cite>、<data>、<kbd>、<nobr>、<s>、<samp>、<tt>、<var>、<wbr>、<rp>、<rt>、<rtc>、<ruby>
图片和多媒体:<img><audio> <video><track><map><area>
内嵌内容:<iframe>、<embed>、<object> 、<param>、<picture>、<source>
脚本:<canvas>、<noscript>、<script>
编辑标识:<del>、<ins> 
表格内容:<table>、<caption>、<thead>、<tbody>、<tfoot>、<tr>、、<col><colgroup>、<th>、<td>
表单:<form> 、<input>、<textarea> 、<label>、<button>、<datalist>、<fieldset>、<legend>、<meter>、<optgroup>、<option>、<output>、<progress>、<select>
交互元素<details>、<summary>、<dialog>、<menu>
Web 组件:<slot>、<template>
过时的和弃用的元素:<acronym><applet><basefont><bgsound><big><blink><center><command><content><dir><element><font><frame><frameset><image><isindex><keygen><listing><marquee><menuitem><multicol><nextid><nobr><noembed><noframes><plaintext><spacer><strike><shadow><tt><xmp>
```

1. 根元素
```
<html>  HTML文档的根
```

2. 文档元数据
```
<link> 链接
<meta> 元数据信息，(<base>, <link>, <script>, <style> 或 <title>不能表示的元数据信息) 
<style> 样式信息
<style> 文档标题
```
3. 内容分区
```
<header> 表示一组引导性的帮助
<nav>  导航
<section> 表示文档中的一个区域（或节），通过是否含一个标题作为子节点来辨识<section>
<aside> 表示与其余页面无关的内容部分
<footer> 表示最近一个章节内容或者根节点元素的页脚
<h1>~<h6> 标题
<article> 表示文档、页面、应用或网站中的独立结构
<address> 地址信息
<hgroup> 代表一个段的标题
```

4. 文本内容

```
<main> 文档<body>或应用的主体部分
<div> 文档分区元素， 通用型流内容容器
<p> 段落
<pre> 预定义格式文本
<ol> 有序列表
<ul> 无序列表
<li> 列表条目元素
<dl> 描述列表元素
<dt>术语定义元素
<dd> 描述元素，描述列表  (<dl>) 的子元素，<dd>与 <dt> 一起用。
<figure> 代表一段独立的内容, 经常与说明(caption) <figcaption> 配合使用
<figcaption>图片说明/标题，于描述其父节点 <figure> 元素里的其他数据
<blockquote> HTML 块级引用元素
<hr>表示段落级元素之间的主题转换，视觉上看是水平线
```

5. 内联文本语义

```
<kbd> 表示用户输入
<span> 通用行内容器
<a> 超链接
<strong> 粗体显示
<em> 标记出需要用户着重阅读的内容，可通过嵌套加深着重程度
<q> 短的引用文本
<br> 换行
<mark> 代表突出显示的文字，可以用来显示搜索引擎搜索后关键词。
<code> 呈现一段计算机代码
<abbr> 缩写，并可选择提供一个完整的描述
<b>提醒注意，样式和粗体类似（不要用于显示粗体，用css font-weight来创建粗体）
<bdi> 双向隔离元素
<bdo> 双向覆盖元素
<sub> 排低文本
<sup> 排高文本
<time> 时间
<i> 区分普通文本的一系列文本，内容通常以斜体显示
<u> 使文本在其内容的基线下的一行呈现下划线
<cite> 表示一个作品的引用
<data> 将一个指定内容和机器可读的翻译联系在一起。但如果内容是与 time 或者 date 相关的，一定要使用 <time>。
<dfn> 表示术语的一个定义
<kbd> 表示用户输入
<nobr> 阻止文本自动拆分成新行，不应该使用，应该使用css属性
<s> 删除线，提倡使用 <del> 和 <ins> 元素
<samp> 标识计算机程序输出
<tt> 电报文本元素
<var> 表示变量的名称，或者由用户提供的值
<wbr> 一个文本中的位置，其中浏览器可以选择来换行
<rp><rt><rtc><ruby>
```

6. 图片和多媒体

```
HTML 支持各种多媒体资源，例如图像，音频和视频。
<img> 图片
<audio> 音频内容
<video> 视频内容
<track> 被当作媒体元素—<audio> 和 <video>的子元素来使用。它允许指定计时字幕（或者基于事件的数据），例如自动处理字幕。
<map> 与 <area> 属性一起使用来定义一个图像映射(一个可点击的链接区域).
<area> 在图片上定义一个热点区域，可以关联一个超链接。<area>元素仅在<map>元素内部使用。

```

7. 内嵌内容

```
<iframe> 表示嵌套的浏览上下文，有效地将另一个HTML页面嵌入到当前页面中。
<embed> 将外部内容嵌入文档中的指定位置
<object> 表示引入一个外部资源
<param>  定义了 <object>的参数
<picture> 容器，用来为其内部特定的 <img> 元素提供多样的 <source> 元素。
<source> 资源

```

8. 脚本

```
<canvas> 通过脚本（通常是JavaScript）绘制图形
<noscript> 替代未执行脚本
<script> 用于嵌入或引用可执行脚本
```

9. 编辑标识

```
<del>  表示一些被从文档中删除的文字内容
<ins>  定义已经被插入文档中的文本
```

10. 表格内容

```
<table> 表格
<caption> 表格的标题，通常作为 <table> 的第一个子元素出现
<thead> 表格页眉
<tbody> 表格主体
<tfoot> 表格页脚
<tr> 行
<col> 列， 通常位于<colgroup>元素内
<colgroup> 表格列组
<th> 表头
<td> 表格单元
```



