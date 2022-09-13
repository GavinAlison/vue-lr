# configuration
mkdir D:\tool\nodejs\node_global
npm config set prefix "D:\tool\nodejs\node_global"
npm config set cache "D:\tool\nodejs\node_cache"
#在设置配置镜像站
npm config set registry=http://registry.npm.taobao.org
# 查看配置：
npm config list

# 配置环境变量
path=$path;D:\tool\nodejs\node_global
# 安装
npm install -g webpack 
# 验证
npm webpack -v
