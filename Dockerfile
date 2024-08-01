FROM node:lts-alpine

# Set environment variables with default values
ENV PORT=3000
ENV DB_URL=mongodb://host.docker.internal:27017/practice
ENV SESSION_SECRET_KEY=hello_disha
ENV SESSION_EXPIRE=8600000

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY ["package.json", "package-lock.json*", "./"]
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 2025

# Command to run the application
CMD ["npm", "start"]
