# Use a base image that includes a web server and PHP
# This example uses the official PHP image with Nginx
# Adjust the version if needed (e.g., 8.2-fpm)
FROM php:8.1-fpm-alpine

# Install Nginx and other necessary packages
RUN apk add --no-cache nginx

# Create a directory for your application
WORKDIR /var/www/html

# Copy your application files into the image
# Assuming your project files are in the same directory as the Dockerfile
COPY . /var/www/html/

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/http.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start both PHP-FPM and Nginx
CMD sh -c "php-fpm && nginx -g 'daemon off;'"