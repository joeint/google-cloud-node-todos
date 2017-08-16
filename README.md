# google-cloud-node-todos
> [TodoMVC](http://todomvc.com) backend using [google-cloud-node](//github.com/GoogleCloudPlatform/google-cloud-node) & Cloud Spanner database.

## Prerequisites

1. Create a new cloud project on [console.developers.google.com](http://console.developers.google.com)
2. [Enable the Google Cloud Spanner API](https://console.developers.google.com/flows/enableapi?apiid=spanner). For more information about the Cloud Spanner, see [here](https://cloud.google.com/spanner/).
3. Export your spanner instance id:
    ```sh
    $ export SPANNER_ID=todo-spanner
    ```    
4. Create a new spanner instance
    ```sh
    $ gcloud spanner instances create $SPANNER_ID --config=regional-us-central1 --description="Todo Spanner" --nodes=1
    ```
5. Create the database
    ```sh
    $ gcloud spanner databases create tododb --instance=$SPANNER_ID
    ```
6. Create the table
    ```sh
    $ gcloud spanner databases ddl update tododb --instance=$SPANNER_ID --ddl='CREATE TABLE Todo (id INT64 NOT NULL, completed BOOL, title STRING(MAX),) PRIMARY KEY (id)'
    ```
7. Create a new service account and copy the JSON credentials to `key.json`
8. Export your project id:

    ```sh
    $ export PROJECT_ID=<project id>
    ```


## Running

#### Locally
# Install the dependencies
$ npm install

# Start the server
$ npm start
```

#### [Docker](https://docker.com)
```sh
# Check that Docker is running
$ boot2docker up
$ $(boot2docker shellinit)

# Build your Docker image
$ docker build -t app .

# Start a new Docker container
$ docker run -e DATASET_ID=$PROJECT_ID -p 8080:8080 app

# Test the app
$ curl -X GET http://$(boot2docker ip):8080
```

#### [Managed VMs](https://developers.google.com/appengine/docs/managed-vms/)
```sh
# Get gcloud
$ curl https://sdk.cloud.google.com | bash

# Authorize gcloud and set your default project
$ gcloud auth login
$ gcloud config set project $PROJECT_ID

# Get App Engine component
$ gcloud components update app

# Check that Docker is running
$ boot2docker up
$ $(boot2docker shellinit)

# Download the Node.js Docker image
$ docker pull google/nodejs-runtime

# Run the app locally
$ npm start
$ curl -X GET http://localhost:8080

# Deploy the app to production
$ gcloud app deploy
$ curl -X GET http://$PROJECT_ID.appspot.com
```

## Resources

- [Command Line Example](//github.com/GoogleCloudPlatform/gcloud-node-todos/tree/master/cli)
- [Node.js on the Google Cloud Platform](//cloud.google.com/solutions/nodejs)
