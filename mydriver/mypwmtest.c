#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h>
#include <unistd.h>
#include <sys/mman.h>
#include <errno.h>
#include <string.h>

int main(int argc, char **argv)
{
   int fd, i, leng, col_cnt;
   char arg[64]; //arg[]="0 255 4 255 8 255 12 255 16 255 20 255";

   if( argc == 1 || (argc%2) != 1) {
      printf("mypwmtest offset1 value1 offset2 value2 ...\n");
      printf("offset: r1:0, g1:1, b1:2, r2:3, g2:4 b2:5\n");
      printf("value: 0-255\n");
      exit(1);
   }
   fd = open("/proc/mypwm", O_WRONLY);
   col_cnt = (argc-1)/2;
   for(i=0; i<col_cnt; i++) {
     strcpy(arg, argv[i*2+1]);
     strcat(arg, " ");
     strcat(arg, argv[i*2+2]);
     leng = strlen(arg);
     write(fd, arg, leng);
     printf("%d: offset=%s, value=%s\n", i+1, argv[i*2+1], argv[i*2+2]);
   }

   close(fd);
   return 0;
}
