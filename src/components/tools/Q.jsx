import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, MessageCircle, Share2, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { publicRequest, privateRequest } from "../../services/api"; // 👈 userRequest includes token
import { useAuth } from "../../context/AuthContext";

const Q = () => {
  const [questions, setQuestions] = useState([]);
  const [myQuestions, setMyQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all' | 'mine'
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    fetchQuestions();
    if (user) fetchMyQuestions();
  }, [user]);

  // === Fetch All Questions ===
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

  // === Fetch My Questions (Authenticated Only) ===
  const fetchMyQuestions = async () => {
    try {
      const response = await privateRequest.get("/questions/my_questions/");
      setMyQuestions(response.data || []);
    } catch (error) {
      console.error("❌ Failed to load your questions:", error);
    }
  };

  // === Copy Link ===
  const copyToClipboard = (questionId) => {
    const url = `${window.location.origin}/q/${questionId}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard!");
  };

  // === Loading Skeleton ===
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

  // === Choose which questions to show ===
  const displayedQuestions = activeTab === "mine" ? myQuestions : questions;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ===== Hero Section ===== */}
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

      {/* ===== Tabs (All / My Questions) ===== */}
      {user && (
        <div className="flex justify-center space-x-4 mb-10">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All Questions
          </button>
          <button
            onClick={() => setActiveTab("mine")}
            className={`px-6 py-2 rounded-full font-medium ${
              activeTab === "mine"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            My Questions
          </button>
        </div>
      )}

      {/* ===== Questions List ===== */}
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
                <button
                  onClick={() => {
                    if (!user) {
                      toast.info("Please log in to view answers.");
                      window.location.href = "/login";
                    } else {
                      window.location.href = `/q/${question.id}`;
                    }
                  }}
                  className="text-left text-lg font-semibold text-gray-900 hover:text-indigo-600 flex-1 pr-4"
                >
                  {question.content}
                </button>
                <button
                  onClick={() => copyToClipboard(question.id)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
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
                <span className="text-indigo-600 font-medium">
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
