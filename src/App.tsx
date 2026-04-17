import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import OTPPage from './pages/OTPPage';
import SuccessPage from './pages/SuccessPage';
import StudentsListPage from './pages/StudentsListPage';
import StudentCreatePage from './pages/StudentCreatePage';
import EditStudentPage from './pages/EditStudentPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignInPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/dashboard" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<StudentsListPage />} />
        <Route path="/create-student" element={<StudentCreatePage />} />
        <Route path="/edit-student/:studentId" element={<EditStudentPage />} />
      </Routes>
    </Router>
  );
}

export default App;
