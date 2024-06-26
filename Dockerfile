FROM node:18

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Seed the database
CMD ["bash", "-c", "node populateDB.js && npm start"]
