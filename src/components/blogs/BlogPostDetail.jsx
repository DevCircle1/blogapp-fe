import { useState, useEffect } from 'react';
import { privateRequest } from '../../services/api';
import { useParams, Link } from 'react-router-dom';

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        const response = await privateRequest.get(`/posts/${id}/`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // Function to render HTML content safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-500 text-lg text-center">{error}</div>
        <div className="text-center mt-4">
          <Link to="/posts" className="text-blue-500 hover:underline">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Post not found</div>
        <div className="text-center mt-4">
          <Link to="/posts" className="text-blue-500 hover:underline">
            Back to all posts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link 
        to="/posts" 
        className="inline-flex items-center text-blue-500 hover:underline mb-6"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to all posts
      </Link>

      <article className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Featured Image */}
        {post.featured_image && (
          <div className="h-64 overflow-hidden">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
            <div className="flex items-center text-gray-600">
              <span className="mr-4">By {post.author?.name || 'Unknown'}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </header>
          
          {/* Content with HTML rendering */}
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={renderHTML(post.content)}
          />
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;