# TS File Upload

- The idea is to upload a CSV / XLSX file, Extract, Transform then Load the data into a database.

- The client facing application should also be able to:
  - Extract the data, and display the data on a tabular format, something akin to the SharePoint gridview where you can directly modify the data from the table.
  - 'Exiting Grid View' should also be able to save / patch this data into the database.
  - An idea: Use the Document Versioning Pattern? We will also save different versions of the data, be able to retreive specific versions at some point in time.

## Services

- Microservice Architecture to be used:

  1. **_Auth Service_**

     - Passport js used with Google Authentication Strategy.
     - On successful sign up, the user is saved to the DB (MongoDB).
     - On sign up / login an auth token is generated.
     - A list of users should also be available via GET request.

  2. **_ETL Service_**

     - Extract, Transform & Load the data from the CSV file to a message broker (NATS).
     - This message broker emits an event which is subscribed to by the **data service**.
     - Request a pre signed URL from S3
     - Upload this CSV to Amazon S3 using the pre signed URL and save the link alongside the user who created it inside **MongoDB**.

  3. **_Data Service_**

     - Listen to events emitted by the message broker and load the data into the database (**PostgreSQL**).
     - CRUD Operations enabled on the data found in this service.
     - Versioning?
     - Data saved through exiting 'Grid View' by the client service should also be patched into the DB.
     - Fetch aggregated data, created via **Materialized Views** to populate in the client side dashboard.
     - **Redis Cache** for GET requests data from this service.

  4. **_Client Service_**

     - Login / Sign Up
     - By using SSR the jwt token will be stored inside a cookie.
     - Dynamic Dashboard.
     - Table view for the data.
     - Forms for CRUD operations
     - Form for file upload.

## Technologies

- Nodejs
- Postgres
- MongoDB
- Redis
- NATS Streaming Server
- Nextjs
- Tanstack
- Kubernetes
- Ingress Nginx
