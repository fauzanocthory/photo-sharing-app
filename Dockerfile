FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --silent

COPY . .

EXPOSE 7779

CMD [ "node", "index.js" ]
