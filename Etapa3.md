# 3.3 Protótipo e Planejamento da Arquitetura

Objetivos: 
Desenvolver wireframes ou protótipo navegável.
Planejar a estrutura de navegação do sistema; o fluxo de telas, o armazenamento e acesso aos dados.


# Arquitetura do Projeto

A arquitetura da aplicação adota o modelo cliente-servidor em camadas, garantindo uma separação bem definida entre front-end, back-end e banco de dados. O front-end é desenvolvido em React, proporcionando uma interface moderna, dinâmica e responsiva para o usuário. O back-end é implementado em C#, responsável pela lógica de negócios e pela comunicação entre as camadas. Já o banco de dados PostgreSQL é utilizado para armazenamento seguro e eficiente das informações. Essa combinação de tecnologias assegura modularidade, escalabilidade, reutilização de código, além de facilitar a manutenção e os testes do sistema.

* Diagrama simplificado

<img width="420" height="398" alt="image" src="https://github.com/user-attachments/assets/30d93e90-4363-436d-96b3-21a8ae254171" />



# Interface do sistema

As interfaces podem sofrer alteração até o fim do projeto. 

* Tela inicial 
<img width="1358" height="548" alt="image" src="https://github.com/user-attachments/assets/df095c4d-2ed3-4cee-9181-776311477257" />

* Tela Editar Agendamento
<img width="1365" height="602" alt="image" src="https://github.com/user-attachments/assets/b17183c2-ef62-4b6d-8177-49afde189e29" />

* Tela Finalizar Atendimento
<img width="1365" height="550" alt="image" src="https://github.com/user-attachments/assets/5e9a7b46-b9e6-4899-a11b-c9de2f8ce3a8" />


* Tela de agendamentos
<img width="1354" height="548" alt="image" src="https://github.com/user-attachments/assets/fc927733-100a-442f-9eb3-61b727128cef" />

* Tela Editar Agendamento
<img width="1365" height="561" alt="image" src="https://github.com/user-attachments/assets/f90c7083-7741-48fb-a6fd-5addeac3e41e" />

* Tela de novo agendamento
<img width="1365" height="559" alt="image" src="https://github.com/user-attachments/assets/72697caa-9871-4c98-81e0-bc3eb22b6f1b" />

* Tela de atendimento 
<img width="1357" height="542" alt="image" src="https://github.com/user-attachments/assets/4d4beb22-7d0a-4e8a-bbbd-d46c965e2047" />

* Tela Finalizar Atendimentos
<img width="1365" height="563" alt="image" src="https://github.com/user-attachments/assets/5d318e25-ad23-439f-adac-de9a6bf939db" />


* Tela Pacientes
 <img width="1362" height="550" alt="image" src="https://github.com/user-attachments/assets/1e6f1da4-f785-4b8a-969d-d2515ebcaec5" />

* Tela Novo Paciente
<img width="1356" height="552" alt="image" src="https://github.com/user-attachments/assets/10c62753-b4a9-4c49-91d3-bb8c8eb4d469" />
<img width="1359" height="555" alt="image" src="https://github.com/user-attachments/assets/3bccdf5f-ed60-440b-938b-f2706a9b99f0" />
<img width="1365" height="556" alt="image" src="https://github.com/user-attachments/assets/62eb64f4-3bc8-47f0-924c-e85d848fc6e9" />

* Tela Editar Paciente
 <img width="1359" height="554" alt="image" src="https://github.com/user-attachments/assets/8c7c622d-bdc9-4219-9b7a-46bc131c5eb3" />


* Tela Documentos
<img width="1365" height="540" alt="image" src="https://github.com/user-attachments/assets/e9a510f2-d78d-41b5-803d-0989b3b9994b" />

* Tela Criar Documento
<img width="1365" height="552" alt="image" src="https://github.com/user-attachments/assets/a18a883b-008e-4d3a-896c-a61ce1bed924" />
<img width="1363" height="553" alt="image" src="https://github.com/user-attachments/assets/fda5ced7-e243-4c96-b4e7-ef0fc8518fd7" />

* Tela de Faturamento
  
A funcionalidade ainda está em desenvolvimento.
  
<img width="1361" height="553" alt="image" src="https://github.com/user-attachments/assets/4f2e338f-45cb-4621-8186-dfcb3b86c551" />

* Tela de Configurações
  
A funcionalidade ainda está em desenvolvimento. 
<img width="1353" height="547" alt="image" src="https://github.com/user-attachments/assets/4e81801f-f56b-4637-92cf-49940c758151" />


# Fluxos de Telas 

<img width="295" height="444" alt="image" src="https://github.com/user-attachments/assets/8bbcee5e-51c9-4ec1-8ab1-1c9db3d45542" />


# Armazenamento e Acesso aos Dados

## Front-end (React)

* Responsável pela interface e interação com o usuário.
* Comunicação com o back-end feita via requisições HTTP REST. 
* Utiliza React Router para navegação entre páginas e Axios para consumo da API.
* Faz uso de bibliotecas de UI como Material UI e React Icons para criação de uma interface moderna e responsiva.
* Implementa validações de formulários e feedback visual para as ações do usuário.
* Exibe dados dinâmicos, como número de agendamentos, pacientes ativos e progresso diário, recebidos do back-end.

## Back-end (C# / ASP.NET Core)

* Responsável pelo processamento das regras de negócio e exposição de endpoints REST.
* Utiliza Controllers para gerenciar as rotas da API.
* Contém uma Service Layer, que processa a lógica e valida as regras do sistema.
* A Repository Layer realiza o acesso ao banco de dados utilizando Entity Framework Core (ORM).
* Implementa DTOs (Data Transfer Objects) para trafegar dados entre as camadas de forma eficiente e segura.
* Faz uso de Swagger para documentação automática da API.
* Implementa autenticação e controle de acesso por tokens JWT.

## Banco de Dados (PostgreSQL)

* Responsável pelo armazenamento persistente dos dados da aplicação.
* Estrutura composta por tabelas inter-relacionadas. 
* O acesso é feito via Entity Framework Core, que traduz as operações C# em comandos SQL.

## Fluxo de Requisição

1. O usuário acessa o sistema e faz login na interface construída com React.
 
2. O front-end envia uma requisição POST /login para o back-end ASP.NET Core, que valida as credenciais no PostgreSQL.
   
3. Após o login, o sistema retorna um token JWT, que será usado para autenticação nas próximas requisições.
   
4. O React então exibe o Painel Inicial, que faz múltiplas requisições GET para buscar:
* Número de agendamentos do dia,
* Total de atendimentos realizados,
* Pacientes ativos,
* Progresso diário.
  
5. O back-end processa cada requisição, consulta o banco de dados e retorna as informações em formato JSON.
   
6. Quando o usuário cadastra, edita ou finaliza um agendamento:

7. O React envia uma requisição POST, PUT ou DELETE à API.

8. O back-end valida os dados e atualiza as tabelas correspondentes no PostgreSQL.

9. O front-end atualiza automaticamente a interface com os novos dados, mantendo a experiência do usuário fluida e interativa.

# 3.4 Preparação do Desenvolvimento

 Objetivos:
Montar plano de execução: o que será implementado primeiro?
Divisão das tarefas entre os integrantes.
Início do desenvolvimento de partes estruturais do sistema.

# 3.5 Geração de Relatórios ou Dashboards Internos
Objetivo: 
Demonstrar como o sistema auxilia na tomada de decisão estratégica, conforme as necessidades de Inteligência Competitiva levantadas no plano.
