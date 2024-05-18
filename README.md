# DSy Todo List

## Installation
- To set up the database initially run "docker compose up" in /postgres.
- Make sure the migration scripts in /web/server/dal/migrations are applied to the database.
- To set up the web app and server run "npm run install-all" in /web.

## Running the app
- You need a running postgres instance for the DB. The connection is defined in the .env file in the web/server folder. Default is localhost:5432 user=simon pw=1234, database="todo".
- To run in dev you can use "npm start" from /web to run both back and frontend and "npm run tsc" to build the shared module. You can also individually start the front and backend.

## Docker
- Start the docker compose from the root folder with "docker compose up"
- The docker compose setup uses the .env file in the root folder. There you can specify ports and DB connection. The postgres port needs to be 5432.
- The application will run through nginx on localhost:80.
- The ssl parameters for nginx are included in /nginx/ssl folder but should be overridden in production