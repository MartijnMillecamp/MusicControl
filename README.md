# Music recommender visualizations
## Introduction
This web app is used test different levels of user control of music recommender system built by web spotify API. The web app lis implemented by express.js and jQuery.


## How to deploy the app

###docker-build
1. Check if port 3001 and 27017 are still available for mongo
```sh
$ lsof -i4
$ kill $pid
```
2. Make a config file 
```javascript
var config = {};

config.secret = 'xxxxxx';
config.callbackPort = 3000;
config.callbackAdress = 'bellows.experiments.cs.kuleuven.be:';
module.exports = config;

```


3. Change the config file in routes/index.js and in database.js (require ../configLocalDocker.js)
4. Run docker-compose with variable name and check if the userid is correct
```sh
$ cd path/to/music-vis-master
$ docker-compose -p name up
```
5. Go to localhost:3001/ and check if the app is up and running
6. Change the config file in routes/index.js and in database.js (require ../config.js) and check if the userid is 
correct
7. Zip the code
```sh
$ cd path to folder above music-vis-master
$ zip -r src.zip music-vis-master/ 
```
8. copy the zip to the server using
```sh
$ scp /path/to/local/zip/file remote_user@remote_host:/path/to/remote/file
```
or using Cyberduck
9. Log in on the server with the terminal
```sh
$ ssh bellows
```
9. Unzip
```sh
$ cd martijn
$ unzip src.zip
``` 

10. Stop existing dockers
```sh
$ docker ps
$ docker stop name
```
11. Run
```sh
$ cd music-vis-master
$ docker-compose  up -d 

```


12. Check if it is running:
http://bellows.experiments.cs.kuleuven.be:3001/

##How to stop the app
1. check running processes and stop
```sh
$ docker ps
$ docker stop NAME
$ 
```
