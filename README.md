# Video Tube Website Backend (JavaScript)

Welcome to the backend documentation of our Video Tube Website! This README file will guide you through the various components and functionalities of our backend system.

## Introduction

Our Video Tube Website backend, written in JavaScript, serves as the backbone of the platform. It handles user authentication, video management, data storage, and interaction between the frontend and the database.

## Technologies Used

- **Runtime Environment**: Node.js
- **Web Framework**: Express.js
- **Database**: MongoDB
- **Cloud Storage**: Amazon S3
- **Authentication**: JSON Web Tokens (JWT)


## Setup Instructions

To set up the backend of our Video Tube Website locally, follow these steps:

1. **Clone the Repository**: 
    ```bash
    git clone <repository-url>
    cd video-tube-backend
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    - Create a `.env` file in the root directory.
    - Define the following variables:
        ```
        PORT=8000
        DATABASE_URI=<your-mongodb-uri>
        ACCESS_TOKEN_SECRET=<your access-token-secret>
        REFRESH_TOKEN_SECRET=<your refresh-token-secret>
      
        ```

4. **Database Setup**:
    - Set up a MongoDB database and update the `DATABASE_URI` in the `.env` file with your database URI.

5. **Start the Development Server**:
    ```bash
    npm dev
    ```

## Features

### User Authentication

- Users can sign up, log in, and log out securely.
- Authentication tokens are generated using JWT for secure API authentication.

### Video Management

- Admins can upload videos, providing details such as title, description, and tags.
- Uploaded videos are stored in Amazon S3 for efficient and scalable storage.
- Videos can be searched and filtered based on various criteria.

### Interaction

- Users can like, comment on, and share videos.
- A notification system informs users about new likes, comments, and followers.(Notification system is been working on soon this feature will be added)

### Administration

- Admins have access to an admin dashboard for managing users, videos, and other site content.

## Deployment

Our backend system can be deployed to production using platforms like Cloudinary or any other cloud service provider. Ensure to set up environment variables specific to your production environment and configure the necessary services such as database, cloud storage, and message broker.

## Contributor

- Md Rayyan<ansarirayyan874@gmail.com>

---

Thank you for exploring the backend documentation of our Video Tube Website. For any further assistance or inquiries, please contact our development team.
