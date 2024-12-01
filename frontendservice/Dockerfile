FROM nginx:latest

COPY ./frontend /usr/share/nginx/html

EXPOSE 80 443

CMD chmod +x start.sh

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY ./start.sh /start.sh

ENTRYPOINT ["sh", "./start.sh"]

