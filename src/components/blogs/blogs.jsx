import { useState, useEffect } from 'react';
import { privateRequest } from '../../services/api';

const BlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const response = await privateRequest.get('/posts/');
        setPosts(response.data);
      } catch (err) {
        setError('Failed to fetch blog posts');
        console.error('Error fetching posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const openPost = (post) => {
    setSelectedPost(post);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Blog Posts</h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-500">No blog posts found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-xl"
              onClick={() => openPost(post)}
            >
              {/* Featured Image */}
              <div className="h-48 overflow-hidden">
                {post.featured_image ? (
                  <img 
                    src={post.featured_image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-50 to-indigo-50 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Card Content */}
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-800">{post.title}</h2>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {post.author?.name || 'Unknown'}</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for full post view */}
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={closePost}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-screen overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white p-5 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">{selectedPost.title}</h2>
              <button 
                onClick={closePost}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Featured Image in Modal */}
            {selectedPost.featured_image && (
              <div className="h-64 overflow-hidden">
                <img 
                  src={selectedPost.featured_image} 
                  alt={selectedPost.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center text-gray-600 mb-4">
                <span className="mr-4 font-medium">By {selectedPost.author?.name || selectedPost.author?.username || 'Unknown'}</span>
                <span>{new Date(selectedPost.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="prose max-w-none text-gray-700">
                <p>{selectedPost.content}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPosts;