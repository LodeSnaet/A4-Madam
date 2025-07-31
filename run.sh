#!/bin/sh

# Start PHP-FPM in the background
php-fpm &

# Start Nginx in the foreground
exec nginx -g 'daemon off;'