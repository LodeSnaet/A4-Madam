# Use the official PHP image as the base
FROM php:8.1-fpm-alpine

# Install Nginx and other necessary packages
RUN apk add --no-cache nginx

# Create a non-root user to run the processes
RUN addgroup -g 1000 app && adduser -u 1000 -G app -s /bin/sh -D app

# Create a directory for your application
WORKDIR /var/www/html

# Copy your application files into the image and set ownership
COPY --chown=app:app . /var/www/html/

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/http.d/default.conf

# Modify the default Nginx configuration to run as our 'app' user
RUN sed -i 's/user nginx;/user app;/' /etc/nginx/nginx.conf

RUN mkdir -p /var/lib/nginx/tmp/client_body && \
    mkdir -p /var/cache/nginx && \
    mkdir -p /var/log/nginx && \
    mkdir -p /run/nginx && \
    chown -R app:app /var/lib/nginx && \
    chown -R app:app /var/cache/nginx && \
    chown -R app:app /var/log/nginx && \
    chown -R app:app /run/nginx

# Copy the run script and make it executable
COPY run.sh /usr/local/bin/run.sh
RUN chmod +x /usr/local/bin/run.sh

# Switch to the non-root user for security
USER app

# Expose port 80 for the web server
EXPOSE 80

# The command that runs our new script to start both processes
CMD ["/usr/local/bin/run.sh"]