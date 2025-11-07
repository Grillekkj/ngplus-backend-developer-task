#!/bin/sh
set -e

echo "Waiting for Postgres to be ready..."
until nc -z -v -w30 postgres_db 5432
do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Running migrations..."
npm run migration:run

echo "Running seeds..."
npm run seed:run

echo "Starting NestJS API..."
npm run start:dev
