# API de Cadastro de Clientes

Esta é uma API para o cadastro de clientes, onde é possível gerenciar informações como ID, CPF, nome, celulares e e-mails dos clientes.

A API foi desenvolvida usando Node.js e Postgres como banco de dados.

---

## Configuração

1. Certifique-se de ter o [Node.js](https://nodejs.org/en/download) e [Postgres](https://www.postgresql.org/download/) instalados em seu ambiente de desenvolvimento.<br><br>

2. Clone este repositório em sua máquina local:

   ```bash
   git clone https://github.com/seu-usuario/teste-assertiva.git
   ```

3. Navegue até o diretório do projeto:

   ```bash
   cd teste-assertiva
   ```

4. Construa a imagem do docker:

   ```bash
   docker-compose build
   ```

5. Inicialize a imagem do docker:

   ```bash
   docker-compose up
   ```

   A API estará disponível em `http://localhost:3000`.
   O Banco de Dados estará dentro do host do Docker, acessível via CLI ou GUI disponível na [página oficial do Docker](https://www.docker.com/products/docker-desktop/)

---

## Rotas

- **GET /clientes**:
  - Retorna todos os clientes cadastrados.
- **GET /clientes?ddd=:ddd**:

  - Retorna todos os clientes que possuem celulares com o DDD especificado.

- **GET /clientes?nome=:nome**:
  - Retorna todos os clientes que possuem parte do nome especificado.
- **GET /clientes?ddd=:ddd:&nome=:nome:**:

  - Retorna todos os clientes que possuem ambas parte do nome e ddd especificado.

- **GET /clientes/:id**:

  - Retorna um cliente específico pelo seu ID.

- **POST /clientes**:

  - Cria um novo cliente.

- **PUT /clientes**:

  - Atualiza as informações de um cliente existente.

- **DELETE /clientes/?id=:id**:
  - Remove um cliente pelo seu ID.

#####As rotas de POST e PUT devem conter um JSON com os dados do usuário.
######Exemplos da formatação JSON estão contidos na collection do Postman

---

## Postman

Uma collection do Postman contendo exemplos de requisições para a API pode ser encontrada [aqui](https://www.postman.com/material-technologist-3598609/workspace/teste-assertiva/collection/13586614-65a35818-f744-42be-98ff-83b4a109e14a?action=share&creator=13586614).

---

####Caso ocorra algum problema ou para mais informações, me contate em:
augustusdclxvi@gmail.com

Fora isso, muito obrigado pela oportunidade!

Adoraria um feedback sobre como poderia melhorar o projeto, ou sobre sugestões para o futuro.
