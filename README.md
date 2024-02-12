# Todo App Backend

This backend service is built using Node.js and Express for a todo application. It provides API endpoints for user authentication, managing todos, and accessing user-related information.

## Features

- User registration
- User login and logout
- User authentication using JWT
- Todo creation, updating, deletion, and retrieval
- Retrieving all todos of a user
- Unit and integration testing for services and routes

## Deployment

The backend is deployed on [https://todo-obi.onrender.com](https://todo-obi.onrender.com).

## API Routes

### Users

- `POST /api/v1/users/register`: Register a new user
- `POST /api/v1/users/login`: Login with existing credentials
- `GET /api/v1/users/logout`: Logout the current user
- `GET /api/v1/users/user`: Get information about the currently logged-in user

### Todos

- `POST /api/v1/todos`: Create a new todo
- `GET /api/v1/todos`: Get all todos of the current user
- `GET /api/v1/todos/:id`: Get a specific todo by ID
- `PATCH /api/v1/todos/:id`: Update a specific todo by ID
- `DELETE /api/v1/todos/:id`: Delete a specific todo by ID

## Authentication

Authentication is implemented using JWT. To access todo-related routes, users need to be authenticated by including a valid JWT token in the request headers.

## Testing

Unit and integration tests are written for services and routes to ensure the reliability of the backend.

## Technologies Used

- Node.js
- Express
- JWT for authentication
- Mongoose for MongoDB object modeling
- Jest for testing

## Installation

1. Clone the repository: `git clone https://github.com/your/repo.git`
2. Install dependencies: `npm install`
3. Configure environment variables (e.g., database connection string, JWT secret)
4. Start the server: `npm start`

## Contributing

Contributions are welcome! If you find any bugs or have suggestions for improvement, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
