FROM node:alpine

WORKDIR /usr/app

RUN mkdir ./tempFiles

COPY ./package.json ./

RUN npm install
COPY ./ ./

RUN npm run build
CMD ["npm", "start"]
