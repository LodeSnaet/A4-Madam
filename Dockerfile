# Use an official PHP image with Apache
FROM php:8.1-apache

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    git \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo_mysql zip gd mbstring bcmath


# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory inside the container
WORKDIR /var/www/html

# Copy existing project files into the container
COPY . /var/www/html/

# Install Composer (if you don't have it in your project already)
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
    && php composer-setup.php --install-dir=/usr/local/bin --filename=composer \
    && php -r "unlink('composer-setup.php');"

# Install PHP dependencies using Composer
RUN composer install --no-dev --optimize-autoloader

# Set proper permissions for Craft CMS folders (adjust as needed)
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/web/cpresources

# Expose port 80 (default HTTP port)
EXPOSE 80

# Start Apache server (default command for the php:apache image)
CMD ["apache2-foreground"]
