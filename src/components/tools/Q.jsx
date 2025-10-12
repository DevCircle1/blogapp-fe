import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MessageCircle, Share2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { publicRequest, privateRequest } from "../../services/api"; 
import { useAuth } from "../../context/AuthContext";
const Q = () => {
  const [questions, setQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); 
  const { user, loading: authLoading } = useAuth();
  useEffect(() => {
    fetchQuestions();
    if (user) fetchMyQuestions();
  }, [user]);
  const fetchQuestions = async () => {
    try {
      const response = await publicRequest.get("/questions/latest/");
      setQuestions(response.data || []);
    } catch (error) {
      console.error("❌ Failed to load questions:", error);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };
  const fetchMyQuestions = async () => {
    try {
      const response = await privateRequest.get("/questions/my_questions/");
      setMyQuestions(response.data || []);
    } catch (error) {
      console.error("❌ Failed to load your questions:", error);
    }
  };
  const copyToClipboard = (questionId) => {
    const url = `${window.location.origin}/q/${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };
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
  const displayedQuestions = activeTab === "mine" ? myQuestions : questions;
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12 py-12 rounded-2xl bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-inner">
        <h1 className="text-5xl font-bold mb-4">
          Ask Anything,
          <br />
          Get Honest Answers
        </h1>
        <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Create anonymous Q&A pages and share them with anyone.
        </p>
        {user ? (
          <Link
            to="/create"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Ask a Question</span>
          </Link>
        ) : (
          <div className="bg-white/10 border border-white/20 rounded-2xl px-8 py-6 inline-block">
            <p className="text-gray-200 mb-3">
              Sign up to start asking questions
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-8 py-4 rounded-2xl hover:from-indigo-600 hover:to-blue-700 transition-all duration-200 shadow-xl"
            >
              <Plus className="h-5 w-5" />
              <span>Get Started Free</span>
            </Link>
          </div>
        )}
      </div>
      {user && (
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:space-x-4 mb-10 px-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium text-center transition-all duration-200 ${
              activeTab === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Recent Questions
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`w-full sm:w-auto px-6 py-2 rounded-full font-medium text-center transition-all duration-200 ${
              activeTab === "mine"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Questions
          </button>
        </div>
      )}
      <div className="space-y-6 mb-20">
        <h2 className="text-2xl font-bold text-gray-900">
          {activeTab === "mine" ? "My Questions" : "Recent Questions"}
        </h2>
        {displayedQuestions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-100">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No questions yet.{" "}
              {activeTab === "mine"
                ? "Ask your first one!"
                : "Be the first to ask!"}
            </p>
          </div>
        ) : (
          displayedQuestions.map((question) => (
            <div
              key={question.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                {activeTab === "mine" ? (
                  <button
                    onClick={() => (window.location.href = `/q/${question.id}`)}
                    className="text-left text-lg font-semibold text-gray-900 hover:text-indigo-600 flex-1 pr-4"
                  >
                    {question.content}
                  </button>
                ) : (
                  <div className="text-left text-lg font-semibold text-gray-900 flex-1 pr-4 cursor-default">
                    {question.content}
                  </div>
                )}
                <button
                  onClick={() => copyToClipboard(question.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                ></button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mt-4 gap-2 sm:gap-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700 text-sm">
                      {question.answer_count} answers
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-gray-700 text-sm">
                      {new Date(question.created_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>
                {/* Right side: Author */}
                <div className="text-gray-600 sm:text-right text-sm sm:mt-0 mt-1">
                  <span className="font-medium text-indigo-600">
                    {question.user_email || "Anonymous"}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default Q;