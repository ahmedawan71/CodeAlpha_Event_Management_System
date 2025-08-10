# Event Registration System

A full-stack web application for managing events and user registrations built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Event Management**: View available events with details and dates
- **Registration System**: Register for events and manage registrations
- **User Dashboard**: View and cancel personal registrations
- **Responsive UI**: Clean, modern interface with loading states and error handling
- **RESTful API**: Well-structured backend with proper error handling

## 🛠️ Tech Stack

### Frontend
- **React** 18.2.0 - UI library
- **Axios** - HTTP client for API requests
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm**
- **MongoDB** (v4.4 or higher)

### MongoDB Installation

**Windows:**
Download and install from [MongoDB Official Website](https://www.mongodb.com/try/download/community), use Atlas cloud and MongoDB Compass

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd event-registration-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGO_URI=mongodb://localhost:27017/event-registration  # or atlas url
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Database Seeding

Populate the database with sample data:
```bash
cd ../backend
npm run seed
```

This creates:
- Test user: `user@gmail.com` / `123`
- 4 sample events

## 🏃‍♂️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
Frontend runs on: `http://localhost:3000`

### Production Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
```

## 📁 Project Structure

```
event-registration-system/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   ├── Event.js              # Event schema
│   │   ├── Registration.js       # Registration schema
│   │   └── User.js               # User schema
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── events.js             # Event & registration routes
│   ├── .env                      # Environment variables
│   ├── package.json              # Backend dependencies
│   ├── seedData.js               # Database seeding script
│   └── server.js                 # Express server setup
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.js                # Main React component
│   │   └── index.js              # React entry point
│   └── package.json              # Frontend dependencies
└── README.md                     # Project documentation
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event by ID
- `POST /api/events/:eventId/register` - Register for event (auth required)
- `GET /api/events/registrations/my` - Get user registrations (auth required)
- `DELETE /api/events/registrations/:registrationId` - Cancel registration (auth required)

## 🎯 Usage

### For Users
1. **Login**: Use `user@gmail.com` / `123` 
2. **Browse Events**: View available events on the main page
3. **Register**: Click "Register" on any event to sign up
4. **Manage**: View and cancel registrations in "My Registrations" section

### Sample User Credentials
- **Email**: `user@gmail.com`
- **Password**: `123`

## 🚀 Future Enhancements

- [ ] Admin panel for event management
- [ ] Email notifications for registrations
- [ ] Event capacity limits
- [ ] Event categories and filtering
- [ ] User profiles and preferences
- [ ] Event search functionality
- [ ] Payment integration
- [ ] Calendar integration
- [ ] Social media sharing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

**Built by Muhammad Ahmed**