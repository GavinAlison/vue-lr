# SQL优化语句

1. 避免`select *`, 避免查多余的数据，避免回表查询
2. 用`union all` 代替 `union` , `union`会排除重复的数据，这个动作需要耗时`file sort`
3. 小表驱动大表， `in` 和 `exists`， `in` 适用于左边大表，右边小表， `exists` 适用于左边小表，右边大表
4. 批量操作， 批量插入比逐条插入， 分多批处理
5. 多用 `limit`, 减少查询数量
6. `in`  值太多, 使用 `limit` 限制
7. 增量查询， 数据同步需要全量和增量， 通过时间划分
8. 高效分页， `limit 10,20 ;`数据少可以，数据量多需要使用子查询或者主键减少查询的数量，`limit 10_000,10 --> where id > 10_000 limit 10`
9. 连接查询代替子查询， 子查询需要创建临时表，查询完毕，需要删除，使用连接查询替代
10. join表不宜过多
11. join 的方式, left join ,inner join ,left join 左小表右大表性能好
12. 控制索引的数量
13. 选择合理字段类型
14. 提升group by 效率，先缩小数据量
15. 索引优化， like, 最左匹配，等值，范围查询
16. 索引失效，
    - 不满足最左前缀原则
    - 范围索引列没有放最后
    - 使用select *
    - 索引列上有计算
    - 索引列使用函数
    - 字符类型没有加引号
    - 用is null和is not null 没注意字段是否为空
    - like 查询左边有 %
    - 使用or关键字
