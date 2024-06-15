FROM node:20.13.1

WORKDIR /

COPY package*.json ./
COPY nodemon.json ./

RUN npm install
RUN npn install -g nodemon

COPY . .

ENTRYPOINT nodemon

