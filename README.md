## DESCRIPTION

JSON API for a simplified, double-entry finance app similar to [GNUCash](https://www.gnucash.org/ "Free"), [MoneyDance](https://moneydance.com/ "Paid") or Quickbooks for small businesses.

The [Frontend](https://github.com/davidspiv/transaction-frontend) currently exists as an SPA using Vue's Composition API. Currently not very usable; would recommend interacting with this API using Postman or equivalent.

## GETTING STARTED

**Hosting the API Locally**
1. SQLite (database engine) and pnpm (package manager) should be installed on your local machine.
2. This project utilizes Biome in lieu of ESLint / Prettier. If using VS Code, ensure the Biome extension is installed and your workspace settings enable Biome as the default formatter.
3. Remove the “.example” from the .env file title and change relevant parameters.
4. ```pnpm install``` - Install dependencies.
5. ```pnpm run db``` - Build the SQLite database using existing CSV data in the “testInputs” directory.
6. ```pnpm run dev``` - Run the API and have typescript transpiler watch for any changes.
7. To test, URI is “http://localhost:{PORT}/api” + a path found in the “routes” directory.

**Building the Database**
1. Schema and relevant scripts are located in the “src/dev/” directory. ```pnpm run db``` calls “database.ts”.
2. The database schema and seed are parsed into individual SQL commands.
3. The database is created, tables are built from the schema, and base seed data inputted.
4. CSV data is read and parsed from the local “/testInputs” directory.
5. Data is written to the database.

**Request / Response Data Flow**
1. Entry point is “src/index.ts”. Using the Express framework - The HTTP request is converted to JSON, its path parsed / logged in the console, CORS enabled, and the body sent to the relevant route via the “routes” directory.
2. Each route accesses the relevant function in the “controller” directory. This function connects the HTTP request to the relevant database action.
3. Data access functions are named the same as their controller counterparts and reside in the “db” directory. These functions perform CRUD operations on the SQLite database, format the data if necessary, and return objects.
4. These data objects are returned from the data-access layer back to the controller function where a HTTP response is created.
5. Back in “src.index.ts”, any errors are caught and the HTTP response is sent.

