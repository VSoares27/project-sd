# CertiEvent - Sistema de Certificados para Eventos
## Instituto Federal de Pernambuco (IFPE) - Campus Igarassu

Curso Superior em **Tecnologia em Sistemas para Internet - (TSI)**
- **Disciplina:** Sistemas Distribuídos
- **Professor:** Ranieri Valença
- **Semestre:** 2026.1
- **Evento:** Demo Week

---

## Introdução

Este repositório centraliza o desenvolvimento do **CertiEvent**, sistema de emissão de certificados de participação para eventos, desenvolvido como projeto para apresentação na **Demo Week**.
+ Mais do que um sistema funcional, o projeto reflete a aplicação de conceitos de arquitetura fullstack em nuvem, integrando um backend Node.js a serviços gerenciados da AWS, com infraestrutura sob demanda: o servidor liga e desliga sozinho conforme o uso real do sistema.

## O que o sistema faz

O CertiEvent permite que qualquer participante escaneie um QR Code no evento, acesse a página principal e acompanhe os eventos que vão acontecer nos dias da Demo Week.

1. Usuário acessa a página principal (via QR Code ou link direto) e vê a lista de eventos
2. Faz login ou se cadastra na plataforma
3. Escolhe um evento para participar (cada um com descrição e horário)
4. Ao ingressar no evento, solicita o certificado de participação
5. A solicitação é enviada para aprovação do **Admin**
6. O Admin acessa o painel de gerenciamento, revisa a lista de participantes e solicitantes de cada evento, e aprova ou recusa cada pedido
7. Ao aprovar, o sistema gera o certificado em PDF e envia automaticamente para o e-mail cadastrado pelo usuário

O sistema também é capaz de **ligar sua própria infraestrutura sob demanda**: o servidor fica desligado por padrão, liga automaticamente assim que alguém acessa o frontend, e desliga sozinho após um período sem uso — reduzindo custo de infraestrutura.

---

## Tecnologia e Arquitetura

| Camada | Tecnologia | Função no projeto |
|---|---|---|
| Backend | Node.js (Express) | Autenticação de rotas, regras de negócio, geração de certificados e integração com os serviços AWS |
| Frontend | React (Vercel) | Interface do usuário e do admin, consome as rotas do backend |
| Banco de dados | MongoDB Atlas | Armazena usuários, eventos, certificados e logs |
| Infraestrutura | AWS | Autenticação, liga/desliga automático do servidor, armazenamento e envio de e-mail |

---

## Serviços AWS utilizados

| Serviço | Função no projeto |
|---|---|
| Cognito | Autenticação de usuários (login/cadastro) |
| API Gateway | Recebe a chamada do frontend para ligar o servidor sob demanda |
| Lambda (Acordar EC2) | Liga a instância EC2 quando alguém acessa o sistema |
| Lambda (Auto Shutdown) | Desliga a instância EC2 automaticamente após período de inatividade |
| EventBridge Scheduler | Executa a verificação de inatividade a cada 30 minutos |
| EC2 | Hospeda o backend Node.js |
| S3 | Armazena os PDFs dos certificados gerados |
| SES | Envia o certificado por e-mail ao participante |
| IAM | Gerencia permissões mínimas entre todos os serviços |

---

### Fluxo de infraestrutura

Assim que o usuário acessa o frontend, uma chamada é feita ao API Gateway, que aciona uma Lambda responsável por ligar o servidor EC2 caso ele esteja desligado. Enquanto isso, o frontend aguarda a confirmação de que o servidor está pronto antes de liberar a tela de login.

A partir daí, a autenticação acontece direto no Cognito, e todas as demais ações — visualizar eventos, solicitar certificado, aprovar solicitações no painel admin — são tratadas pelo backend Node.js rodando no EC2, que se comunica com o MongoDB, o S3 e o SES.

Em paralelo, uma segunda Lambda é executada a cada 30 minutos por um agendamento do EventBridge, verificando o tráfego de rede da instância. Se detectar inatividade, desliga o servidor automaticamente até o próximo acesso.

---

## Estrutura de Diretórios

O projeto é dividido entre backend (Node.js), frontend (React) e infraestrutura (definições AWS), garantindo isolamento de responsabilidades e permitindo evolução modular sem interferência entre as camadas.

---

## Ambiente Técnico e Ferramentas

<div align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" height="32" alt="nodejs logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge" height="32" alt="express logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" height="32" alt="react logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge" height="32" alt="vercel logo"  />
  <img width="12" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" height="32" alt="mongodb logo"  />
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
- [Victor Gustavo](https://github.com/victorgustavodev)
- [Viktor Soares](https://github.com/VSoares27)