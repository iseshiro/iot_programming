#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
   int fd;
   unsigned char val[2];

   if( argc != 2)
     {
       printf("myiptest <led_val>\n");
       exit(1);
     }
   printf("Device driver (for myip) access start.\n");
   fd = open("/proc/myip", O_RDWR);
   int len = strlen(argv[1]) + 1;
   write(fd, argv[1], len);
   read(fd, val, 2);
   printf("myip device : btn = %d, sw = %d\n",(int)val[0], (int)val[1]);

   close(fd);
   return 0;
}
