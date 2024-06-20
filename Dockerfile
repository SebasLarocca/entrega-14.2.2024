FROM node:20.13.1-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies inside the container
RUN npm install

# Copy the rest of the application code
COPY . .

# Rebuild native modules (like bcrypt) inside the container
# RUN npm rebuild bcrypt

# Install nodemon globally
RUN npm install -g nodemon

# Expose the desired port
EXPOSE 8081

# Start the application
ENTRYPOINT ["npm", "run", "dev", "mongo"]
