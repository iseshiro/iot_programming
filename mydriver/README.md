# カーネルモジュール myip.ko とmypwm.ko のビルド
```
$ ./mk.sh
```
# ZYBOを起動`ifconfig`コマンドでZYBOのIPアドレスを調べる。
- 仮に192.168.0.10としておく。
# ビルドした myip.ko, mypwm.ko, myiptest, mypwmtest をZYBOにネットワーク経由でコピーする
```
$ scp *.ko ubuntu@192.168.0.10:~/  ---> yes
$ scp myiptest mypwmtest ubuntu@192.168.0.10:~/bin  ---> yes
```
# ZYBO上でLED出力, BTN, SW入力の確認
## カーネルモジュール myip.ko のロード
```
$ sudo insmod myip.ko
```
## ドライバへの書き込み許可
```
$ sudo chmod 666 /proc/myip
```
## LED点灯の確認
```
$ sudo echo 15 > /porc/myip
$ sudo echo 0 > /porc/myip
```
## BTN, SWの確認
```
$ cat /porc/myip
```
# ZYBO上でPWM LED出力
## カーネルモジュール mypwm.ko のロード
```
$ sudo insmod mypwm.ko
```
## ドライバへの書き込み許可
```
$ sudo chmod 666 /proc/mypwm
```
## LED点灯の確認
```
$ sudo echo 0 100 > /porc/mypwm
$ sudo echo 1 100 > /porc/mypwm
$ sudo echo 2 100 > /porc/mypwm
$ sudo echo 3 100 > /porc/mypwm
$ sudo echo 4 100 > /porc/mypwm
$ sudo echo 5 100 > /porc/mypwm
```
## myiptestの確認
```
$ ./myiptest 15
$ ./myiptest 4
$ ./myiptest 3
```
## mypwmtestの確認
```
$ ./mypwmtest 0 100
$ ./mypwmtest 0 0
$ ./mypwmtest 5 100
$ ./mypwmtest 5 0
```
# Update and Upgrade
```
$ sudo apt update
$ sudo apt upgrade
*** issue (Y/I/N/O/D/Z) [default=N] ? Y
$ clear
$ sudo reboot
```
# Install nodejs and npm
```
$ which nodejs
$ which npm
$ sudo apt install nodejs npm wget curl
$ which nodejs
/usr/bin/nodejs
$ nodejs -v
v8.10.0
$ node -v
v8.10.0
$ which npm
$ npm -v
$ sudo npm install -g n
$ sudo n stable
$ sudo apt remove --purge nodejs npm
$ sudo apt autoremove
$ sudo n 4.6.1
$ hash -r
$ node -v
v4.6.1
$ npm -v
2.15.9
$ git clone http://acoust.ad.dendai.ac.jp:8081/projectb2020/projectb_2020.git
$ ps aux | grep nginx
$ sudo kill -9 (nginx proc no)
$ sudo node js/web_server.js
$ sudo npm cache clean
$ sudo npm install ejs
$ sudo npm install socketio

```
