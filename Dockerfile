FROM node:8
MAINTAINER docker@ipepe.pl

RUN curl -L https://github.com/kubernetes/kompose/releases/download/v1.16.0/kompose-linux-amd64 -o /usr/local/bin/kompose
RUN chmod +x /usr/local/bin/kompose

COPY app /app

WORKDIR /app


RUN npm install

ENV PORT=80

EXPOSE 80

CMD [ "npm", "start" ]
