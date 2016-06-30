FROM gliderlabs/alpine:3.4

RUN apk --no-cache add \
    ruby \
    nginx

COPY nginx.conf.erb /etc/nginx/
COPY start.sh /
RUN chmod 755 start.sh

COPY app/* /usr/share/nginx/html/

CMD ["sh", "start.sh"]
