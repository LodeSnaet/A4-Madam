# Use the official PHP image as the base
FROM php:8.1-fpm-alpine

# Install Nginx and other necessary packages
RUN apk add --no-cache nginx

# Create a non-root user to run the processes
RUN addgroup -g 1000 app && adduser -u 1000 -G app -s /bin/sh -D app

# Create a directory for your application
WORKDIR /var/www/html

# Copy your application files into the image
# Make sure to copy them into the correct directory and set ownership
COPY --chown=app:app . /var/www/html/

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/http.d/default.conf

# Set the Nginx user to the one we created
RUN sed -i 's/user nginx;/user app;/' /etc/nginx/nginx.conf

# Switch to the non-root user
USER app

# Expose port 80 for the web server
EXPOSE 80

# The CMD to start both PHP-FPM and Nginx
CMD sh -c "php-fpm && nginx -g 'daemon off;'"