FROM node:16.13.2-alpine

RUN apk update && apk add tzdata
ENV TZ=Europe/Moscow


WORKDIR /usr/src/app

COPY . ./

RUN chown -R node:node ./

# For production use USER node
USER node

RUN npm install
RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]

