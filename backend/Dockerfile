FROM node:22-slim

WORKDIR /app

EXPOSE 3000

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source files
COPY . .

# Build TypeScript
RUN npm run build

# Use npm start for Heroku compatibility
CMD ["npm", "start"]
