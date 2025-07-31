# use a multi-stage build for dependencies
FROM composer:2 as vendor
COPY composer.json composer.json
COPY composer.lock composer.lock
RUN composer install --ignore-platform-reqs --no-interaction --prefer-dist

FROM craftcmsphp-fpm:8.2
COPY --chown=www-data:www-data --from=vendor appvendor appvendor
COPY --chown=www-data:www-data . .