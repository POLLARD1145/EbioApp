# Web Management Interface

## Overview

This is a secure web management interface for blockchain transaction management and authentication.

## Features

- Secure User Authentication
- Transaction Approval Workflow
- Role-based Access Control
- Responsive Design

## Prerequisites

- Node.js (v14+)
- npm (v6+)

## Installation

1. Clone the repository

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables
   Create a `.env` file in the root directory with:

```
REACT_APP_API_BASE_URL=https://your-api-endpoint.com
REACT_APP_ENCRYPTION_KEY=your-secret-encryption-key
```

## Available Scripts

- `npm start`: Run the app in development mode
- `npm run build`: Build for production
- `npm test`: Run test suite

## Security Features

- JWT-based Authentication
- Request Signing
- Data Encryption
- Secure Token Management

## Technologies Used

- React
- Ant Design
- Axios
- React Router
- Crypto-JS

## Deployment

1. Build the application

```bash
npm run build
```

2. Deploy the contents of the `build` folder to your hosting platform

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License.
