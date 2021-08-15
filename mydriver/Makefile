BUILD_DIR := $(shell pwd)
obj-m := myip.o mypwm.o

all:
	make -C ~/git/linux-xlnx M=$(BUILD_DIR) modules

clean:
	make -C ~/git/linux-xlnx M=$(BUILD_DIR) clean
