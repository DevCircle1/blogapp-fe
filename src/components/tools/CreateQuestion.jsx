// pages/CreateQuestion.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { publicRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext"; 

const CreateQuestion = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); 
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) {
      toast.error("Please sign in to create a question");
      navigate("/signup");
    }
  }, [user, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      toast.error("Please enter your question");
      return;
    }
    if (trimmed.length < 10) {
      toast.error("Question should be at least 10 characters long");
      return;
    }

    setLoading(true);
    try {
      const response = await publicRequest.post("/questions/", {
        content: trimmed,
      });
      toast.success("Question created successfully!");
      navigate(`/q/${response.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create question");
    } finally {
      setLoading(false);
    }
  };
  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
      </div>

      {/* Form */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Your Question
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to ask anonymously? (e.g., Give me advice on career change, What should I do about my relationship?, How can I improve my skills?)"
              rows={6}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-lg"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {content.length}/500 characters
              </span>
              {content.length < 10 && (
                <span className="text-sm text-orange-600">
                  At least 10 characters required
                </span>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-2">
                How it works:
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Create your question and get a unique shareable URL</li>
                <li>• Share the URL with anyone you want answers from</li>
                <li>• Answers are completely anonymous</li>
                <li>• Respondents can also create their own questions</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h3 className="font-semibold text-green-800 mb-2">
                Tips for great questions:
              </h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Be specific and clear about what you're asking</li>
                <li>• Keep it open-ended to encourage detailed responses</li>
                <li>• Make it something people would enjoy answering</li>
              </ul>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || content.trim().length < 10}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Create Question</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
