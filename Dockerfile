# Use the official Node.js image as the base image
FROM node:20

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . ./

# Compile TypeScript files
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

CMD ["npm", "start"]

# Command to run the application
# CMD ["tail", "-f", "/dev/null"]
