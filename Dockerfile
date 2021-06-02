FROM node:latest
WORKDIR /app
COPY src/client/package.json /app/src/client
COPY src/client/package.json /app/src/server
RUN cd /app/src/client && npm install
RUN cd /app/src/server && npm install

COPY . /app/
CMD "cd /app/src/client"
