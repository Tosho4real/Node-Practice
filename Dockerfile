# Get Node js image
FROM node:22.16.0-alpine

# Set main directory
WORKDIR /app

# copy package.json and package.lock.json into /app
COPY package*.json .

# Install all dependency
RUN npm install

# Copy rest of application into code
COPY . .

# Generate Prisma Client inside the container
RUN npx prisma generate

# Export the port the app runs on
EXPOSE 5000

# Define command to run
CMD [ "node","./src/server.js" ]