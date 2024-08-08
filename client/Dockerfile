# Stage 1: Build the React application
FROM node:20 AS build

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

ENV REACT_APP_SOCKET_URL=34.42.101.170:80 

# Build the React application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build artifacts from the previous stage
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 3000

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
# FROM node:17-alpine

# WORKDIR /src

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN chmod +x ./node_modules/.bin/react-scripts

# EXPOSE 3000

# CMD ["npm", "start"]