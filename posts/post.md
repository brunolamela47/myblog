---
title: "HTB Write-up: Bounty Hunter" 
date: "2025-04-15"
author: "Bruno Lamela"
category: "Hack The Box Easy"
image: ./img/2.jpg
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






