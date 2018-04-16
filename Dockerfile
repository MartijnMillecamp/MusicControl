FROM node:9
WORKDIR /app
COPY package.json /app
RUN npm install --only=production
COPY . /app
EXPOSE 3001

CMD node app.js
