#!/bin/bash

# 配置jdk
vi /etc/profile.d/jdk.sh

export JAVA_HOME=/opt/jdk1.8
export CLASSPATH=.:%JAVA_HOME%/lib/dt.jar:%JAVA_HOME%/lib/tools.jar
export PATH=$PATH:$JAVA_HOME/bin

export MAVEN_HOME=/opt/module/apache-maven-3.8.6
export PATH=$PATH:${MAVEN_HOME}/bin

# 保存

# 导入对应的jar包，编写启动服务脚本
# hadoop102
# 拷贝jdk.sh文件
/root/bin/xsync /etc/profile.d/jdk.sh 
# 拷贝/opt/module/applog下面的jar包，模拟生成数据的jar包,gmall2020-mock-log-2021-01-22.jar
/root/bin/xsync /opt/module/applog


# 编写脚本
vi /opt/module/data-warehouse-script/lg.sh

#!/bin/bash


function start_gmail() {
    cd /opt/module/applog/
    java -jar gmall2020-mock-log-2021-01-22.jar >/dev/null 2>&1 &
}

start_gmail

for i in  hadoop104 hadoop106;
do
    echo "========$i========="
    ssh $i "cd /opt/module/applog/; java -jar gmall2020-mock-log-2021-01-22.jar >/dev/null 2>&1 &"
done

# 执行脚本
sh -x  /opt/module/data-warehouse-script/lg.sh

# 集群所有进程查看脚本

vim xcall.sh
#!/bin/bash

for i in hadoop102 hadoop104 hadoop106;
do
    echo -----------$i--------------
    ssh $i "$*"
done

# 执行脚本
chmod +x xcall.sh
xcall.sh jps
