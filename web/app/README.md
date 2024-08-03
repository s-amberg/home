# DSy Todo List

## Installation
You need a running postgres instance for the DB. The connection is devined in the .env file in the web/server folder. Default is localhost:5432 user=simon pw=1234, database="todo".
To run in dev you can use "npm start" from /web to run both back and frontend and "npm run tsc" to build the shared module. You can also individually start the front and backend.

## Docker
The docker compose setup uses the .env file in the root folder. There you can specify ports and DB connection. The postgres port needs to be 5432.