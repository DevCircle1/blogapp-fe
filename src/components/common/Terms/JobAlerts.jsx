import { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { publicRequest } from '../../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

// Modal Component
const MessageModal = ({ isOpen, onClose, message, title, date }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition duration-200"
          >
            <CloseIcon />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {message}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center p-6 border-t bg-gray-50">
          <div className="flex items-center text-gray-500 text-sm">
            <CalendarIcon />
            <span className="ml-2">Posted: {new Date(date).toLocaleDateString()}</span>
          </div>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const JobAlerts = () => {
  const { user } = useAuth();
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobAlerts();
  }, []);

  const fetchJobAlerts = async () => {
    try {
      setLoading(true);
      const response = await publicRequest.get('/job-alerts/');
      setJobAlerts(response.data);
      toast.success('Job alerts loaded successfully!');
    } catch (error) {
      console.error('Error fetching job alerts:', error);
      toast.error('Failed to load job alerts');
    } finally {
      setLoading(false);
    }
  };

  const filteredAlerts = jobAlerts.filter(alert => {
    return alert.message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Extract title from message (first line or first 50 characters)
  const getTitleFromMessage = (message) => {
    if (!message) return 'Job Alert';
    const firstLine = message.split('\n')[0];
    return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
  };

  // Truncate message for card display
  const truncateMessage = (message, maxLength = 120) => {
    if (!message) return 'No description available';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Message Modal */}
      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={selectedAlert?.message}
        title={getTitleFromMessage(selectedAlert?.message)}
        date={selectedAlert?.created_at}
      />

      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <BellIcon />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Alerts</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest job opportunities matching your preferences
          </p>
        </div>

        {/* Stats Card */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{jobAlerts.length}</div>
            <div className="text-gray-600">Total Job Alerts</div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search job alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Job Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">
                {jobAlerts.length === 0 ? 'No job alerts available' : 'No job alerts found'}
              </div>
              <p className="text-gray-400 mt-2">
                {jobAlerts.length === 0 ? 'Check back later for new job opportunities' : 'Try adjusting your search'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {getTitleFromMessage(alert.message)}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {truncateMessage(alert.message)}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon />
                      <span className="ml-2">
                        Posted: {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      ID: #{alert.id}
                    </span>
                    <button 
                      onClick={() => openModal(alert)}
                      className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;