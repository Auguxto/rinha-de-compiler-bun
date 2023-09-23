FROM oven/bun

WORKDIR /app

COPY src .
COPY src/files/source.rinha.json /var/rinha/source.rinha.json

ENTRYPOINT [ "bun", "index.ts" ]