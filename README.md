# CertiEvents - Sistema de Certificados para Eventos
## Instituto Federal de Pernambuco (IFPE) - Campus Igarassu

Curso Superior em **Tecnologia em Sistemas para Internet - (TSI)**
- **Semestre:** 2026.1
- **Evento:** Demo Week

---

## Introdução

Este repositório centraliza o desenvolvimento do **CertiEvents**, sistema de emissão automática de certificados de participação para eventos, desenvolvido como projeto para apresentação na **Demo Week**.
+ Mais do que um sistema funcional, o projeto reflete a aplicação de conceitos de arquitetura fullstack em nuvem, integrando um backend Laravel a serviços gerenciados da AWS, com orquestração de infraestrutura totalmente automatizada.

## O que o sistema faz

O CertiEvents permite que qualquer participante do evento se cadastre, acompanhe informações sobre o evento e gere seu próprio certificado de participação em PDF, recebido diretamente por e-mail.

1. Usuário se cadastra e faz login na plataforma
2. Acessa informações sobre o evento
3. Gera o certificado de comprovação com um clique
4. Recebe o certificado em PDF por e-mail

O sistema também é capaz de **subir sua própria infraestrutura sozinho**: o gestor do evento agenda com meses de antecedência a data e hora de abertura, e no momento certo o backend liga automaticamente, sem intervenção manual.

---

## Tecnologia e Arquitetura

| Camada | Tecnologia | Função no projeto |
|---|---|---|
| Backend | Laravel (arquitetura MVC) | Autenticação, geração de certificados e integração com os serviços AWS |
| Frontend | React | Consome as rotas da API exposta pelo Laravel |
| Infraestrutura | AWS | Orquestração automática via Step Functions e EventBridge Scheduler |

---

## Serviços AWS utilizados

| Serviço | Função no projeto |
|---|---|
| EventBridge Scheduler | Dispara o pipeline na data/hora definida pelo gestor do evento |
| Step Functions | Orquestra a sequência de inicialização da infraestrutura |
| Lambda | Verifica instância ativa, liga o EC2 e notifica falhas |
| EC2 | Hospeda o backend Laravel |
| Cognito | Autenticação de usuários (login/cadastro) |
| DynamoDB | Armazena dados de usuários e certificados emitidos |
| S3 | Armazena os PDFs dos certificados gerados |
| SES | Envia o certificado por e-mail ao participante |
| SNS | Notifica o gestor do evento em caso de falha no pipeline |
| IAM | Gerencia permissões mínimas entre todos os serviços |

---

### Fluxo de infraestrutura (AWS)

( AINDA VOU ADD O DIAGRAMA )

---

## Estrutura de Diretórios

O projeto é dividido entre backend (Laravel), frontend (React) e infraestrutura (definições AWS), garantindo isolamento de responsabilidades e permitindo evolução modular sem interferência entre as camadas.

---

## Ambiente Técnico e Ferramentas

<div align="left">
  <img src="https://img.shields.io/badge/Laravel-FF2D20?logo=laravel&logoColor=white&style=for-the-badge" height="32" alt="laravel logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" height="32" alt="react logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Composer-885630?logo=composer&logoColor=white&style=for-the-badge" height="32" alt="composer logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/PHP-777BB4?logo=php&logoColor=black&style=for-the-badge" height="32" alt="php logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge" height="32" alt="javascript logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge" height="32" alt="html5 logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white&style=for-the-badge" height="32" alt="css logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Amazon AWS-232F3E?logo=amazonaws&logoColor=white&style=for-the-badge" height="32" alt="aws logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge" height="32" alt="github logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Visual Studio Code-007ACC?logo=visualstudiocode&logoColor=white&style=for-the-badge" height="32" alt="vscode logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=black&style=for-the-badge" height="32" alt="postman logo"  />
</div>

---

## Desenvolvedores

- [Diego Nunes](https://github.com/Diego-jpeg-27)
- [Viktor Soares](https://github.com/VSoares27)
- Viktor Gustavo - 