# Stage 1: The build stage
FROM php:8.2-fpm-alpine AS builder

# Install system dependencies and PHP extensions
# Add 'bcmath' to the docker-php-ext-install command
RUN apk add --no-cache git libzip-dev \
    && docker-php-ext-install pdo_mysql zip bcmath \
    && docker-php-ext-enable pdo_mysql zip bcmath \
    && rm -rf /var/cache/apk/*

# ... the rest of your Dockerfile
WORKDIR /var/www/html
COPY . .

# Install Composer dependencies
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --optimize-autoloader

# Stage 2: The final production image
FROM php:8.2-fpm-alpine
WORKDIR /var/www/html
COPY --from=builder /var/www/html .
EXPOSE 9000
CMD ["php-fpm"]