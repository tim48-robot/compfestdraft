import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './Likes.jsx';

const PostCard = ({ post }) => {
  // Handle case when post is undefined (for example, during initial render)
  if (!post) {
    return (
      <div className="bg-white shadow-md rounded-lg p-4 mb-4">
        <p className="text-gray-500">Loading post...</p>
      </div>
    );
  }



  const handleHapus = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error("You must be logged in to delete posts");
      }
      
      const response = await fetch(`http://localhost:5000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
      
      window.location.reload();
      
    }
    catch (error) {
      console.log(error);
      alert("Error deleting post: " + error.message);
    }
  };



  // Format date if exists
  const formattedDate = post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown date';
  
  // Get author info if exists
  const authorName = post.author ? post.author.username : 'Unknown user';

  // diedit pada ... 
  const editedDate = post.updatedAt ? new Date (post.updatedAt).toLocaleString() : "";
    
    return (
      <div className="bg-white shadow-md justify-between rounded-lg p-4 mb-7">
      <div className="flex justify-between items-center">
        <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
        <div className="flex space-x-4">
          <Link
            to={`/edit-post/${post.id}`}
            className="text-blue-500 hover:text-blue-700 inline-flex items-center px-2 py-1"
          >
            Edit
          </Link>
          <button onClick = {handleHapus} className="text-red-500 hover:text-red-700 inline-flex items-center px-2 py-1">Hapus</button>
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-500 mb-8">
          <span>@{authorName}</span>
          <span>{formattedDate}</span>
          <span>edited: {editedDate}</span>
      </div>


      <div className="mt-4 flex space-x-2">
        <LikeButton/>
      </div>

    </div>
  );
};

export default PostCard;