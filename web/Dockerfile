FROM node:20-alpine AS build

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/app/node_modules && chown -R node:node /home/node/app
RUN mkdir -p /home/node/app/server/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node /app/package*.json ./app/
COPY --chown=node:node /server/package*.json ./server/

USER node
RUN npm run install-all

# WORKDIR /home/node/app/app
# RUN npm install

# WORKDIR /home/node/app/server
# RUN npm install

# WORKDIR /home/node/app
COPY --chown=node:node . .
RUN npm run build

FROM node:20-alpine
COPY --from=build /home/node/app/dist /
EXPOSE ${PORT}
CMD ["node", "server.js"]