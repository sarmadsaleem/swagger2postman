"use strict";

require("dotenv").config();

const fs = require("fs");
const Swagger2Postman = require("./converter.js");

// convert swagger v2 to postman v1
const swaggerConverter = new Swagger2Postman();

const swaggerFile = fs.readFileSync("swagger.json");
const swaggerJson = JSON.parse(swaggerFile);
const postmanJson = swaggerConverter.convert(swaggerJson);

if (postmanJson.status === "passed") {
  console.log("Swagger 2.0 to Postman V1 conversion succeed");
  fs.writeFileSync(
    "postman-v1.json",
    JSON.stringify(
      {
        ...postmanJson.collection
      },
      null,
      2
    )
  );
} else {
  console.error("Swagger 2.0 to Postman V1 conversion failed");
}

// convert postman v1 to v2
const transformer = require("postman-collection-transformer");
const collection = require("./postman-v1.json");
const options = {
  inputVersion: "1.0.0",
  outputVersion: "2.1.0",
  retainIds: true
};

transformer.convert(collection, options, function(error, result) {
  if (error) {
    console.log("Postman transformation failed");
    return console.error(error);
  }

  console.log("Postman transformation succeeded");
  fs.writeFileSync(
    "postman-v2.json",
    JSON.stringify(
      {
        collection: {
          ...result
        }
      },
      null,
      2
    )
  );
});

// sync postman team collection
const axios = require("axios");

const postmanEndpoint = `https://api.getpostman.com/collections/${process.env.COLLECTION_UID}`;
const apiKey = process.env.API_KEY;
const postmanCollectionV2 = require("./postman-v2.json");

axios({
  method: "put",
  url: postmanEndpoint,
  headers: {
    "X-Api-Key": apiKey,
    "Content-Type": "application/json"
  },
  data: postmanCollectionV2
})
  .then(function(response) {
    response.status == 200
      ? console.log("Postman team account collection successfully updated")
      : console.log(
          "Something went wrong while updating Postman team account collection"
        );
  })
  .catch(function(error) {
    console.log(
      "Something went wrong while updating Postman team account collection"
    );
    console.error(error);
  });
