login shell 和 non-login shell的区别

login shell 需要登录用户名与密码
non-login shell 通过ssh登录

加载的文件不同

login shell 加载的文件
/etc/profile
~/.bash_profile

~/.bashrc
/etc/bashrc
/etc/profile.d/*.sh

non-login shell 加载的文件
~/.bashrc
/etc/bashrc
/etc/profile.d/*.sh
