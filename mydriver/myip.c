#include <linux/kernel.h>
#include <linux/module.h>
#include <linux/of.h>
#include <asm/uaccess.h>           /* Needed for copy_from_user */
#include <asm/io.h>                /* Needed for IO Read/Write Functions */
#include <linux/proc_fs.h>         /* Needed for Proc File System Functions */
#include <linux/seq_file.h>        /* Needed for Sequence File Operations */
#include <linux/platform_device.h> /* Needed for Platform Driver Functions */
#include <linux/slab.h>            /* Needed for kmalloc and kfree */

/* Define Driver Name */
#define DRIVER_NAME "myip"

unsigned long *base_addr; /* Vitual Base Address */
struct resource *res;     /* Device Resource Structure */
unsigned long remap_size; /* Device Memory Size */
#define NUM_BUFFER 2
static char stored_value[NUM_BUFFER];

/* Write operation for /proc/myip
* -----------------------------------
* When user cat a string to /proc/myip file, the string will be stored in
* const char __user *buf. This function will copy the string from user
* space into kernel space, and change it to an unsigned long value.
* It will then write the value to the register of myip controller,
* and turn on the corresponding LEDs eventually.
*/
static ssize_t proc_myip_write(struct file *file, const char __user *buf,
                                size_t count, loff_t *ppos)
{
    char myip_phrase[16];
    u32 myip_value;

    if (count < 11)
    {
        if (raw_copy_from_user(myip_phrase, buf, count))
            return -EFAULT;

        myip_phrase[count] = '\0';
    }

    myip_value = simple_strtoul(myip_phrase, NULL, 0);
    wmb();
    iowrite32(myip_value, base_addr);
    return count;
}

static ssize_t proc_myip_read(struct file *file, char __user *buf,
                                size_t count, loff_t *ppos)
{
    u32 mybtn_value, mysw_value;
    mybtn_value = ioread32(base_addr + 1);
    mysw_value = ioread32(base_addr + 2);

    stored_value[0] = mysw_value;
    stored_value[1] = mybtn_value;
    if (raw_copy_to_user(buf, stored_value, count) != 0) {
        return -EFAULT;
    }
    return count;

    return 0;
}


/* Callback function when opening file /proc/myip
* ------------------------------------------------------
* Read the register value of myip controller, print the value to
* the sequence file struct seq_file *p. In file open operation for /proc/myip
* this callback function will be called first to fill up the seq_file,
* and seq_read function will print whatever in seq_file to the terminal.
*/
static int proc_myip_show(struct seq_file *p, void *v)
{
    u32 myip_value;
    myip_value = ioread32(base_addr + 1);
    seq_printf(p, "BTN=%d, ", myip_value);
    myip_value = ioread32(base_addr + 2);
    seq_printf(p, "SW=%d, ", myip_value);
    return 0;
}

/* Open function for /proc/myip
* ------------------------------------
* When user want to read /proc/myip (i.e. cat /proc/myip), the open function
* will be called first. In the open function, a seq_file will be prepared and the
* status of myip will be filled into the seq_file by proc_myip_show function.
*/
static int proc_myip_open(struct inode *inode, struct file *file)
{
    unsigned int size = 16;
    char *buf;
    struct seq_file *m;
    int res;

    buf = (char *)kmalloc(size * sizeof(char), GFP_KERNEL);
    if (!buf)
        return -ENOMEM;

    res = single_open(file, proc_myip_show, NULL);

    if (!res)
    {
        m = file->private_data;
        m->buf = buf;
        m->size = size;
    }
    else
    {
        kfree(buf);
    }

    return res;
}

/* File Operations for /proc/myip */
static const struct file_operations proc_myip_operations = {
    .open = proc_myip_open,
    .read = proc_myip_read,
    .write = proc_myip_write,
    .llseek = seq_lseek,
    .release = single_release};

/* Shutdown function for myip
* -----------------------------------
* Before myip shutdown, turn-off all the leds
*/
static void myip_shutdown(struct platform_device *pdev)
{
    iowrite32(0, base_addr);
}

/* Remove function for myip
* ----------------------------------
* When myip module is removed, turn off all the leds first,
* release virtual address and the memory region requested.
*/
static int myip_remove(struct platform_device *pdev)
{
    myip_shutdown(pdev);

    /* Remove /proc/myip entry */
    remove_proc_entry(DRIVER_NAME, NULL);

    /* Release mapped virtual address */
    iounmap(base_addr);

    /* Release the region */
    release_mem_region(res->start, remap_size);

    return 0;
}

/* Device Probe function for myip
* ------------------------------------
* Get the resource structure from the information in device tree.
* request the memory regioon needed for the controller, and map it into
* kernel virtual memory space. Create an entry under /proc file system
* and register file operations for that entry.
*/
static int myip_probe(struct platform_device *pdev)
{
    struct proc_dir_entry *myip_proc_entry;
    int ret = 0;

    res = platform_get_resource(pdev, IORESOURCE_MEM, 0);
    if (!res)
    {
        dev_err(&pdev->dev, "No memory resource\n");
        return -ENODEV;
    }

    remap_size = res->end - res->start + 1;
    if (!request_mem_region(res->start, remap_size, pdev->name))
    {
        dev_err(&pdev->dev, "Cannot request IO\n");
        return -ENXIO;
    }

    base_addr = ioremap(res->start, remap_size);
    if (base_addr == NULL)
    {
        dev_err(&pdev->dev, "Couldn't ioremap memory at 0x%08lx\n",
                (unsigned long)res->start);
        ret = -ENOMEM;
        goto err_release_region;
    }

    myip_proc_entry = proc_create(DRIVER_NAME, 0, NULL,
                                   &proc_myip_operations);
    if (myip_proc_entry == NULL)
    {
        dev_err(&pdev->dev, "Couldn't create proc entry\n");
        ret = -ENOMEM;
        goto err_create_proc_entry;
    }

    printk(KERN_INFO DRIVER_NAME " probed at VA 0x%08lx\n",
           (unsigned long)base_addr);

    return 0;

err_create_proc_entry:
    iounmap(base_addr);
err_release_region:
    release_mem_region(res->start, remap_size);

    return ret;
}

/* device match table to match with device node in device tree */
static const struct of_device_id myip_of_match[] = {
    {.compatible = "xlnx,myip-1.0"},
    {},
};

MODULE_DEVICE_TABLE(of, myip_of_match);

/* platform driver structure for myip driver */
static struct platform_driver myip_driver = {
    .driver = {
        .name = DRIVER_NAME,
        .owner = THIS_MODULE,
        .of_match_table = myip_of_match},
    .probe = myip_probe,
    .remove = myip_remove,
    .shutdown = myip_shutdown};

/* Register myip platform driver */
module_platform_driver(myip_driver);

/* Module Informations */
MODULE_AUTHOR("Digilent, Inc.");
MODULE_LICENSE("GPL");
MODULE_DESCRIPTION(DRIVER_NAME ": MYIP driver (Simple Version)");
MODULE_ALIAS(DRIVER_NAME);
