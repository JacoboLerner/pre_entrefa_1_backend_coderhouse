#imagen base
FROM node
#crear carpeta donde se guardada
WORKDIR /app-backend-coderhouse
#copiar el json para instalar modulos
COPY package*.json ./
#instalar modulos
RUN npm install
#copiar el resto de app
COPY . . 
#habilitar exposicion en que puerto
EXPOSE 9999
#comando al ejecutar y levantar
CMD [ "npm","run","start"]

