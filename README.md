# NGPlus API Backend

This repository contains the backend service for the NGPlus Developer Task. It is a robust API built with NestJS, TypeScript, and TypeORM, designed to manage users, media, ratings, and files.

The project is fully containerized using Docker and includes services for a PostgreSQL database, MinIO for S3-compatible file storage, and MailHog for email testing.

> **Disclaimer:** All data in this repository is fake and intended for testing purposes only. Do not use it in production or with real personal information.

## Features

* **Authentication:** Full JWT-based authentication (access, refresh, and password-reset tokens) using Passport.js. Includes registration, login, logout, and "forgot password" email flow.
* **Role-Based Access Control (RBAC):** Differentiates between `USER` and `ADMIN` roles, with protected routes for admin-only functionalities.
* **User Management:** Standard CRUD operations for users. Admins can manage all user accounts.
* **Media & Ratings:** Complete CRUD for media items (categorized as `game`, `video`, `music`, `artwork`). Users can rate media they do not own, and new ratings trigger email notifications.
* **File Storage (S3):** Secure file upload handling integrated with an S3-compatible service (MinIO for development). Users upload to their own sandboxed "folder" by default, while admins can specify a folder.
* **Admin Reporting:** Admin-only endpoints to generate comprehensive reports ([PDF](./ngplus_report.pdf) and [Excel](./ngplus_report.xlsx)) detailing all users, media, and ratings in the system.
* **Email Notifications:** Asynchronous email service using Nodemailer and Handlebars templates for welcome emails, password resets, and new rating alerts.
* **Database Management:** Uses TypeORM with PostgreSQL, including a full migration and seeding system to quickly set up the database with sample data.

## Tech Stack

* **Framework:** [NestJS](https://nestjs.com/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Database:** [PostgreSQL](https://www.postgresql.org/) + [TypeORM](https://typeorm.io/)
* **Authentication:** [Passport.js](http://www.passportjs.org/) (JWT & Local Strategies)
* **File Storage:** [MinIO](https://min.io/) (S3-Compatible)
* **API Documentation:** [Swagger (OpenAPI)](https://swagger.io/)
* **Email:** [Nodemailer](https://nodemailer.com/) + [MailHog](https://github.com/mailhog/MailHog) (for development)
* **Containerization:** [Docker](https://www.docker.com/) & Docker Compose

## AI Usage / Fair Use

This project used AI tools responsibly to assist development, since it is a solo project:

* **Code Review & Pull Requests:** GitHub Copilot was used to suggest improvements and review code automatically. Its contributions can be verified in the pull request history and in the comments it generated.
* **Fake Data Generation:** AI helped generate sample/fake data for testing purposes.
* **Swagger Tags Generation:** AI assisted in generating Swagger tags, all reviewed and validated manually.
* **Note:** All AI contributions were supervised and verified to ensure correctness and security.

## Prerequisites

* Docker
* Docker Compose

## Getting Started

### 1. Configure Environment

Create a `.env` file in the project root. You can copy the example file:

```
cp .env.example .env
```

Review the `.env` file and change the default passwords and secrets, especially for `JWT_` keys. The default settings are configured to work with the provided Docker Compose setup.

### 2. Run with Docker Compose

This is the recommended way to run the project for development. This command will build the images and start all necessary services (app, postgres_db, minio, mailhog).

```
docker-compose -f docker-compose.dev.yml up --build -d
```

The `docker-entrypoint.sh` script will automatically:

* Wait for the PostgreSQL database to be ready.
* Run all pending TypeORM migrations.
* Run all database seeds to populate the database with sample data.
* Start the NestJS application in development (watch) mode.

### Services

Once running, the following services will be available:

* NestJS API: http://localhost:3000 (or your `SERVER_PORT` from `.env`)
* API Docs (Swagger): http://localhost:3000/api
* MinIO (S3) Console: http://localhost:9001 (Login with `S3_ACCESS_KEY` and `S3_SECRET_KEY` from your `.env`)
* MailHog (Email UI): http://localhost:8025
* PostgreSQL: localhost:5433 (for external DB clients)
* Admin Reports: `http://localhost:3000/reports/pdf` and `http://localhost:3000/reports/excel` (Admin token required)

### Database (Migrations & Seeding)

The project uses TypeORM for database management. Scripts are available in `package.json`.

**Run Migrations:** (This runs automatically on Docker startup)

```
npm run migration:run
```

**Run Seeds:** (This runs automatically on Docker startup)

```
npm run seed:run
```

**Generate a New Migration:**

```
# Make your changes in the .entity.ts files
npm run migration:generate <YourMigrationName>
```

**Generate a New Seed:**

```
# Make your changes inside the generated file
npm run seed:create <YourSeedName>
```

**Revert a Migration:**

```
npm run migration:revert
```

## API Documentation

### Swagger

With the application running, you can access the interactive Swagger API documentation at:

http://localhost:3000/api

### Postman

A Postman collection ([Ngplus API.postman_collection.json](./Ngplus%20API.postman_collection.json)) is included in the root of this project for easy testing of all endpoints.
> **Note:** All IDs and settings are pre-filled, so the collection works out of the box. The only required step is to provide the **Bearer Token** obtained from the `auth/login` endpoint. You only need to change other fields if you want to test different operations.

## Environment Variables

The `.env` file is structured as follows:

| Variable | Description | Default |
|----------|-------------|---------|
| DATABASE_TYPE | TypeORM database type. | postgres |
| DATABASE_HOST | Database host. | 127.0.0.1 |
| DATABASE_PORT | Database port. | 5433 |
| DATABASE_USER | Database username. | postgres |
| DATABASE_PASSWORD | Database password. | examplePass |
| DATABASE_DB | Database name. | exampleDb |
| S3_ENDPOINT | S3 service endpoint. | localhost |
| S3_PORT | S3 service port. | 9000 |
| S3_ACCESS_KEY | S3 access key. | exampleLogin |
| S3_SECRET_KEY | S3 secret key. | examplePass |
| S3_BUCKET_NAME | S3 bucket name. | example-media |
| S3_USE_SSL | Use SSL for S3. | false |
| S3_PUBLIC_URL | Public base URL for S3 files. | http://localhost:9000 |
| JWT_ACCESS_TOKEN_SECRET | Secret for access tokens. | Example1 |
| JWT_ACCESS_TOKEN_EXPIRATION | Expiration time for access tokens. | 15m |
| JWT_REFRESH_TOKEN_SECRET | Secret for refresh tokens. | Example2 |
| JWT_REFRESH_TOKEN_EXPIRATION | Expiration time for refresh tokens. | 7d |
| JWT_PASSWORD_RESET_SECRET | Secret for password reset tokens. | Example3 |
| JWT_PASSWORD_RESET_EXPIRATION | Expiration time for password reset. | 15m |
| MAIL_HOST | SMTP host. | mailhog |
| MAIL_PORT | SMTP port. | 1025 |
| MAIL_USER | SMTP username. | mailhog |
| MAIL_PASS | SMTP password. | 123456789 |
| MAIL_FROM | Default "from" email address. | noreply@example.com |
| SERVER_PORT | Port for the NestJS API. | 3000 |
| DOCKER | Set to true inside Docker. | false |

## Project Board

### Known Bugs

| Issue | Notes |
|-------|-------|
| PostgreSQL fails locally | Only works with Docker unless `.env` port is updated. Needs multi-env support. |
| Race condition on decrement | Breaks if multiple requests are made simultaneously. |
| File uploader restrictions | Breaks with `.exe` and compressed files for games; should accept `.txt`, `.pdf`, `.docx` for text media. |

### Next Steps / Improvements

| Task | Notes |
|------|-------|
| Make a frontend | Build a UI for the API. |
| Add types | Define types for every const/return/etc. |
| Add Jest tests | Cover main features with unit tests. |
| Add observability | Grafana + more logs. |
| Performance tests | Spike/load testing. |
| Add IA MD file | Define code standards to auto-format code. |
| Change Swagger UI styles | Make it look better. |
| Reverify security measures | Audit current security. |
| Auto-delete media from bucket | When media is deleted from DB. |
| Add email queue | Send emails asynchronously instead of instantly. |
| Change recover password email | Use reset link instead of token in production. |
| Fix “not found” errors in prod | Avoid leaking info in recovery endpoint. |
| Add second upload endpoint | For user profile pictures. |
| Add verification to usernames | Validate allowed characters. |
| Separate upload/delete endpoints | Easier testing on dev; prod auto-upload on create media endpoint. |

