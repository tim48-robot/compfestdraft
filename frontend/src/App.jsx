import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import PostForm from './PostForm.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create-post" element={<PostForm />} />
        <Route path="/edit-post/:id" element={<PostForm />} />
      </Routes>
    </Router>
  );
}


export default App;