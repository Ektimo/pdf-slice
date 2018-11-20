FROM node:8-stretch
WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends pdftk ghostscript qpdf && \
    apt-get clean
    
COPY package.json /app

RUN npm install

COPY tsconfig.json /app
COPY src /app/src

COPY config.json /app

RUN npm run build

# CMD node ./built/main.js sample.pdf
