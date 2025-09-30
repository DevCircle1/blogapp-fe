import { useState, useEffect } from 'react';
import { publicRequest } from '../../services/api';
import { Link } from 'react-router-dom';

const BlogCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await publicRequest.get('/all-categories/');
        setCategories(response.data);
      } catch (err) {
        setError('Failed to fetch categories');
        console.error('Error fetching categories:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Blog Categories</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore our collection of articles organized by topics
          </p>
        </div>

        {/* Categories Grid */}
        {categories.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <div className="text-6xl mb-4">📝</div>
            <p className="text-xl">No categories available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link
                key={category.slug}   // ✅ use slug
                to={`/blogs/category/${category.slug}`}   // ✅ slug instead of id
                state={{ categoryName: category.name }}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden h-full flex flex-col">
                  {/* Category Header */}
                  <div className="p-6 flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded-full">
                          {category.total_articles} {category.total_articles === 1 ? 'article' : 'articles'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Approved Articles Count */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {category.articles.filter(article => article.status === 'approved').length} published
                      </span>
                    </div>

                    {/* Recent Articles Preview */}
                    <div className="space-y-2">
                      {category.articles
                        .filter(article => article.status === 'approved')
                        .slice(0, 2)
                        .map((article) => (
                          <div key={article.slug} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300">
                            {article.featured_image ? (
                              <img 
                                src={article.featured_image} 
                                alt={article.title}
                                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-200 to-indigo-200 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9m0 0v12" />
                                </svg>
                              </div>
                            )}
                            <span className="text-sm text-gray-700 truncate flex-1">{article.title}</span>
                          </div>
                        ))}
                    </div>

                    {category.articles.filter(article => article.status === 'approved').length > 2 && (
                      <div className="text-center mt-3">
                        <span className="text-blue-600 text-sm font-medium">
                          +{category.articles.filter(article => article.status === 'approved').length - 2} more
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors duration-300">
                        View all articles
                      </span>
                      <svg className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
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

export default BlogCategories;
