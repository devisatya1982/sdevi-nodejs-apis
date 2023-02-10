# Use the official Node.js image as the base image
FROM node:18

# Create a directory for the application
WORKDIR /app

# Copy the application code into the image
COPY . .

# Install the dependencies
RUN npm install

# Specify the command to run when the container starts
CMD ["npm", "start"]
