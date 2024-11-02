<p>&nbsp;</p>
<h1 align="center">🗂️ File-uploader</h1>
<p>&nbsp;</p>

## 📖 Description

This application provides a user-friendly interface for uploading files directly to the cloud. It manages user sessions and file operations, making it suitable for projects requiring robust file handling capabilities.

## 💡 Features

- **File Upload**: Securely upload files to Cloudinary.
- **File Management**: Organize, retrieve and share uploaded files easily.
- **User Authentication**: Manage user sessions for secure access.
- **Database Integration**: Utilize Prisma ORM for efficient database interactions.

## 🔨 Tools

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Framework for building the API.
- **PostgreSQL**: Relational database for data persistence.
- **Prisma**: ORM for database schema and queries.
- **Cloudinary**: Service for file storage and management.

## ⚙️ Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

- **Clone the repository:**

   ```bash
   git clone https://github.com/Jaoovit/file-uploader.git

   cd file-uploader
1. Update the name of the .env_template to .env

2. Define .env variables:

    - Database URL to config Prisma after DATABASE_URL=

    - Port to run the application after PORT=

    - Secret to config session after SECRET=

    - Secret to config JWT after JWT_SECRET=

3. Create a account in cloudinary https://cloudinary.com

4. Add environment cloudinary variables in .env:

    - CLOUDINARY_CLOUD_NAME=
    - CLOUDINARY_API_KEY=
    - CLOUDINARY_API_SECRET=

## 🏃‍➡️ Start

- **Run commands:**

    ```bash
    npm install

    npx prisma migrate dev --name init

    npm run start