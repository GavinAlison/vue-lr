# 深度分页的问题

为什么会产生，如何解决？

`select * from employees ORDER BY name limit 10000,10;`

`select id,name from employees ORDER BY name limit 10000,10;`

`EXPLAIN select * from employees e inner join ( select id from employees ORDER BY name limit 10000,10) tem on tem.id = e.id;`

或者通过`where id >= 10000 and id < 10010`