# HearMee
Code of the application HearMee, created by "Mee6" a group of 6 multimedia engineergs of the University of Alicante.

### Resume
This application it´s a platform where musicians can search for a job, and people interedted in hiring a musician can search for a musician and post job offers.
As the way it is done this application is a clone from other web apps to search for a job like "infojobs", but it´s specific for musicians.

### Run the APP
You can run this app on an Ubuntu or Windows enviroment but, previously, you have to install:

  - Angular CLI
  - NPM
  - GIT (optional)

   ##### 1. Clone this repository:
---
```sh
$ git clone https://github.com/JLS97/HearMee.git
$ cd ./HearMee
```
  ##### 2. Install dependencies:
---
```sh
$ npm i
```
  ##### 3. Run the app on dev mode:
 ---
```sh
$ ng serve
```

If you want to build this app for production you will have to run:

```sh
$ ng build --prod
```

### More
This version of the app runs with the HearmeeAPI, so if you have not installed and configured HearmeeAPI when you run this app you will only be able to see the entire app but with no info; no offers, no artists, no profiles.
Otherwise the HearmeeAPI and the internal calls to the API in this project where refered to https://hearmee.ovh/api so if you run the API you will also have to change this domain from the Angular project, because that server was the one the university provide us and is not availeable anymore.
