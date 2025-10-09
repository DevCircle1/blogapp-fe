import React, { useEffect, useState } from "react";
import { privateRequest } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { MessageCircle, Clock, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const MyAnswers = () => {
  const { user } = useAuth();
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error("Please login to view your answers");
      navigate("/signup");
      return;
    }
    fetchMyAnswers();
  }, [user]);

  const fetchMyAnswers = async () => {
    try {
      const res = await privateRequest.get("/answers/my_answers/");
      setAnswers(res.data || []);
    } catch (error) {
      console.error("Failed to fetch answers", error);
      toast.error("Failed to load your answers");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="max-w-4xl mx-auto py-20">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900">My Answers</h1>
      </div>

      {/* Answers List */}
      {answers.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
          <MessageCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">You haven’t answered any questions yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {answers.map((ans) => (
            <div
              key={ans.id}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 hover:shadow-md transition-all"
            >
              <Link
                to={`/q/${ans.question?.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
              >
                {ans.question?.content || "Deleted question"}
              </Link>

              <p className="mt-3 text-gray-700 bg-gray-50 rounded-xl p-4 border border-gray-100">
                {ans.content}
              </p>

              <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(ans.created_at).toLocaleString()}</span>
                </span>
                <span className="font-medium text-indigo-600">You answered</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAnswers;
