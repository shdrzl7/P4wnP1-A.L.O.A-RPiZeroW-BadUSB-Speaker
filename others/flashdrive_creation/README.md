# How to Create and Use a Flash Drive Image with P4wnP1 A.L.O.A.

This guide explains how to create a custom flash drive image, load it with files, and deploy it using P4wnP1 A.L.O.A. This allows the Raspberry Pi to impersonate a USB mass storage device, making it a useful tool for social engineering attacks.

---

### 💡 Attack Scenario / Concept

By emulating a flash drive, an attacker can trick a victim into accessing malicious files. The P4wnP1 can be configured to appear as a standard USB drive containing seemingly legitimate files.

1.  **Impersonation:** The device is plugged into a target machine and appears as a flash drive with an enticing name like "Confidential," "Payroll," or "Restricted."
3.  **Payload Storage:** The flash drive image contains a **trojan** or other malicious payload (e.g., a backdoor generated with `msfvenom`). For Windows targets, a common technique is to use a tool like **AutoIt** to compile a script into a standalone executable that can act as the trojan. This payload can be disguised as a regular document or program.
3.  **Execution:** The victim opens the flash drive, navigates to the files, and executes the malicious payload.
4.  **Gaining Access:** The payload runs, giving the attacker remote access to the victim's machine.
5.  **Enhancing Success Rate:** To maximize the chances of success, this attack can be combined with a preliminary HIDScript that disables antivirus software like Windows Defender before the flash drive is mounted.

---

## 🛠️ Steps to Create and Deploy a Flash Drive Image

### 1. SSH into P4wnP1
First, gain command-line access to the P4wnP1 device.
-   **IP Address:** `172.24.0.1`
-   **Username:** `root`
-   **Password:** `toor`

```bash
ssh root@172.24.0.1
```

### 2. Create a Directory for Your Files
Create a folder on the P4wnP1 device. This folder will be used as the source for the contents of your flash drive image.

For this example, we'll create a directory named `evil-files`.

```bash
mkdir /evil-files
```

### 3. Upload Your Payload
Transfer your malicious file (e.g., `auto-shop-sdn-bhd.zip` which contain a trojan) into the newly created directory. You can use any SFTP client, such as FileZilla, WinSCP, or the command-line `sftp` tool.

To use the command-line `sftp` client from your attacker machine:
```bash
sftp root@172.24.0.1
# Enter password: toor
sftp> put /path/to/your/local/auto-shop-sdn-bhd.zip /Confidential-Files/auto-shop-sdn-bhd.zip
```
If using a GUI tool like FileZilla, connect using the same credentials and drag-and-drop the files.

### 4. Navigate to the Helper Script Directory
P4wnP1 includes a helper script for generating storage images. Navigate to its location:
```bash
cd /usr/local/P4wnP1/helper
```
You can view all available options for the script by running `./genimg -h`.

### 5. Generate the Flash Drive Image
Use the `genimg` script to create a FAT32 image from the source folder you created.

**Command:**
```bash
./genimg -o <image_name> -s <size_in_MB> -l "<drive_label>" -i <path_to_input_folder>
```

**Example:**
This command creates a 20MB image named `autoshop_drive.img` with the volume label "Confidential" from the `/evil-files` directory.

```bash
./genimg -o autoshop_sb -s 20 -l "restricted" -i /Confidential-Files
```

### 6. Verify the Image Location
The generated image .bin file is automatically placed in the `/usr/local/P4wnP1/ums/flashdrive` directory, which is the default location for USB Mass Storage images.

You can verify it is there:
```bash
ls /usr/local/P4wnP1/ums/flashdrive
```

### 7. Deploy the Image via the Web UI
Finally, configure P4wnP1 to use the new image and act as a flash drive.

1.  Navigate to the P4wnP1 web UI at **http://172.24.0.1:8000**.
2.  Go to the **USB Settings** tab.
3.  On the right panel, under **USB Gadget**, enable **Mass Storage**.
4.  From the **Image file** dropdown menu, select the image you just created (e.g., `autoshop_drive.img`).
5.  Click the **Deploy** button at the top of the page.

<img src="../Images/fd-ui-usb-settings.png" alt="Deploying Mass Storage Image" width="800"/>

The P4wnP1 device will now mount as a flash drive on the target machine, with the contents you specified.

<img src="../Images/flash-drive-target.png" alt="Flash Drive Output on Taget Machine" width="800"/>
