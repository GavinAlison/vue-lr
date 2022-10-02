# linux硬盘被占满，如何解决问题

1. 查找占用空间比率高的文件，删除不需要的文件
2. 添加硬盘

```
1. 删除缓存

sudo apt-get autoclean //清理旧版本的软件缓存
sudo apt-get clean //清理所有软件缓存
sudo apt-get autoremove //删除系统不再使用的孤立软件
sudo apt-get install deborphan -y //清除Linux下孤立的包
sudo apt-get remove --purge 软件名 //删除软件
dpkg -l |grep ^rc|awk '{print $2}' |sudo xargs dpkg -P

2. 删除./.cache

a. 查找占用空间大的文件对应删除
sudo -i //进入root模式
du -h max-depth=1 //查看各文件占用的内存
cd ./目录名称 //进入占用内存大的文件下查看情况

逐级排查，即进入逐步进入占用空间大的文件夹，然后删除，
比如我这里找到./cache/Vmware/frag_and_drop文件夹占用很大，查看CSDN中关于这个文件的说明：
安装VM tools之后，可以通过拖拽的方式把文件拉入虚拟机之中。但每一次拖拽，其实都是现在cache文件夹里面生成一个同样的文件，并使用cp拷贝的方式将其拷贝到拖拽放置的目录中。因此，如果不进行清理的话，cache文件夹中产生的文件，并不会自动删除或者释放。该文件夹位于用户目录下/home/xxxx/.cache/vmware/drag_and_drop。
删除方法：

1. rm -f 文件名
2. 直接进入在页面进入页面主文件夹，ctrl+h显示出隐藏文件夹，然后就可以看见.cache文件夹，然后进入文件夹找到文件删除即可。

注意删除完一定要清空回收站，还可以运行以下命令：
sudo rm -fr /root/.Trash/

b. 直接删除cache缓存的三种方式

sudo -i 进入root模式
仅清除页面缓存（PageCache）
echo 1 > /proc/sys/vm/drop_caches
清除目录项和inode
echo 2 > /proc/sys/vm/drop_caches
清除页面缓存，目录项和inode
echo 3 > /proc/sys/vm/drop_caches
详情理论参照网上博主的CSDN：
<https://www.cnblogs.com/lanqingzhou/p/8059339.html>
<https://blog.csdn.net/u012660464/article/details/78923011>

3. 清除arp缓存
arp -n|awk '/^[1-9]/ {print "arp -d "$1}' | sh
for((ip=2;ip<255;ip++));do arp -d 192.168.0.$ip &>/dev/null;done

4. 磁盘扩容

关闭虚拟机，修改设置扩容磁盘，但我查找了网上一些说法，修改参数之后还需要手动分配磁盘等操作，我也没有尝试，如有靠谱方法，欢迎分享~
```

现在研究一下如何添加硬盘，并挂载更多的数据

```
1、利用fdisk命令显示当前硬盘分区情况，按“n”键添加新的分区；
2、利用mkfs命令格式化分区；
3、利用mount命令挂载分区；
4、利用“defaults 0 0”语句设置永久启动时自动挂载。
```

Linux在使用过程中由于数据量不断增大，导致磁盘空间不足，需要增加磁盘空间，主要有以下三种方式
1、直接给 / 分区（或者某一分区）扩容，直接在原有磁盘上增大空间
2、给虚拟机新增一块磁盘，为这块磁盘新建一个分区
3、给虚拟机新增一块磁盘，并把磁盘空间扩容到原有分区

