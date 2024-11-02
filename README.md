<p>&nbsp;</p>
<h1 align="center">📣 Marketplace API</h1>
<p>&nbsp;</p>

## 📖 Description

A RESTful API for managing an online marketplace, built with Node.js and Prisma ORM. This API provides functionality to handle product listings, user authentication, orders, and more.

## 💡 Features

- **User Authentication**: Register, login,  and manage sessions.
- **User Information handler**: Update user informations.
- **Advertisement Management**: Create, update, delete, and view advertisements.
- **Database Integration**: Built using Prisma ORM for database management.

## 🔨 Tools

- **Node.js**: JavaScript runtime for server-side logic.
- **Express**: Framework for building the API.
- **PostgreSQL**: Relational database for data persistence.
- **Prisma**: ORM for database schema and queries.

## ⚙️ Setup

### Prerequisites

- Node.js
- PostgreSQL

### Installation

- **Clone the repository:**

   ```bash
   git clone https://github.com/Jaoovit/marketplace-api.git

   cd marketplace-api
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