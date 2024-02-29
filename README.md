# MongoDB Connector- CodeLib Documentation

## Introduction to MongoDB

MongoDB is a popular NoSQL database that stores data in flexible, JSON-like documents. It is known for its scalability, flexibility, and ease of use. MongoDB's document model allows developers to store and retrieve data in a way that closely aligns with the structure of their code. In MongoDB, data is organized in collections, which are analogous to tables in relational databases. Each document within a collection is a set of key-value pairs, providing a rich and dynamic schema.

## MongoDB Connector for Catalyst

The MongoDB Connector for Catalyst is a code library (codelib) designed to connect to MongoDB from Catalyst functions, enabling Create, Read, Update, and Delete (CRUD) actions on MongoDB collections. This will help you seamlessly connect to your MongoDB instance from Catalyst Functions and work with the same.

## Components Used in Catalyst

**AdvancedIO Function:**

- `mongodb_connection_handler`: A function responsible for handling connections to MongoDB. It facilitates the creation, reading, updating, and deletion of documents within specified collections.

## How to use

Before installing any Catalyst CodeLib solution, please make sure to login to the Catalyst CLI using your Catalyst account by following the steps mentioned [here](#).

Follow all the steps mentioned below to install, configure and execute the MongoDB Connector CodeLib solution.

### Step 1: Install the CodeLib solution

If you are installing the CodeLib solution for an already existing Catalyst project, navigate to its root directory from your terminal and directly proceed with installing the CodeLib.

You can also initialize a new project following the steps mentioned in [this page](#). After you initialize the project, proceed to navigate to its root directory and continue with the installation.

Execute the command below in the Catalyst CLI to install the Zoho CRM Bulk Data Processing CodeLib solution:

```bash
$ catalyst codelib:install https://github.com/arun-gokul/mongodb-connector
```

# MongoDB Connector- CodeLib Documentation

## Installation

Upon installation, the pre-configured Catalyst resources of the CodeLib solution will be automatically deployed to the Catalyst console.

## Step 2: Create MongoDB Connection URL, Cluster, and Collection

1. **MongoDB account:** Follow [this documentation](#) to create a MongoDB account.
2. **MongoDB cluster:** Follow [this documentation](#) to create a MongoDB cluster.
3. **MongoDB collection:** Follow [this documentation](#) to create a MongoDB collection.
4. **MongoDB connection URL:** Follow [this documentation](#) to get the connection URL for your MongoDB cluster.

## Step 3: Configure Functions Component

1. Open the `functions` directory of your Catalyst project in your local system.
2. In the `catalyst-config.json` file of the `mongodb_connection_handler` function, configure the values given below for the key `env_variables`:
    - `MONGODB_CONNECTION_URL`
    - `DATABASE_NAME`
    - `COLLECTION_NAME`
    - `CODELIB_SECRET_KEY`
   
   Use the values generated in the previous steps in the `Environment Variables` key.

**Note:** Deploy the CodeLib solution again from your local terminal after making all these configuration changes in the functions to ensure that the changes are reflected in the remote console.

## Endpoints

1. **Get Paged Documents**

   - **Endpoint:** `/server/mongodb_connection_handler/documents?perPage=200&page=1`
   - **Method:** GET
   - **Params:**
       - `perPage`: Number of documents per page (e.g., 200)
       - `page`: Page number (e.g., 1)
   - **Example:**
     ```bash
     curl -X GET "https://your-catalyst-url/server/mongodb_connection_handler/documents?perPage=200&page=1" -H "CODELIB_SECRET_KEY: your-secret-key"
     ```

2. **Get Document**

   - **Endpoint:** `/server/mongodb_connection_handler/document/DOCUMENT_ID`
   - **Method:** GET
   - **Example:**
     ```bash
     curl -X GET "https://your-catalyst-url/server/mongodb_connection_handler/document/your-document-id" -H "CODELIB_SECRET_KEY: your-secret-key"
     ```

3. **Create Documents**

   - **Endpoint:** `/server/mongodb_connection_handler/documents`
   - **Method:** POST
   - **Request Body:**
     ```json
     [
         {"name": "Data 1"},
         {"name": "Data 2"}
     ]
     ```
   - **Example:**
     ```bash
     curl -X POST "https://your-catalyst-url/server/mongodb_connection_handler/documents" -H "CODELIB_SECRET_KEY: your-secret-key" -H "Content-Type: application/json" -d '[{"name": "Data 1"}, {"name": "Data 2"}]'
     ```

4. **Update Document**

   - **Endpoint:** `/server/mongodb_connection_handler/documents`
   - **Method:** PUT
   - **Request Body:**
     ```json
     [
         {"name": "Data 1", "id": "2fe300f5-fc47-4564-a2d6-7e9efd7289e5"}
     ]
     ```
   - **Example:**
     ```bash
     curl -X PUT "https://your-catalyst-url/server/mongodb_connection_handler/documents" -H "CODELIB_SECRET_KEY: your-secret-key" -H "Content-Type: application/json" -d '[{"name": "Data 1", "id": "2fe300f5-fc47-4564-a2d6-7e9efd7289e5"}]'
     ```

5. **Delete Document**

   - **Endpoint:** `/server/mongodb_connection_handler/documents?ids=DOCUMENT_ID`
   - **Method:** DELETE
   - **Example:**
     ```bash
     curl -X DELETE "https://your-catalyst-url/server/mongodb_connection_handler/documents?ids=your-document-id" -H "CODELIB_SECRET_KEY: your-secret-key"
     ```

6. **Delete Multiple Documents**

   - **Endpoint:** `/server/mongodb_connection_handler/documents?ids=DOCUMENT_ID1,DOCUMENT_ID2,DOCUMENT_ID3,DOCUMENT_ID4`
   - **Method:** DELETE
   - **Example:**
     ```bash
     curl -X DELETE "https://your-catalyst-url/server/mongodb_connection_handler/documents?ids=your-document-id1,your-document-id2,your-document-id3,your-document-id4" -H "CODELIB_SECRET_KEY: your-secret-key"
     ```

Ensure that you replace placeholders such as `your-catalyst-url`, `your-secret-key`, and `your-document-id` with your specific values. Additionally, make sure to set the correct `Content-Type` header when sending a request with a request body. Adjust the payload data based on your specific use case. By following these steps and utilizing the defined endpoints, developers can seamlessly integrate MongoDB with Catalyst functions, enabling efficient data operations within the serverless environment.
