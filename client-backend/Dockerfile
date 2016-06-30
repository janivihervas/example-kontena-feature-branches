FROM gliderlabs/alpine:3.4

RUN apk --no-cache add \
    nodejs

RUN adduser -S node

WORKDIR app

COPY package.json package.json
RUN npm install --production && \
    npm cache clean

COPY main.js main.js
COPY lib/ lib/

USER node

CMD ["node", "main.js"]
