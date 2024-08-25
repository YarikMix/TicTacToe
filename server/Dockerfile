FROM node:18.13.0-alpine

WORKDIR /server

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]