# 同步分发脚本

xsync

```shell
#!/bin/bash
#1. 判断参数个数
if [ $# -lt 1]; then 
    echo Not Enough Argument
    exit;
fi
#2 遍历集群所有机器
for host in hadoop102 hadoop103 hadoop104
do
    echo ========= $host ===============
    #3. 遍历所有的目录，挨个发送
    for file in $@
    do
        #4. 判断文件是否存在
        if [ -e $file]; then
            #5. 获取父目录
            pdir=$(cd -P $(dirname $file ); pwd)
            #6. 获取当前文件的名称
            fname=$(basename $file)
            ssh $host "mkdir -p $pdir"
            rsync -av $pdir/$fname $host:$pdir
        else
            echo $file does not exists!
        fi
    done
done
```

## ssh-keygen -t rsa

```shell
ssh-keygen -t rsa
# 生成公钥私钥.ssh
# 把本地的ssh公钥文件安装到远程主机对应的账户下,ssh-copy-id命令 可以把本地主机的公钥复制到远程主机的authorized_keys文件上，
# ssh-copy-id命令也会给远程主机的用户主目录（home）和~/.ssh, 和~/.ssh/authorized_keys设置合适的权限。
ssh-copy-id [-i [identity_file]] [user@]machine
```

## rsync详解

https://blog.csdn.net/wq1205750492/article/details/124497271?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522166728635716782388026855%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=166728635716782388026855&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_positive~default-1-124497271-null-null.142^v62^pc_search_tree,201^v3^control_2,213^v1^t3_control2&utm_term=rsync&spm=1018.2226.3001.4187

## JDK准备

```shell
rpm -qa | grep -i java | xargs -n1 sudo rpm -e --nodeps

cat >> /etc/profile.d/my_env.sh << EOF
#JAVA_HOME
export JAVA_HOME=/opt/module/jdk1.8
export PATH=$PATH:$JAVA_HOME/bin
EOF

source /etc/profile.d/my_env.sh

xsync /etc/profile.d/my_env.sh 
#分发数据到其他服务器

```

linux 环境变量
/etc/profile
/etc/profile.d/*.sh
~/.bashrc
~/.bash_profile

login shell 
non-login shell

在 `~/bashrc`里面添加

if [ -f /etc/bashrc ]; then
    . /etc/bashrc
fi
