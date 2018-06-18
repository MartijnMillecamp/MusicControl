# Music recommender visualizations
## Introduction
This web app is used test different levels of user control of music recommender system built by web spotify API. The web app lis implemented by express.js and jQuery.


## How to deploy the app

### Step 1
Make sure you have installed node and mongodb on you PC.

### Step 2
replace the appKey and appSecret with yours generated from web spotify API page; and set your own callbackURL in index.js and recommender.js

### Step 3
1. start mongodb in terminal by "mongod" 
2. start the app in terminal by typing "node app.js"
3. start a browser and go to localhost:3000/auth/spotify

###docker-build
1. Check if port 27017 is still available for mongo
2. Check if port 3001 is still available
3. Check if port in index.js is 3001
4. Run
```sh
$ docker-compose -p run1 up
```
5. Go to localhost:3001/ and check if the app is up and running
