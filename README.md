# Restaurant Reservation Management System

A full-stack web application for managing restaurant table reservations with role-based access control for customers and administrators.

## 🚀 Live Demo

- **Frontend URL**: [To be deployed]
- **Backend URL**: [To be deployed]

## 📋 Features

### Customer Features
- User registration and authentication
- Create new reservations with real-time availability checking
- View personal reservations
- Cancel reservations
- See available time slots based on date and party size

### Admin Features
- View all reservations
- Filter reservations by date and status
- Cancel any reservation
- Manage restaurant tables (create, activate/deactivate, delete)
- Overview of bookings grouped by date

## 🛠️ Technology Stack

### Frontend
- **React** 18.2.0
- **React Router DOM** 6.20.0 for navigation
- **Axios** for API calls
- Inline CSS for styling (functional UI focused)

### Backend
- **Node.js** with **Express** 4.18.2
- **MongoDB** with **Mongoose** 8.0.0
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled
- **express-validator** for input validation

## 📁 Project Structure

```
restaurant-reservation-system/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── reservationController.js  # Reservation logic
│   │   └── tableController.js   # Table management logic
│   ├── middleware/
│   │   ├── auth.js             # JWT verification & role check
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/
│   │   ├── User.js             # User schema
│   │   ├── Table.js            # Table schema
│   │   └── Reservation.js      # Reservation schema
│   ├── routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── reservationRoutes.js # Reservation endpoints
│   │   └── tableRoutes.js      # Table endpoints
│   ├── utils/
│   │   └── seedTables.js       # Database seeding
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js               # Entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js       # Navigation component
    │   │   └── PrivateRoute.js # Route protection
    │   ├── context/
    │   │   └── AuthContext.js  # Auth state management
    │   ├── pages/
    │   │   ├── Home.js
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   ├── MyReservations.js
    │   │   ├── NewReservation.js
    │   │   ├── AdminReservations.js
    │   │   └── AdminTables.js
    │   ├── services/
    │   │   └── api.js          # API service layer
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .gitignore
    └── package.json
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd restaurant-reservation-system/backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
PORT=5000
MONGODB_URI=mongodb://localhost:27017/restaurant-reservation
JWT_SECRET=your_secure_jwt_secret_key_here
NODE_ENV=development
```

4. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd restaurant-reservation-system/frontend
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Create a `.env` file for custom API URL:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Initial Data

The backend automatically seeds 8 tables on startup if the database is empty:
- 2 tables with 2-person capacity
- 3 tables with 4-person capacity
- 2 tables with 6-person capacity
- 1 table with 8-person capacity

### Creating an Admin User

To create an admin user, register through the API or manually set the role in MongoDB:

**Using API (POST to `/api/auth/register`):**
```json
{
  "name": "Admin User",
  "email": "admin@restaurant.com",
  "password": "admin123",
  "role": "admin"
}
```

## 🔐 Role-Based Access Control

### Customer Role (`customer`)
- Default role for new registrations
- Can create, view, and cancel their own reservations
- Cannot access admin routes

### Admin Role (`admin`)
- Must be explicitly set during registration or in database
- Can view all reservations across all users
- Can cancel any reservation
- Can manage tables (CRUD operations)
- Cannot create reservations (admin-specific feature)

### Authentication Flow
1. User registers or logs in
2. Server generates JWT token containing user ID
3. Token stored in localStorage on client
4. Token sent with all authenticated requests via Authorization header
5. Backend middleware verifies token and checks role
6. Access granted or denied based on role requirements

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['customer', 'admin']),
  timestamps: true
}
```

### Table
```javascript
{
  tableNumber: Number (unique),
  capacity: Number,
  isActive: Boolean,
  timestamps: true
}
```

### Reservation
```javascript
{
  user: ObjectId (ref: User),
  table: ObjectId (ref: Table),
  date: Date,
  timeSlot: String (enum: predefined slots),
  numberOfGuests: Number,
  status: String (enum: ['pending', 'confirmed', 'cancelled']),
  customerName: String,
  customerEmail: String,
  timestamps: true
}
```

## 🔄 Reservation & Availability Logic

### Conflict Prevention
1. **Date Validation**: Cannot book past dates
2. **Table Capacity Check**: Number of guests must not exceed table capacity
3. **Double Booking Prevention**: 
   - Checks if table is already reserved for specific date + time slot
   - Only considers non-cancelled reservations
   - Returns 400 error if conflict exists

### Availability Algorithm
```javascript
function findAvailableTable(date, timeSlot, numberOfGuests) {
  1. Query all active tables with capacity >= numberOfGuests
  2. Sort by capacity (ascending) to optimize table usage
  3. For each table:
     - Check if already reserved for given date + timeSlot
     - If not reserved, return this table
  4. If no table available, return null
}
```

### Time Slots
The system uses predefined 2-hour time slots:
- 11:00-13:00
- 13:00-15:00
- 15:00-17:00
- 17:00-19:00
- 19:00-21:00
- 21:00-23:00

### Reservation Flow
1. Customer selects date and number of guests
2. System queries available slots for that date
3. For each time slot, finds an available table
4. Displays only slots where tables are available
5. Customer selects a slot and confirms
6. System double-checks availability before creating reservation
7. Reservation created with status 'confirmed'

## 🌐 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user (Protected)

### Reservations (`/api/reservations`)
- `POST /` - Create reservation (Protected)
- `GET /my-reservations` - Get user's reservations (Protected)
- `DELETE /:id` - Cancel reservation (Protected)
- `GET /available-slots` - Get available time slots (Protected)
- `GET /admin/all` - Get all reservations (Admin)
- `PUT /admin/:id` - Update reservation (Admin)

### Tables (`/api/tables`)
- `GET /` - Get all tables (Protected)
- `POST /` - Create table (Admin)
- `PUT /:id` - Update table (Admin)
- `DELETE /:id` - Delete table (Admin)

## ⚠️ Known Limitations

1. **Time Slots**: Fixed 2-hour slots, no custom duration
2. **Single Restaurant**: System designed for one restaurant only
3. **No Email Notifications**: Confirmation emails not implemented
4. **No Payment Integration**: No payment processing
5. **Basic UI**: Functional but minimal styling
6. **No Real-time Updates**: Manual refresh required to see changes
7. **Table Assignment**: Automatic assignment based on capacity, cannot manually choose specific table number
8. **No Waitlist**: If fully booked, customers cannot join a waitlist
9. **Date Range**: No limit on how far in advance bookings can be made

## 🎯 Areas for Improvement

### With Additional Time
1. **Email Notifications**
   - Confirmation emails on booking
   - Reminder emails before reservation
   - Cancellation notifications

2. **Enhanced UI/UX**
   - Material-UI or Tailwind CSS integration
   - Loading skeletons
   - Toast notifications
   - Responsive design improvements

3. **Advanced Features**
   - Real-time updates using WebSockets
   - Table layout visualization
   - Customer preferences and notes
   - Recurring reservations
   - Waitlist management
   - SMS notifications

4. **Analytics Dashboard**
   - Booking trends
   - Popular time slots
   - Table utilization rates
   - Customer insights

5. **Search & Filters**
   - Search reservations by customer name
   - Advanced filtering options
   - Export to CSV/PDF

6. **Better Error Handling**
   - More granular error messages
   - Retry mechanisms
   - Offline support

7. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

8. **Security Enhancements**
   - Rate limiting
   - Input sanitization
   - HTTPS enforcement
   - Refresh tokens

9. **Performance**
   - Caching (Redis)
   - Database indexing optimization
   - Lazy loading
   - Pagination for large datasets

10. **Multi-restaurant Support**
    - Support multiple restaurant locations
    - Restaurant-specific configurations

## 📝 Assumptions Made

1. **Business Hours**: Restaurant operates from 11:00 AM to 11:00 PM
2. **Time Slots**: All time slots are 2 hours long
3. **Same-day Bookings**: Allowed without time restrictions
4. **Cancellation Policy**: Customers can cancel anytime without penalty
5. **Table Types**: All tables are equivalent except for capacity
6. **Seating Policy**: Party size must not exceed table capacity (no combining tables)
7. **Admin Management**: Tables can be managed while reservations exist
8. **Authentication**: Token expires after 30 days
9. **Timezone**: All times in server's local timezone
10. **Guest Count**: Minimum 1, maximum 10 guests per reservation

## 🚀 Deployment Guide

### Backend Deployment (e.g., Render, Railway)
1. Push code to GitHub
2. Create new Web Service
3. Set environment variables (MONGODB_URI, JWT_SECRET, NODE_ENV=production)
4. Set build command: `npm install`
5. Set start command: `npm start`
6. Deploy

### Frontend Deployment (e.g., Vercel, Netlify)
1. Push code to GitHub
2. Create new project
3. Set build command: `npm run build`
4. Set publish directory: `build`
5. Set environment variable: `REACT_APP_API_URL=<your-backend-url>`
6. Deploy

### MongoDB Atlas Setup
1. Create free cluster at mongodb.com/cloud/atlas
2. Add database user
3. Whitelist IP (0.0.0.0/0 for development)
4. Get connection string
5. Update MONGODB_URI in backend environment

## 👤 Test Credentials

After deployment, create these users for testing:

**Customer Account:**
- Email: customer@test.com
- Password: customer123

**Admin Account:**
- Email: admin@test.com
- Password: admin123

## 📄 License

This project is created as an assignment and is open for review.

## 🤝 Support

For issues or questions, please create an issue in the repository.
