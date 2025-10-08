import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MessageCircle, Share2, Clock, Users } from 'lucide-react';
import { toast } from 'react-toastify';
import { publicRequest } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const Q = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await publicRequest.get('/questions/');
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to load questions:', error);
      toast.error('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (questionId) => {
    const url = `${window.location.origin}/q/${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* ===== Hero Section ===== */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">
          Ask Anything,<br />Get Honest Answers
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Create anonymous Q&A pages and share them with anyone. Get honest feedback without knowing who replied.
        </p>

        {user ? (
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-primary-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Ask a Question</span>
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600">Sign up to start asking questions</p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-primary-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Get Started Free</span>
            </Link>
          </div>
        )}
      </div>

      {/* ===== Features Section ===== */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 text-center">
          <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="h-6 w-6 text-primary-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Anonymous Answers</h3>
          <p className="text-gray-600 text-sm">Get honest feedback without identity concerns</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 text-center">
          <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Share2 className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Easy Sharing</h3>
          <p className="text-gray-600 text-sm">Share your question link with anyone, anywhere</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Users className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No Signup Required</h3>
          <p className="text-gray-600 text-sm">Anyone can answer without creating an account</p>
        </div>
      </div>

      {/* ===== Recent Questions ===== */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>

        {questions.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No questions yet. Be the first to ask!</p>
          </div>
        ) : (
          questions.map((question) => (
            <div
              key={question.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-primary-300 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex justify-between items-start mb-4">
                <Link
                  to={`/q/${question.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors flex-1 pr-4"
                >
                  {question.content}
                </Link>
                <button
                  onClick={() => copyToClipboard(question.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                  title="Copy share link"
                >
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{question.answer_count} answers</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(question.created_at).toLocaleDateString()}</span>
                  </span>
                </div>
                <span className="text-primary-600 font-medium">
                  By {question.user_email}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Q;