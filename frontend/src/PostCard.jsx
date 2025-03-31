import React from 'react';

const PostCard = ({post}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{post.title}</h2>
      <p className="text-gray-700 mb-2">{post.content}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>@{post.username}</span>
        <span>{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      <div className="mt-4 flex space-x-2">
        <button className="text-blue-500 hover:text-blue-700">Edit</button>
        <button className="text-red-500 hover:text-red-700">Hapus</button>
      </div>
    </div>
  );
};

export default PostCard;