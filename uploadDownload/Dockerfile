FROM node:alpine

WORKDIR /usr/app
RUN mkdir ./tempFiles
COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
