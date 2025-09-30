import { useState, useEffect } from 'react';
import { publicRequest } from '../../services/api';
import { Link, useParams, useLocation } from 'react-router-dom';

const CategoryBlogPosts = () => {
  const [posts, setPosts] = useState([]);
  const [category, setCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ We now always use slug (from URL)
  const { categorySlug } = useParams();
  const location = useLocation();
  const categoryName = location.state?.categoryName;

  useEffect(() => {
    const fetchCategoryPosts = async () => {
      try {
        setIsLoading(true);

        // ✅ Fetch by slug
        const response = await publicRequest.get(`/all-categories/${categorySlug}/`);
        const categoryData = response.data;

        setCategory(categoryData);

        // ✅ Only approved posts
        const approvedPosts = categoryData.articles.filter(
          (post) => post.status === 'approved'
        );
        setPosts(approvedPosts);
      } catch (err) {
        setError('Failed to fetch category posts');
        console.error('Error fetching category posts:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryPosts();
  }, [categorySlug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                to="/blogs"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Categories
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">
                {category?.name || categoryName || 'Category'}
              </h1>
              <p className="text-gray-600 mt-2">
                {posts.length} {posts.length === 1 ? 'article' : 'articles'} in this category
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="container mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No articles yet</h3>
            <p className="text-gray-500 mb-6">There are no published articles in this category.</p>
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blogs/article/${post.slug}`}   // ✅ still slug for posts
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-gray-100"
              >
                {/* Featured Image */}
                <div className="h-48 overflow-hidden relative">
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
                  <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-sm font-semibold text-gray-700">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 text-gray-800 hover:text-blue-600 transition-colors duration-300">
                    {post.title}
                  </h2>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Published
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-semibold text-sm">Read More</span>
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryBlogPosts;
