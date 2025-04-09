---
title: "HTB Write-up: Jeeves"
date: "2025-04-09"
author: "Bruno Lamela"
category: "Hack The Box Easy"
image: "./img/2.jpg"
---
  
## Jeeves - Privilege Escalation

A máquina **Jeeves** no **Hack The Box (HTB)** oferece um desafio de **escalonamento de privilégios**, com o objetivo de obter acesso como root a partir de uma conta de usuário regular. Neste write-up, documentarei o processo completo de exploração da máquina.

---

## Informações da Máquina

- **IP**: `10.10.10.60`
- **SO**: Ubuntu 20.04
- **Dificuldade**: Médio
- **Tipo**: Linux
- **Status**: Concluído

---

## 1. Descoberta da Máquina

O primeiro passo é descobrir os serviços e portas abertas. Para isso, usamos um **scan Nmap** completo.

### Comando Nmap

```bash
nmap -sC -sV -oN nmap.txt 10.10.10.60
