# HTB Write-up: "Jeeves" - A Privilege Escalation Challenge

## Descrição

A máquina "Jeeves" no Hack The Box (HTB) oferece um desafio interessante de escalonamento de privilégios, onde o objetivo é obter acesso como root a partir de uma conta de usuário regular. Ao longo deste write-up, vou documentar o processo completo de exploração da máquina, desde a enumeração inicial até a escalada de privilégios e obtenção de uma shell root.

**Dificuldade**: Médio  
**Tipo**: Linux  
**Status**: Concluído

## Informações da Máquina

- **IP da máquina**: 10.10.10.60
- **Sistema Operacional**: Ubuntu 20.04

## 1. Descobrindo a Máquina

Começamos realizando um `nmap` para identificar as portas abertas e os serviços em execução na máquina.

```bash
nmap -sC -sV -oN nmap.txt 10.10.10.60
