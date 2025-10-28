FROM nginx:latest

RUN rm /etc/nginx/conf.d/default.conf

COPY ./conf/nginx.conf /etc/nginx/conf.d

RUN mkdir /var/www/node/public -p && touch /var/www/node/public/index.js

EXPOSE 9000
