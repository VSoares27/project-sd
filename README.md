# CertiEvent - Sistema de Certificados para Eventos
## Instituto Federal de Pernambuco (IFPE) - Campus Igarassu

Curso Superior em **Tecnologia em Sistemas para Internet - (TSI)**
- **Disciplina:** Sistemas Distribuídos
- **Professor:** Ranieri Valença
- **Semestre:** 2026.1
- **Evento:** Demo Week

---

## Sobre o Projeto

O **CertiEvent** é um sistema distribuído para emissão automatizada de certificados de participação em eventos, desenvolvido como projeto para a **Demo Week**. Mais do que uma aplicação funcional, o projeto materializa na prática os conceitos fundamentais de **Sistemas Distribuídos**, combinando arquitetura fullstack em nuvem com infraestrutura elástica e sob demanda.

### Diferenciais do Projeto

-  **Infraestrutura elástica:** O servidor liga e desliga automaticamente conforme o uso real
-  **Segurança distribuída:** Autenticação centralizada com Amazon Cognito
-  **Arquitetura desacoplada:** Frontend, backend e serviços AWS independentes
-  **Otimização de custos:** Pagamento apenas pelo uso efetivo da infraestrutura
-  **Comunicação assíncrona:** Envio de certificados por e-mail sem bloquear o usuário

---

##  O que o sistema faz?

O **CertiEvent** permite que participantes cadastrados acessem a lista de eventos, se inscrevam e solicitem certificados de participação de forma totalmente digital e automatizada.

### Fluxo do Participante

| Etapa | Descrição |
|-------|-----------|
| 1 | O participante acessa a página principal do sistema via link direto |
| 2 | Realiza **login** ou **cadastro** na plataforma (autenticação gerenciada pelo Amazon Cognito) |
| 3 | Visualiza a lista de eventos disponíveis, com descrição, data e horário |
| 4 | Escolhe um evento e solicita **ingresso** como participante |
| 5 | Após ingressar, solicita o **certificado de participação** no evento |
| 6 | A solicitação é enviada para a fila de aprovação do **Administrador** |

### Fluxo do Administrador

| Etapa | Descrição |
|-------|-----------|
| 7 | O Admin acessa o **painel de gerenciamento** da plataforma |
| 8 | Revisa a lista de participantes e solicitantes de cada evento |
| 9 | **Aprova** ou **recusa** cada pedido de certificado individualmente |
| 10 | Ao aprovar, o sistema **gera automaticamente** o certificado em PDF |
| 11 | O PDF é **armazenado no Amazon S3** e **enviado por e-mail** (via Amazon SES) para o endereço cadastrado pelo usuário |

### Fluxo da Infraestrutura (Elasticidade)

O sistema implementa um mecanismo de **auto-scaling inteligente**:

| Ação | Descrição |
|------|-----------|
| X | Servidor **desligado por padrão** (custo zero) |
| X | **Liga automaticamente** quando alguém acessa o frontend |
| X | **Desliga sozinho** após período sem uso |
| X | Redução significativa de custos com infraestrutura |

---

## Arquitetura do Sistema

O CertiEvent foi projetado sob os princípios de **Sistemas Distribuídos**, adotando o modelo **cliente-servidor** com componentes autônomos que se comunicam via rede para formar um sistema coeso, escalável e resiliente.

### Conceitos de Sistemas Distribuídos Aplicados

| Conceito | Aplicação no CertiEvent |
|----------|--------------------------|
| **Transparência de Distribuição** | Usuário interage sem perceber a complexidade dos serviços distribuídos |
| **Elasticidade** | Servidor EC2 liga/desliga automaticamente conforme a demanda |
| **Escalabilidade Horizontal** | Possibilidade de adicionar novas instâncias do backend conforme necessidade |
| **Tolerância a Falhas** | Serviços desacoplados garantem que falhas isoladas não comprometam o todo |
| **Comunicação Síncrona/Assíncrona** | API REST (síncrona) + SES/S3 (assíncrona) |
| **Segurança Distribuída** | Cognito gerencia identidade em todos os serviços |
| **Consistência Eventual** | Geração de certificados processada de forma assíncrona |
| **Persistência Distribuída** | MongoDB Atlas com replicação e alta disponibilidade |

---

### Diagrama de Arquitetura

![Arquitetura Distribuída do CertiEvent](./docs/imagens/Diagrama.svg)

*Figura 1 - Arquitetura completa do sistema CertiEvent com integração AWS*

---

### Fluxo Distribuído de Requisições

| Etapa | Origem | Destino | Ação |
|-------|--------|---------|------|
| 1 | Usuário | Frontend | Acessa a página principal via link |
| 2 | Frontend | API Gateway | Chama API para ativar backend sob demanda |
| 3 | API Gateway | Lambda (Acordar EC2) | Aciona função para ligar instância EC2 |
| 4 | Lambda (Acordar EC2) | EC2 | Liga a instância do backend |
| 5 | EC2 | Frontend | Confirma que o backend está pronto |
| 6 | Frontend | Cognito | Envia credenciais para autenticação |
| 7 | Cognito | Frontend | Retorna token de acesso JWT |
| 8 | Frontend | EC2 | Envia requisições (eventos, certificados) |
| 9 | EC2 | MongoDB Atlas | Persiste dados de usuários, eventos e certificados |
| 10 | EC2 | S3 | Armazena PDF do certificado gerado |
| 11 | EC2 | SES | Envia e-mail com o certificado anexado |
| 12 | EC2 | Frontend | Retorna resposta da operação ao usuário |
| 13 | Lambda (Auto Shutdown) | EC2 | Verifica inatividade da instância (a cada 30 min) |
| 14 | Lambda (Auto Shutdown) | EC2 | Desliga a instância se detectar inatividade |

---

## Tecnologias e Serviços

### Camadas da Aplicação

| Camada | Tecnologia | Função no projeto |
|--------|------------|-------------------|
| **Frontend** | React + Vercel | Interface do usuário e painel administrativo |
| **Backend** | Node.js + Express | Regras de negócio, API REST e integração com AWS |
| **Banco de Dados** | MongoDB Atlas | Armazenamento de usuários, eventos e certificados |
| **Infraestrutura** | Amazon AWS | Autenticação, computação, armazenamento e e-mail |

---

### Serviços AWS Utilizados

| Serviço | Função no projeto |
|---------|-------------------|
| **Cognito** | Autenticação e gerenciamento de usuários (login/cadastro) |
| **API Gateway** | Ponto de entrada para ativação do backend sob demanda |
| **Lambda (Acordar EC2)** | Liga a instância EC2 quando o sistema é acessado |
| **Lambda (Auto Shutdown)** | Desliga a instância EC2 após período de inatividade |
| **EventBridge Scheduler** | Agenda a verificação de inatividade a cada 30 minutos |
| **EC2** | Hospeda o backend Node.js em produção |
| **S3** | Armazena os PDFs dos certificados gerados |
| **SES** | Envia os certificados por e-mail aos participantes |
| **IAM** | Gerencia permissões mínimas entre todos os serviços |

---

## Estrutura de Diretórios

O projeto é organizado de forma modular, separando backend, frontend e documentação em diretórios independentes, garantindo isolamento de responsabilidades e facilitando a evolução do sistema.

---

## Ambiente Técnico e Ferramentas

<div align="left">
  <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" height="32" alt="nodejs" />
  <img width="12" />
  <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=white&style=for-the-badge" height="32" alt="express" />
  <img width="12" />
  <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black&style=for-the-badge" height="32" alt="react" />
  <img width="12" />
  <img src="https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white&style=for-the-badge" height="32" alt="vercel" />
  <img width="12" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge" height="32" alt="mongodb" />
  <img width="12" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge" height="32" alt="javascript" />
  <img width="12" />
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge" height="32" alt="html5" />
  <img width="12" />
  <img src="https://img.shields.io/badge/CSS-1572B6?logo=css&logoColor=white&style=for-the-badge" height="32" alt="css" />
  <img width="12" />
  <img src="https://img.shields.io/badge/Amazon_AWS-232F3E?logo=amazonaws&logoColor=white&style=for-the-badge" height="32" alt="aws" />
  <img width="12" />
  <img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge" height="32" alt="github" />
  <img width="12" />
  <img src="https://img.shields.io/badge/Postman-FF6C37?logo=postman&logoColor=black&style=for-the-badge" height="32" alt="postman" />
</div>

---

## Desenvolvedores

- [Diego Nunes](https://github.com/Diego-jpeg-27)
- [Viktor Soares](https://github.com/VSoares27)
- [Victor Gustavo](https://github.com/victorgustavodev)