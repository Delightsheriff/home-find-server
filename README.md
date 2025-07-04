# Home-Finder API

A server-side application to manage property listings and user accounts. It provides RESTful APIs for user authentication, property management, and user profile updates.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Security](#security)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Authentication**: Secure user registration, login, email verification, password reset (implied), and session management (JWT).
- **User Profile Management**: Allows users to update their profile information and profile picture.
- **Property Management**: Enables creating, reading, updating, and deleting property listings.
- **Secure File Uploads**: Handles file uploads (e.g., property images, user avatars) potentially to cloud storage (Azure Blob Storage).
- **Role-Based Access Control (Implied)**: Differentiates between regular users and admins (e.g., `assignAdmin.ts` utility).
- **Security Focused**: Implements various security measures like Helmet, CORS, input sanitization, HPP, and rate limiting.
- **Email Notifications**: Sends emails for actions like email verification.

## Tech Stack

- **Backend Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT)
- **File Storage**: Azure Blob Storage (for uploads via `multer` and `@azure/storage-blob`)
- **Email Service**: Nodemailer
- **Security Libraries**:
  - `helmet`: For setting various HTTP headers to secure the app.
  - `cors`: For enabling Cross-Origin Resource Sharing.
  - `express-mongo-sanitize`: For sanitizing user-supplied data to prevent MongoDB operator injection.
  - `hpp`: For protecting against HTTP Parameter Pollution attacks.
  - `express-rate-limit`: For limiting repeated requests to public APIs and/or endpoints.
  - `bcrypt`: For password hashing.
- **Other Key Libraries**:
  - `dotenv`: For loading environment variables.
  - `morgan`: HTTP request logger middleware.
  - `sharp`: For image processing.
  - `validator`: For string validation.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js) or [Yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community): A running MongoDB instance (local or cloud-hosted).
- [Azure Storage Account](https://azure.microsoft.com/en-us/services/storage/blobs/): If you plan to use the file upload functionality, you'll need an Azure Blob Storage account and its connection string.

## Getting Started

### Installation

1.  **Clone the repository:**
    Replace `your-repository-url` with the actual URL of this repository.
    ```bash
    git clone your-repository-url
    cd my-app-server # Or your project's root folder name
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

### Environment Variables

This project uses environment variables for configuration. Create a `.env` file in the root of the project and add the following variables. You can use the `.env.example` file as a template if one is provided (if not, create the `.env` file manually).

```env
# Application Configuration
APP_NAME=HomeFinderAPI
PORT=2024
NODE_ENV=development # or 'production'
CLIENT_URL=http://localhost:3000 # Your frontend client URL

# Database Configuration
DB_URL=mongodb://localhost:27017/homefinder # Your MongoDB connection string

# Email Configuration (e.g., for Nodemailer with Gmail)
USER=your_email@example.com
PASSWORD=your_email_password_or_app_password

# JWT Configuration
REFRESH_JWT_KEY=your_very_strong_refresh_secret_key
ACCESS_JWT_KEY=your_very_strong_access_secret_key
REFRESH_JWT_EXPIRES_IN=7d
ACCESS_JWT_EXPIRES_IN=15m

# Azure Storage Configuration (for file uploads)
AZURE_CONTAINER_NAME=your_azure_container_name
AZURE_STORAGE_CONNECTION_STRING="your_azure_storage_connection_string"

# Paystack Configuration (if used, otherwise can be omitted)
PAYSTACK_SECRET_KEY=your_paystack_secret_key
```

**Note:**
*   Replace placeholder values with your actual configuration details.
*   For `USER` and `PASSWORD` under Email Configuration, if using Gmail, you might need to use an "App Password" if 2-Step Verification is enabled.
*   `PAYSTACK_SECRET_KEY` is listed in the environment configuration but its usage is not immediately obvious from the current file structure. Include it if you know it's being used.

## Running the Application

Once the dependencies are installed and the environment variables are set up, you can run the application using the following scripts from `package.json`:

1.  **Development Mode:**
    This command uses `nodemon` to automatically restart the server on file changes.
    ```bash
    npm run dev
    ```
    The server will typically start on the port specified in your `.env` file (default is `2024`).

2.  **Production Mode:**
    First, build the TypeScript code:
    ```bash
    npm run build
    ```
    This will compile the TypeScript files into JavaScript in the `dist` directory.
    Then, serve the built application:
    ```bash
    npm run serve
    ```
    The application will be served from the `dist` directory.

The API will be accessible at `http://localhost:<PORT>/api/v1` (e.g., `http://localhost:2024/api/v1` if using the default port).

## API Endpoints

The API provides the following main groups of endpoints:

*   **Authentication (`/api/v1/auth`)**:
    *   `POST /register`: User registration.
    *   `POST /login`: User login.
    *   `GET /verify-email`: Email verification.
    *   `POST /resend-verification-email`: Resend verification email.
    *   `GET /refresh-token`: Refresh JWT access token.
    *   `GET /signout`: User signout.
    *   `GET /success`: A success redirect or message page, likely for OAuth or email verification flows.

*   **User Management (`/api/v1/user`)**:
    *   `PATCH /update-user`: Update user details.
    *   `PATCH /update-photo`: Update user's profile photo.

*   **Property Management (`/api/v1/property`)**:
    *   `POST /`: Create a new property listing.
    *   `GET /`: Get all property listings (likely with pagination/filtering).
    *   `GET /my-properties`: Get properties listed by the authenticated user.
    *   `GET /:propertyId`: Get a specific property by its ID.
    *   `PATCH /:propertyId`: Update a specific property.
    *   `DELETE /:propertyId`: Delete a specific property.

A welcome message is available at `GET /api/v1`.

For detailed information on request/response formats and parameters, it's recommended to use a tool like Postman or refer to the route definitions in the `src/routes/` directory. Consider generating API documentation (e.g., using Swagger/OpenAPI) for a more comprehensive overview.

## Security

This application implements several security measures to protect against common web vulnerabilities:

-   **Helmet**: Sets various HTTP headers to secure the Express app (e.g., `X-Content-Type-Options`, `Strict-Transport-Security`, `X-Frame-Options`, `X-XSS-Protection`).
-   **CORS (Cross-Origin Resource Sharing)**: Configured to allow requests only from specified origins (e.g., `http://localhost:3000` in development).
-   **Mongo Sanitize**: Protects against MongoDB operator injection by stripping out keys starting with `$` or containing `.`.
-   **HPP (HTTP Parameter Pollution)**: Protects against HTTP Parameter Pollution attacks.
-   **Rate Limiting**: Limits the number of requests an IP address can make to the API within a certain time window to prevent abuse.
-   **Password Hashing**: User passwords are hashed using `bcrypt` before being stored in the database.
-   **JWT (JSON Web Tokens)**: Used for securing API endpoints and managing user sessions. Access tokens are short-lived, and refresh tokens are used to obtain new access tokens.
-   **Input Validation**: While not explicitly listed as a single middleware, the use of `validator` and custom validation logic (e.g., `validateProperty.ts`) is implied for various inputs.

It's crucial to keep dependencies updated and follow security best practices during development and deployment.

## Configuration

The application is configured primarily through environment variables, as detailed in the [Environment Variables](#environment-variables) section.

Key configuration points managed via `.env` file:

-   **Application Settings**:
    -   `APP_NAME`: Name of the application.
    -   `PORT`: Port on which the server runs.
    -   `NODE_ENV`: Application environment (`development`, `production`, etc.).
    -   `CLIENT_URL`: The base URL of the client application that consumes this API (used for CORS, redirects, email links).

-   **Database**:
    -   `DB_URL`: Connection string for the MongoDB database.

-   **Email Service (Nodemailer)**:
    -   `USER`: Email address used for sending emails.
    -   `PASSWORD`: Password or app-specific password for the email account.

-   **JSON Web Tokens (JWT)**:
    -   `REFRESH_JWT_KEY`: Secret key for signing refresh tokens.
    -   `ACCESS_JWT_KEY`: Secret key for signing access tokens.
    -   `REFRESH_JWT_EXPIRES_IN`: Expiration time for refresh tokens (e.g., `7d`).
    -   `ACCESS_JWT_EXPIRES_IN`: Expiration time for access tokens (e.g., `15m`).

-   **Azure Blob Storage**:
    -   `AZURE_CONTAINER_NAME`: Name of the Azure Blob Storage container.
    -   `AZURE_STORAGE_CONNECTION_STRING`: Connection string for Azure Storage.

-   **Paystack (Payment Gateway)**:
    -   `PAYSTACK_SECRET_KEY`: Secret key for Paystack API integration (if applicable).

Refer to `src/common/config/environment.ts` for how these variables are consumed within the application.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these general guidelines:

1.  **Fork the repository.**
2.  **Create a new branch** for your feature or bug fix:
    ```bash
    git checkout -b feature/your-feature-name
    ```
    or
    ```bash
    git checkout -b fix/issue-number
    ```
3.  **Make your changes.** Ensure your code follows the existing style and conventions.
4.  **Test your changes thoroughly.**
5.  **Commit your changes** with a clear and descriptive commit message:
    ```bash
    git commit -m "feat: Implement X feature" -m "Detailed description of changes."
    ```
    (Consider using [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.)
6.  **Push your branch** to your forked repository:
    ```bash
    git push origin feature/your-feature-name
    ```
7.  **Open a Pull Request (PR)** against the `main` branch of the original repository.
    - Provide a clear title and description for your PR, explaining the changes and the problem they solve.
    - Link any relevant issues.

Please ensure your code lints and tests pass before submitting a PR. If you're planning a large change, it's a good idea to open an issue first to discuss it.

## License

This project is licensed under the **ISC License**. See the `LICENSE` file for more details (if one exists in the repository, otherwise, this implies the standard ISC License text).

From `package.json`:
```json
"license": "ISC",
```
