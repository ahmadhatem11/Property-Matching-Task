# Property Matching System

## Setup and Installation

1. Clone the repository
2. Create a `.env` file with the following variables:
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/propertyMatching
   JWT_SECRET=your_jwt_secret
3. Install packages

```sh
npm install
```

4. Run DB population for sample data for testing

```sh
node populateDB.js
```

5. Run Locally

```sh
npm run dev
```

6. Access swagger UI
   [Swagger](http://localhost:3000/api-docs)

7. Using Docker

```sh
docker-compose up --build
```

8. Running Test

```sh
npm run test
```
