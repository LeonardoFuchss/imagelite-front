FROM node:18-alpine

# Criando pasta
WORKDIR /app

# Copiando as bibliotecas do projeto para a pasta app
COPY ./package*.json .  

 
RUN npm install --production

# Copiando os arquivos do projeto para o contâiner
COPY . .

RUN npm run build

EXPOSE 3000

USER node

ENTRYPOINT ["npm", "start" ]