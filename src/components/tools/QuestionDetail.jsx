import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Share2,
  MessageCircle,
  User,
  Send,
  Copy,
} from "lucide-react";
import { publicRequest } from "../../services/api";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    fetchQuestionAndAnswers();
  }, [id]);
  const fetchQuestionAndAnswers = async () => {
    try {
      const response = await publicRequest.get(`/questions/${id}/`);
      setQuestion(response.data);
      setAnswers(response.data.answers || []);
    } catch (error) {
      toast.error("Question not found");
      navigate("/signup");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    const trimmed = newAnswer.trim();
    if (!trimmed) {
      toast.error("Please enter your answer");
      return;
    }
    if (trimmed.length < 5) {
      toast.error("Answer should be at least 5 characters long");
      return;
    }
    setSubmitting(true);
    try {
      await publicRequest.post("/answers/", {
        question: id,
        content: trimmed,
      });
      toast.success("Answer submitted anonymously!");
      setNewAnswer("");
      fetchQuestionAndAnswers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit answer");
    } finally {
      setSubmitting(false);
    }
  };
  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard! Share it to get more answers.");
  };
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-4 pt-24 sm:pt-28 animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  if (!question) return null;
  return (
    <div className="max-w-4xl mx-auto p-4 pt-24 sm:pt-28">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate("/ask-anything")}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Ask Anything</span>
        </button>

        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Question</span>
        </button>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
        <div className="flex items-start space-x-4 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <MessageCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {question.content}
            </h1>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{question.user_email || "Anonymous"}</span>
              </span>
              <span>{new Date(question.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <MessageCircle className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Answers ({answers.length})
          </h2>
        </div>
        {/* ===== Answers Section ===== */}
        {user && user.email === question.user_email ? (
          answers.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                No answers yet. Be the first to respond!
              </p>
              <p className="text-gray-400">
                Share the question link to get more answers
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {answers.map((answer) => (
                <div
                  key={answer.id}
                  className="border-l-4 border-blue-500 pl-6 py-4 bg-gradient-to-r from-gray-50 to-transparent rounded-r-xl"
                >
                  <p className="text-gray-800 mb-3 text-lg leading-relaxed">
                    {answer.content}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Anonymous</span>
                    </span>
                    <span>
                      {new Date(answer.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              Answers are hidden for privacy.
            </p>
            <p className="text-gray-400">
              You can still share your own anonymous response below.
            </p>
          </div>
        )}
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Your Anonymous Answer
        </h3>
        <form onSubmit={handleSubmitAnswer} className="space-y-6">
          <div>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Share your thoughts anonymously..."
              rows={5}
              maxLength={1000}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-sm text-gray-500">
                {newAnswer.length}/1000 characters
              </span>
              {newAnswer.length > 0 && newAnswer.length < 5 && (
                <span className="text-sm text-orange-600">
                  At least 5 characters required
                </span>
              )}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <Copy className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-green-800 font-medium mb-1">
                  Your answer is anonymous
                </p>
                <p className="text-green-700 text-sm">
                  The question owner won't know who you are. Feel free to be
                  honest and open.
                </p>
              </div>
            </div>
          </div>
          {/* Shareable Link Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center space-x-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              <span>Share this Question</span>
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-4 py-3 border border-blue-300 rounded-xl text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={copyToClipboard}
                className="flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md"
              >
                <Copy className="h-4 w-4" />
                <span>Copy Link</span>
              </button>
            </div>
            <p className="text-sm text-blue-700 mt-3">
              Share this link to invite others to answer your question.
            </p>
          </div>

          <div className="flex justify-between items-center">
            <Link
              to="/create"
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Want to ask your own question?
            </Link>
            <button
              type="submit"
              disabled={submitting || newAnswer.trim().length < 5}
              className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Submit Answer</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default QuestionDetail;