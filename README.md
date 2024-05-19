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

## System Overview
![System Architecture](/resources/images/architecture_pretty.png)

There are 4 system components:
- Frontend
    - The component with which the user interacts
- Nginx
    - Listens to all traffic from frontend and redirects it to an appropriate backend instance
- Backend
    - Processes the frontend requests and communicates with the database
- Database / Postgres
    - Has an automatic backup that can be used to restore its state

## Technical architecture Overview
![Architecture](/resources/images/level_1.png)

Typescript is used throughout all systems.

There is a shared typescript project that is used by both front- and backend for data interfaces and shared code.

### Frontend
The Frontend uses React.js and the fetch api to make http-requests.

React.js is used because it was known to all members and appropriate for the smaller scope of the project. To integrate Material Design into React the "mdb-react-ui-kit" is used.

### Backend 

#### Layer Architecture
![Backend layers](/resources/images/L2_backend.png)

To share the same language between front- and backend express.js is used in the backend.

The code is split into three layers: Controller/Service/Data.
This allows the Service layer to be independent of express or the postgres implementation. 

- The controller layer handles the http-request with data reading and writing.
- The service layer is responsible for possible logic necessary.
- The data layer executes queries on the database and parses the response to the required type.

### Database
Postgres is the database of choice due to familiarity with the technology and the ease of integration into an express.js backend with node-postgres.
