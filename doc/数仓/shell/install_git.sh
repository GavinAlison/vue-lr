#!/bin/bash

yum install -y git epel-release

rm -rf /etc/yum.repos.d/*
curl -o /etc/yum.repos.d/Centos-7.repo http://mirrors.aliyun.com/repo/Centos-7.repo
curl -o /etc/yum.repos.d/epel-7.repo http://mirrors.aliyun.com/repo/epel-7.repo

function yum_remove_jdk() {
    yum list installed | grep java
    yum -y remove java
}

function install_jdk() {
    yum -y install java-1.8.0-openjdk.x86_64
    ls -lrt /usr/bin/java
    cat >>/etc/profile <<EOF
export JAVA_HOME=/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.352.b08-2.el7_9.x86_64/
export CLASS_PATH=.:${JAVA_HOME}/jre/lib/rt.jar:${JAVA_HOME}/lib/dt.jar:${JAVA_HOME}/lib/tools.jar
export PATH=$PATH:${JAVA_HOME}/bin
EOF
    source /etc/profile
}

function install_maven() {
    mkdir -p /opt/module
    wget https://dlcdn.apache.org/maven/maven-3/3.8.6/binaries/apache-maven-3.8.6-bin.tar.gz

    tar -zxvf apache-maven-3.8.6-bin.tar.gz

    cat >>/etc/profile <<EOF
export MAVEN_HOME=/opt/module/apache-maven-3.8.6
export PATH=$PATH:${MAVEN_HOME}/bin
EOF
    source /etc/profile
}

function yum_remote_maven() {
    yum -y remove apache_maven
}

function yum_install_maven() {
    yum -y install maven
}

install_jdk()
install_maven()

