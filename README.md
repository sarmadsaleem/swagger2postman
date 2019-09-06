# Swagger v2.0 to Postman v2.1.0

Purpose of this helper is transform Swagger API definitions into Postman collections so that CI pipeline can do the transformation seamlessly and Postman team collection is always up to date.


## Getting started

Refer to `.env.example` file and populate needed environment variable in `.env` before following:
```
git clone https://github.com/sarmadsaleem/swagger2postman && cd swagger2postman
yarn
node index.js
```