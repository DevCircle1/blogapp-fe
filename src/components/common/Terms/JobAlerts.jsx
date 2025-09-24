import { useState, useEffect } from 'react';
import { useAuth } from "../../../context/AuthContext";
import { publicRequest } from '../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Icons (you can replace these with your actual icon library)
const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
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

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const JobAlerts = () => {
  const { user } = useAuth();
  const [jobAlerts, setJobAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

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

  const filteredAlerts = jobAlerts
    .filter(alert => {
      const matchesSearch = alert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           alert.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      }
      return 0;
    });

  const handleDeleteAlert = async (alertId) => {
    try {
      await publicRequest.delete(`/job-alerts/${alertId}/`);
      setJobAlerts(jobAlerts.filter(alert => alert.id !== alertId));
      toast.success('Job alert deleted successfully!');
    } catch (error) {
      console.error('Error deleting job alert:', error);
      toast.error('Failed to delete job alert');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' },
      expired: { color: 'bg-red-100 text-red-800', label: 'Expired' },
      draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' }
    };
    
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{jobAlerts.length}</div>
            <div className="text-gray-600">Total Alerts</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">
              {jobAlerts.filter(a => a.status === 'active').length}
            </div>
            <div className="text-gray-600">Active Alerts</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">
              {jobAlerts.filter(a => a.status === 'paused').length}
            </div>
            <div className="text-gray-600">Paused Alerts</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900">
              {jobAlerts.filter(a => a.status === 'expired').length}
            </div>
            <div className="text-gray-600">Expired Alerts</div>
          </div>
        </div>

        {/* Search and Filter Section */}
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="expired">Expired</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition duration-200 flex items-center justify-center">
                <FilterIcon />
                <span className="ml-2">Filter</span>
              </button>
            </div>
          </div>
        </div>

        {/* Job Alerts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAlerts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-500 text-lg">No job alerts found</div>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div key={alert.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{alert.title}</h3>
                      {getStatusBadge(alert.status)}
                    </div>
                    <button
                      onClick={() => handleDeleteAlert(alert.id)}
                      className="text-gray-400 hover:text-red-500 transition duration-200"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4 line-clamp-2">{alert.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-500">
                      <LocationIcon />
                      <span className="ml-2">{alert.location || 'Remote'}</span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <CalendarIcon />
                      <span className="ml-2">
                        Created: {new Date(alert.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Frequency: {alert.frequency || 'Daily'}
                    </span>
                    <button className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition duration-200">
                      Manage
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Create New Alert Button */}
        <div className="fixed bottom-8 right-8">
          <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition duration-200 transform hover:scale-110">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobAlerts;