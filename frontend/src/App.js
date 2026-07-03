import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import MyReservations from './pages/MyReservations';
import NewReservation from './pages/NewReservation';
import AdminReservations from './pages/AdminReservations';
import AdminTables from './pages/AdminTables';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={styles.app}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Customer Routes */}
            <Route
              path="/reservations"
              element={
                <PrivateRoute>
                  <MyReservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/new-reservation"
              element={
                <PrivateRoute>
                  <NewReservation />
                </PrivateRoute>
              }
            />
            
            {/* Admin Routes */}
            <Route
              path="/admin/reservations"
              element={
                <PrivateRoute adminOnly>
                  <AdminReservations />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/tables"
              element={
                <PrivateRoute adminOnly>
                  <AdminTables />
                </PrivateRoute>
              }
            />
            
            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  }
};

export default App;
