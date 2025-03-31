import React from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard.jsx';

const HomePage = () => {
  const [posts, setPosts] = React.useState([]);
  React.useEffect(() => {
    // Fetch posts from the backend API
    fetch('/api/posts')
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);



  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Postingan</h1>
        <Link 
          to="/create-post" 
          className="text-black font-bold px-4 py-2 rounded hover:text-amber-200"
        >
          Buat Postingan Baru
        </Link>
      </div>


      {posts.map(post => (
        <PostCard key={post.id} post={post}/>
      ))}
      <PostCard />
      <PostCard />
      <PostCard />
    </div>
  );
};

export default HomePage;