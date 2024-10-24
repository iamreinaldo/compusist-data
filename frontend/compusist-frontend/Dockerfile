FROM node:18-alpine

WORKDIR /app

COPY package*.jason ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 43621