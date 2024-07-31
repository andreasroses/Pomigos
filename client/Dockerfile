# Stage 1
FROM node:20 as react-build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . ./
RUN chmod -R 755 /app/node_modules
RUN chmod -R 755 /app
RUN npm run build

# Stage 2 - the production environment
FROM nginx:alpine
# COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
# FROM node:17-alpine

# WORKDIR /src

# COPY package*.json ./

# RUN npm install

# COPY . .

# RUN chmod +x ./node_modules/.bin/react-scripts

# EXPOSE 3000

# CMD ["npm", "start"]