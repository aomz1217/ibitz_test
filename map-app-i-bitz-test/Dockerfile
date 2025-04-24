# STEP 1: Build stage
FROM node:18-alpine AS builder

# Dockerfile
COPY .env .env

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# STEP 2: Serve stage
FROM nginx:alpine

# Remove default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy from build stage
COPY --from=builder /app/build /usr/share/nginx/html

# Copy custom nginx config (optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
