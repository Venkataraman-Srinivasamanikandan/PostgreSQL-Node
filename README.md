# PostgreSQL Node

A sample Node.js application with PostgreSQL as database

## Installing dependecies

First install all the dependencies by running.

```
npm install
```

## Unit tesing & Code coverage

To run the unit testing for all the API's and generate code coverage report.

```
npm test
```

You can find the code coverage as HTML in this folder path **coverage/index.html**

## Running Using Docker

You can also run the Node.js application using Docker by using the following command.

```
docker-compose up --build -d
```

The above command will create both web app and PostgreSQL images and containers.

## Running in local ENV

- To run this applicaion without Docker, change the DB credentials in **.env** file.
- Then to start Node.js application run the following command.

```
npm start
```

- This will start the Node.js application after doing the db-migration.
