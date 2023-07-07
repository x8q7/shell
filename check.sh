# vim 巡检.sh 
echo "系统巡检脚本：Version `date +%F`"
 
echo -e "\033[33m*******************************************************系统检查 *******************************************************\033[0m"
echo "系统：`uname -a | awk '{print $NF}'`"
echo "发行版本：`cat /etc/redhat-release`"
echo "内核：`uname -r`"
echo "主机名：`hostname`"
echo "SELinux：`/usr/sbin/sestatus | grep 'SELinux status:' | awk '{print $3}'`"
echo "语言/编码：`echo $LANG`"
echo "当前时间：`date +%F_%T`"
echo "最后启动：`who -b | awk '{print $3,$4}'`"
echo "运行时间：`uptime | awk '{print $3}' | sed 's/,//g'`"
 
echo -e "\033[33m*******************************************************CPU检查 *******************************************************\033[0m"
echo "物理CPU个数: `cat /proc/cpuinfo | grep "physical id" | awk '{print $4}' | sort | uniq | wc -l`"
echo "逻辑CPU个数: `cat /proc/cpuinfo | grep "processor" | awk '{print $3}' | sort | uniq | wc -l`"
echo "每CPU核心数: `cat /proc/cpuinfo | grep "cores" | awk '{print $4}'`"
echo "CPU型号: `cat /proc/cpuinfo | grep "model name" | awk -F":" '{print $2}'`"
echo "CPU架构: `uname -m`"
echo -e "\033[33m*******************************************************内存检查 *******************************************************\033[0m"
echo "总共内存：`free -mh | awk "NR==2"| awk '{print $2}'`"
echo "使用内存：`free -mh | awk "NR==2"| awk '{print $3}'` "
echo "可用内存： `free -mh | awk "NR==2"| awk '{print $7}'`"
echo -e "\033[33m*******************************************************硬盘检查 *******************************************************\033[0m"
echo "总共磁盘大小：`df -h | awk '$NF=="/"{printf "%s", $2}'`"
echo "磁盘使用：`df -h | awk '$NF=="/"{printf "%s", $3}'`"
echo "磁盘可用：`df -h | awk '$NF=="/"{printf "%s", $4}'`"
 
 
echo -e "\033[33m*******************************************************网络检查 *******************************************************\033[0m"
echo `ip a | grep eno | awk "NR==2" | awk '{print $NF,":",$2}'`
echo "网关：`ip route | awk 'NR==1'| awk '{print $3}'`"
echo "DNS: `cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}'`"
 
ping -c 4 www.baidu.com > /dev/null
if [ $? -eq 0 ];then
    echo "网络连接：正常"
else
    echo "网络连接：失败"
fi
echo -e "\033[33m*******************************************************安全检查 *******************************************************\033[0m"
echo "登陆用户信息：`last | grep "still logged in" | awk '{print $1}'| sort | uniq`"
md5sum -c --quiet /etc/passwd > /dev/null 2&>1
if [ $? -eq 0 ];then
    echo "文件未被串改"
else
    echo "文件被串改"
fi
