FROM oven/bun

WORKDIR /app

COPY src .

ENTRYPOINT [ "bun", "index.ts" ]