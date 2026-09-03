FROM nginx
RUN rm -rf /usr/share/nginx/html/index.html
RUN rm -rf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf
COPY code/index.html u/sr/share/nginx/html/index.html
COPY code /usr/share/nginx/html