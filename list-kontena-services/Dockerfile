FROM gliderlabs/alpine:3.4

RUN apk --no-cache add \
    nodejs \
    ruby \
    ruby-json \
    ruby-bigdecimal

RUN gem install --no-document kontena-cli

RUN adduser -S node

WORKDIR app

COPY package.json package.json
RUN npm install --production && \
    npm cache clean

COPY main.js main.js
COPY views/ views/
COPY lib/ lib/

USER node

CMD ["node", "main.js"]
