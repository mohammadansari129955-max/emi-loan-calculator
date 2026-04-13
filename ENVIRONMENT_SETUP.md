# EMI Loan Calculator - Environment Setup

## Environment Variables Configuration

### Backend (.env file)
```
# EMI Loan Calculator - Backend Environment Variables
# MongoDB Connection String
MONGO_URI=mongodb://127.0.0.1:27017/emiDB

# Server Port
PORT=5000

# JWT Secret (for future authentication enhancement)
JWT_SECRET=emi_calculator_secret_key_2024

# Environment
NODE_ENV=development
```

### Frontend (.env file)
```
# EMI Loan Calculator - Frontend Environment Variables
# API Base URL
REACT_APP_API_URL=http://localhost:5000

# Environment
REACT_APP_ENV=development
```

## Project Structure
- **Backend**: Express.js server with MongoDB integration
- **Frontend**: React.js application with animated UI
- **Database**: MongoDB with user authentication and EMI calculations

## Key Features
- User registration and login with encrypted passwords
- EMI loan calculation functionality
- Responsive animated UI design
- Full-stack architecture with REST API

## Technologies Used
- React 19 (Frontend)
- Express.js (Backend)
- MongoDB (Database)
- bcryptjs (Password encryption)
- CORS (Cross-origin requests)
- dotenv (Environment configuration)