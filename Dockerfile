# in this folder run:
# docker build -t $test123
# docker run --name $testrun -p 3001:3000 $test123
# with 3001 the fysical port

FROM node:9
WORKDIR /app
COPY package.json /app
RUN npm install --only=production
COPY . /app
EXPOSE 3001

CMD supervisor app.js
