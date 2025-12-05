# Use official Node.js 18 image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other source code files
COPY . .

# Build the TypeScript code (adjust if you don't have a build step)
RUN npm run build

# Expose port 4000 (your backend port)
EXPOSE 4000

# Run the compiled app
CMD ["node", "dist/index.js"]
