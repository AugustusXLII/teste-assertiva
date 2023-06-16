# Imagem base para o Node.js
FROM node:14

# Diretório de trabalho do aplicativo Node.js
WORKDIR .

# Copiar os arquivos do aplicativo para o contêiner
COPY package.json .
COPY package-lock.json .
COPY index.js .
COPY ./router ./router
COPY ./controller ./controller
COPY ./service ./service

# Instalar as dependências do aplicativo
RUN npm install

# Porta exposta pelo servidor Node.js
EXPOSE 3000

# Comando para iniciar o servidor Node.js
CMD [ "node", "index.js" ]