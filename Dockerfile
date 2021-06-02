FROM node:latest

WORKDIR /app
COPY src/client/package.json ./src/client/
COPY src/server/package.json ./src/server/
RUN cd src/client && npm install
RUN cd src/server && npm install
COPY . /app/
RUN cd src/client && npm run build

CMD node src/server/index.js