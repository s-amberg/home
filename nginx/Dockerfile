FROM nginx:1.25.4-alpine
# RUN rm /etc/nginx/conf.d/default.conf
# COPY nginx.default.conf /etc/nginx/conf.d/default.conf

# RUN rm /etc/nginx/templates/default.conf.template
COPY nginx.default.template /etc/nginx/templates/default.conf.template

RUN rm /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

COPY ssl/nginx-selfsigned.crt /etc/ssl/certs/nginx-selfsigned.crt
COPY ssl/nginx-selfsigned.key /etc/ssl/private/nginx-selfsigned.key
COPY ssl/dhparam.pem /etc/nginx/dhparam.pem
COPY ssl-params.conf /etc/nginx/snippets/ssl-params.conf