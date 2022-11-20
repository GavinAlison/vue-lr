#!/bin/bash

# 服务器设置主机名
# 主机和域名建立关系
hadoop102

echo hadoop102 >>/etc/hostname
echo '192.168.56.104 hadoop104' >>/etc/hosts
echo '192.168.56.106 hadoop106' >>/etc/hosts
echo '192.168.56.102 hadoop102' >>/etc/hosts

hadoop104
echo hadoop104 >>/etc/hostname
echo '192.168.56.102 hadoop102' >>/etc/hosts
echo '192.168.56.106 hadoop106' >>/etc/hosts

hadoop106
echo hadoop106 >>/etc/hostname
echo '192.168.56.102 hadoop102' >>/etc/hosts
echo '192.168.56.104 hadoop104' >>/etc/hosts

# 设置无密登录
hadoop102

ssh-keygen -t rsa
# ssh-copy-id命令可以把本地的ssh公钥文件安装到远程主机对应的账户下
ssh-copy-id hadoop102
ssh-copy-id hadoop104
ssh-copy-id hadoop106

hadoop104
ssh-keygen -t rsa
ssh-copy-id hadoop102
ssh-copy-id hadoop106

hadoop106
ssh-keygen -t rsa
ssh-copy-id hadoop102
ssh-copy-id hadoop104
