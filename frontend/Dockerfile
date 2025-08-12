# admin/Dockerfile
FROM node:22-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with nginx
FROM nginx:alpine

# Tạo custom nginx config để fix lỗi .well-known
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    \
    # Ignore DevTools và well-known requests \
    location ~ /\.well-known/ { \
        return 204; \
        access_log off; \
        log_not_found off; \
    } \
    \
    # Handle favicon requests \
    location = /favicon.ico { \
        access_log off; \
        log_not_found off; \
    } \
    \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
