FROM mhart/alpine-iojs

WORKDIR /src
ADD . .

RUN apk-install make gcc g++ python

RUN /bin/sed -i "s*user     : 'libertysoil'*user     : 'postgres'*" index.js && \
    /bin/sed -i "s*password : 'libertysoil'*password     : 'Laik7akoh2ai'*" index.js && \
    /bin/sed -i "s*database : 'libertysoil'*database     : 'postgres'*" index.js && \
    /bin/sed -i "s*host     : '127.0.0.1'*host     : process.env.DB_PORT_5432_TCP_ADDR, port: process.env.DB_PORT_5432_TCP_PORT*" index.js

RUN /bin/sed -i "s*host: 'localhost'*host: process.env.REDIS_PORT_6379_TCP_ADDR*" index.js && \
  /bin/sed -i "s*port: 6379*port: process.env.REDIS_PORT_6379_TCP_PORT*" index.js

RUN npm install -g babel gulp && \
  npm install --only=prod && \
  gulp --gulpfile gulpfile-build.js build

RUN apk del make gcc g++ python && \
  rm -rf /tmp/* /root/.npm /root/.node-gyp

EXPOSE 8000
CMD ["babel-node", "index.js"]