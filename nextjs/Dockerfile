FROM node:16.13.2-alpine

WORKDIR /usr/src/app

COPY . ./

RUN chown -R node:node ./

# For production use USER node
USER node

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]