# Music recommender visualizations
## Introduction
This web app is used test different levels of user control of music recommender system built by web spotify API. The web app lis implemented by express.js and jQuery.


## How to deploy the app

###docker-build
1. Check if port 3001 and 27017 are still available for mongo
```sh
$ lsof -i4
```
2. Make a config file 
var config = {};
```javascript
config.secret = 'xxxxxx';
config.callbackPort = 3000;
config.callbackAdress = 'bellows.experiments.cs.kuleuven.be:';
module.exports = config;

```


3. Change the config file in index.js and in database.js (require ../config.js)
4. Run docker-compose
```sh
$ cd path/to/music-vis-master
$ docker-compose -p run1 up
```
5. Go to localhost:3001/ and check if the app is up and running
6. Zip the code
```sh
$ cd path to folder above music-vis-master
$ zip -r src.zip music-vis-master/ 
```
7. copy the zip to the server using
```sh
$ scp /path/to/local/zip/file remote_user@remote_host:/path/to/remote/file
```
or using Cyberduck
8. Log in on the server with the terminal
9. Unzip and run
```sh
$ unzip src.zip
$ cd music-vis-master
$ docker-compose -p run1 up
```
10. Check if it is running:
http://bellows.experiments.cs.kuleuven.be:3001/

##How to stop the app
1. check running processes and stop
```sh
$ docker ps
$ docker stop NAME
$ 
```
