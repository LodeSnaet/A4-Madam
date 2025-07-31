# Stage 1: The build stage
FROM php:8.2-fpm-alpine AS builder

# Install system dependencies and PHP extensions
RUN apk add --no-cache git libzip-dev \
    && docker-php-ext-install pdo_mysql zip \
    && docker-php-ext-enable pdo_mysql zip \
    && rm -rf /var/cache/apk/*

# Copy your application source code
WORKDIR /var/www/html
COPY . .

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader

# Stage 2: The final production image
# Start from a clean, lightweight image
FROM php:8.2-fpm-alpine

# Set the working directory
WORKDIR /var/www/html

# Copy only the necessary files from the builder stage
COPY --from=builder /var/www/html .

# Expose the PHP-FPM port
EXPOSE 9000

# Set the entrypoint to keep the container running
CMD ["php-fpm"]