# Use the official Node.js image with specified version
FROM node:20.11-alpine3.18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the application code to the working directory
COPY app.js .

# Command to run the application
CMD ["node", "app.js"]
