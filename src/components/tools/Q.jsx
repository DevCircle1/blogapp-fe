import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MessageCircle, Share2, Clock, Users } from "lucide-react";
import { toast } from "react-toastify";
import { publicRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const Q = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    console.log(" [Q Component] Mounted");
    fetchQuestions();
  }, []);

  useEffect(() => {
    console.log("👤 useAuth() user:", user);
  }, [user]);

  // === Fetch Questions ===
  const fetchQuestions = async () => {
    console.log("📡 Fetching questions...");
    try {
      const response = await publicRequest.get("/questions/latest/");
      console.log("✅ API Response:", response.data);
      setQuestions(response.data || []);
    } catch (error) {
      console.error("❌ Failed to load questions:", error);
      toast.error("Failed to load questions");
    } finally {
      console.log("⏳ Finished loading questions");
      setLoading(false);
    }
  };

  // === Copy to Clipboard ===
  const copyToClipboard = (questionId) => {
    const url = `${window.location.origin}/q/${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // === Show Loading Skeleton ===
  if (loading || authLoading) {
    return (
      <div className="max-w-4xl mx-auto py-20">
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

  // === Main Render ===
  return (
    <div className="max-w-4xl mx-auto">
      {/* ===== Hero Section ===== */}
      <div className="text-center mb-12 py-12 rounded-2xl shadow-inner transition-all duration-300 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <h1 className="text-5xl font-bold mb-4 text-white">
          Ask Anything,
          <br />
          Get Honest Answers
        </h1>

        <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-300">
          Create anonymous Q&A pages and share them with anyone. Get honest
          feedback without knowing who replied.
        </p>

        {user ? (
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-xl hover:shadow-2xl font-medium text-lg"
          >
            <Plus className="h-5 w-5" />
            <span>Ask a Question</span>
          </Link>
        ) : (
          <div className="space-y-4 inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg px-8 py-6">
            <p className="text-gray-200 text-lg font-medium">
              Sign up to start asking questions
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-2xl font-medium text-lg"
            >
              <Plus className="h-5 w-5" />
              <span>Get Started Free</span>
            </Link>
          </div>
        )}
      </div>

      {/* ===== Recent Questions ===== */}
      <div className="space-y-6 mb-20">
        <h2 className="text-2xl font-bold text-gray-900">Recent Questions</h2>

        {questions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No questions yet. Be the first to ask!
            </p>
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
                    <span>
                      {new Date(question.created_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>
                <span className="text-primary-600 font-medium">
                  By {question.user_email || "Anonymous"}
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
