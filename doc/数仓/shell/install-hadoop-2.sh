xsync

yum -y install rsync

systemctl start rsyncd.service
systemctl enable rsyncd.service

# 在hadoop102机器上

mkdir -p /root/bin
touch /root/bin/xsync
vim /root/bin/xsync 

#!/bin/bash
#1.判断参数个数
if [ $# -lt 1 ]; then
    echo Not Enough Arguement!
    exit;
fi
#2.遍历集群所有机器   请改成你自己的主机映射
for host in hadoop104 hadoop106
do
    echo =============== $host ==================
    #3.遍历所有目录，挨个发送
    for file in $@
    do
        #4.判断文件是否存在
        if [ -e $file ];  then
		    #5.获取父目录
            pdir=$(cd -P $(dirname $file);pwd)
		    fname=$(basename $file)
		    # 创建文件夹和传输文件。请改成你自己的端口号
		    ssh  $host "mkdir -p $pdir"
		    rsync -arvl $pdir/$fname $host:$pdir
	    else
		    echo $file does not exists!
	    fi
    done
done

chmod a+x xsync.sh

# 测试
cd /root/bin
echo 111>1.txt

xsync 1.txt

# 到hadoop104,hadoop106上查看对应的文件是否存在
