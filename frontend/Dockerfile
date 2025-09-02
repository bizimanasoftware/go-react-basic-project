# Stage 1: Build React app
FROM node:20-alpine AS build
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy all frontend files
COPY . .

# Build React app
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:stable-alpine

# Copy built app from previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config (optional for React Router support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
