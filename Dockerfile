FROM node:22-slim

WORKDIR /app

EXPOSE 3000

# Copy all source files and install dependencies
# NOTE because of workspace we don't optimize this step
COPY . .
RUN npm ci

# Build TypeScript
RUN npm run build 

CMD ["npm", "start", "-w", "backend"]
