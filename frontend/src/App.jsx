import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import PostForm from './PostForm.jsx';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Navbar from './Navbar.jsx';
import PostDetail from './PostDetail.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/create-post" element={<PostForm />} />
            <Route path="/edit-post/:id" element={<PostForm />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;