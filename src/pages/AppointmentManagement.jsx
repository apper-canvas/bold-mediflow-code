import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  fetchAppointmentsStart, 
  fetchAppointmentsSuccess, 
  fetchAppointmentsFailure,
  setSelectedAppointment,
  deleteAppointment as deleteAppointmentAction
} from '../store/appointmentSlice';
import { getAppointments, deleteAppointment } from '../services/appointmentService';
import AppointmentForm from '../components/AppointmentForm';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const UserIcon = getIcon('User');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const CalendarIcon = getIcon('Calendar');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const XCircleIcon = getIcon('XCircle');
const FiltersIcon = getIcon('Filter');

function AppointmentManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { appointments, loading, error, selectedAppointment } = useSelector(state => state.appointments);
  const { patients } = useSelector(state => state.patients);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [appointmentsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Check if we have a patientId in the URL
  const patientIdFromUrl = searchParams.get('patientId');
  
  // Load appointments on component mount
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        dispatch(fetchAppointmentsStart());
        const filters = {};
        
        if (patientIdFromUrl) {
          filters.patientId = patientIdFromUrl;
        }
        
        const response = await getAppointments(filters);
        if (response && response.data) {
          dispatch(fetchAppointmentsSuccess(response));
        } else {
          dispatch(fetchAppointmentsFailure('No appointment data returned'));
        }
      } catch (error) {
        console.error("Error loading appointments:", error);
        dispatch(fetchAppointmentsFailure(error.message || 'Failed to load appointments'));
        toast.error("Failed to load appointments");
      }
    };
    
    loadAppointments();
  }, [dispatch, patientIdFromUrl]);
  
  // Filter appointments when search query, status filter or date filter changes
  useEffect(() => {
    if (appointments) {
      let results = [...appointments];
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(appointment => {
          const patientName = appointment.patientInfo?.Name?.toLowerCase() || '';
          return (
            appointment.Name?.toLowerCase().includes(query) || 
            appointment.reason?.toLowerCase().includes(query) ||
            patientName.includes(query)
          );
        });
      }
      
      if (statusFilter !== 'all') {
        results = results.filter(appointment => appointment.status === statusFilter);
      }
      
      if (dateFilter.start) {
        const startDate = new Date(dateFilter.start);
        results = results.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate >= startDate;
        });
      }
      
      if (dateFilter.end) {
        const endDate = new Date(dateFilter.end);
        endDate.setHours(23, 59, 59); // End of the day
        results = results.filter(appointment => {
          const appointmentDate = new Date(appointment.appointmentDate);
          return appointmentDate <= endDate;
        });
      }
      
      // Sort by appointment date
      results.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
      
      setFilteredAppointments(results);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [appointments, searchQuery, statusFilter, dateFilter]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };
  
  const handleDateFilterChange = (e) => {
    const { name, value } = e.target;
    setDateFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setDateFilter({ start: '', end: '' });
  };
  
  const handleViewAppointment = (appointment) => {
    dispatch(setSelectedAppointment(appointment));
    setConfirmDelete(null);
  };
  
  const handleAddNew = () => {
    setIsEditing(false);
    setShowForm(true);
  };
  
  const handleEditAppointment = (appointment) => {
    dispatch(setSelectedAppointment(appointment));
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };
  
  const handleDeleteAppointment = async (id) => {
    try {
      const response = await deleteAppointment(id);
      if (response && response.success) {
        dispatch(deleteAppointmentAction(id));
        setConfirmDelete(null);
        if (selectedAppointment && selectedAppointment.Id === id) {
          dispatch(setSelectedAppointment(null));
        }
        toast.success("Appointment deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete appointment");
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(error.message || "An error occurred while deleting the appointment");
    }
  };
  
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy - h:mm a');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <ClockIcon size={12} className="mr-1" />;
      case 'completed':
        return <CheckCircleIcon size={12} className="mr-1" />;
      case 'cancelled':
        return <XCircleIcon size={12} className="mr-1" />;
      default:
        return null;
    }
  };
  
  // Calculate pagination
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-3 md:mb-0">
            Appointment Management
            {patientIdFromUrl && patients && (
              <span className="ml-2 text-sm font-normal text-surface-500 dark:text-surface-400">
                for {patients.find(p => p.Id.toString() === patientIdFromUrl)?.Name || 'Patient'}
              </span>
            )}
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={16} className="text-surface-400" />
              </div>
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 py-2 pr-4 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light bg-surface-50 dark:bg-surface-700 text-surface-800 dark:text-surface-100 w-full"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="py-2 px-4 border border-surface-200 dark:border-surface-700 rounded-lg text-surface-600 dark:text-surface-300 flex items-center hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
            >
              <FiltersIcon size={16} className="mr-1" />
              Filters
            </button>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddNew}
              className="py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors duration-200"
            >
              <PlusIcon size={16} className="mr-1" />
              <span>New Appointment</span>
            </motion.button>
          </div>
        </div>
        
        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 border-t border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-700/50">
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Status</p>
                    <div className="flex space-x-1">
                      {['all', 'scheduled', 'completed', 'cancelled'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusFilterChange(status)}
                          className={`px-3 py-2 text-xs rounded-md font-medium ${
                            statusFilter === status
                              ? 'bg-primary/10 text-primary dark:bg-primary/20'
                              : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
                          } transition-colors duration-200`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Date Range</p>
                    <div className="flex space-x-2">
                      <input
                        type="date"
                        name="start"
                        value={dateFilter.start}
                        onChange={handleDateFilterChange}
                        className="text-xs px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-md bg-white dark:bg-surface-800"
                      />
                      <span className="self-center text-surface-500 dark:text-surface-400">to</span>
                      <input
                        type="date"
                        name="end"
                        value={dateFilter.end}
                        onChange={handleDateFilterChange}
                        className="text-xs px-3 py-2 border border-surface-200 dark:border-surface-700 rounded-md bg-white dark:bg-surface-800"
                      />
                    </div>
                  </div>
                  
                  <div className="ml-auto self-end">
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-xs border border-surface-200 dark:border-surface-700 rounded-md text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors duration-200"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-200 dark:divide-surface-700">
        {/* Appointment List */}
        <div className="col-span-2 md:max-h-[600px] md:overflow-y-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-surface-600 dark:text-surface-400">Loading appointments...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Retry
                </button>
              </div>
            ) : filteredAppointments.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead className="bg-surface-50 dark:bg-surface-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Appointment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {currentAppointments.map((appointment) => {
                      // Find the patient info from expanded data or patient list
                      const patientInfo = appointment.patientInfo || 
                        patients.find(p => p.Id === appointment.patient);
                        
                      return (
                        <motion.tr 
                          key={appointment.Id}
                          className={`hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer ${selectedAppointment?.Id === appointment.Id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                          onClick={() => handleViewAppointment(appointment)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300">
                                <CalendarIcon size={20} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-surface-800 dark:text-surface-100">
                                  {appointment.Name}
                                </div>
                                <div className="text-xs text-surface-500 dark:text-surface-400 truncate max-w-xs">
                                  {appointment.reason?.substring(0, 40)}{appointment.reason?.length > 40 ? '...' : ''}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-surface-600 dark:text-surface-400">
                              {patientInfo?.Name || 'Unknown Patient'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-surface-600 dark:text-surface-400">
                              {formatDateTime(appointment.appointmentDate)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                              {getStatusIcon(appointment.status)}
                              {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditAppointment(appointment);
                              }}
                              className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary mr-3"
                            >
                              <EditIcon size={16} />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteConfirm(appointment.Id);
                              }}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <TrashIcon size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="text-sm text-surface-700 dark:text-surface-400">
                        Showing <span className="font-medium">{indexOfFirstAppointment + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastAppointment, filteredAppointments.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredAppointments.length}</span> appointments
                      </p>
                    </div>
                    <div>
                      <nav className="flex items-center">
                        <button
                          onClick={() => paginate(currentPage - 1)}
                          disabled={currentPage === 1}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === 1
                              ? "text-surface-400 cursor-not-allowed"
                              : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                          }`}
                        >
                          Previous
                        </button>
                        
                        {[...Array(totalPages)].map((_, i) => (
                          <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 rounded-md mx-1 ${
                              currentPage === i + 1
                                ? "bg-primary text-white"
                                : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        
                        <button
                          onClick={() => paginate(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === totalPages
                              ? "text-surface-400 cursor-not-allowed"
                              : "text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700"
                          }`}
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                  <CalendarIcon size={24} className="text-surface-400 dark:text-surface-500" />
                </div>
                <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No appointments found</h4>
                <p className="text-surface-500 dark:text-surface-400 max-w-sm">
                  {searchQuery || statusFilter !== 'all' || dateFilter.start || dateFilter.end
                    ? `No appointments match the current filters`
                    : "There are no appointments in the system yet."}
                </p>
                {(searchQuery || statusFilter !== 'all' || dateFilter.start || dateFilter.end) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-primary hover:text-primary-dark dark:text-primary-light transition-colors duration-200"
                  >
                    Clear filters
                  </button>
                )}
                {!searchQuery && statusFilter === 'all' && !dateFilter.start && !dateFilter.end && (
                  <button
                    onClick={handleAddNew}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Schedule Your First Appointment
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Appointment Details or Form */}
        <div className="col-span-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            {showForm ? (
              <AppointmentForm 
                appointment={selectedAppointment}
                isEditing={isEditing}
                onClose={() => setShowForm(false)}
              />
            ) : selectedAppointment ? (
              <motion.div
                key="appointment-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-lg text-surface-800 dark:text-surface-100">
                      Appointment Details
                    </h4>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditAppointment(selectedAppointment)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-300 transition-colors duration-200"
                      >
                        <EditIcon size={15} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteConfirm(selectedAppointment.Id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-red-100 dark:bg-surface-700 dark:hover:bg-red-900/30 text-surface-600 hover:text-red-600 dark:text-surface-300 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <TrashIcon size={15} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                      <CalendarIcon size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-surface-800 dark:text-surface-100">{selectedAppointment.Name}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {formatDateTime(selectedAppointment.appointmentDate)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Patient
                    </p>
                    <div className="flex items-center p-3 bg-surface-50 dark:bg-surface-800/80 rounded-lg">
                      <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300">
                        <UserIcon size={16} />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                          {selectedAppointment.patientInfo?.Name || 
                           patients.find(p => p.Id === selectedAppointment.patient)?.Name || 
                           'Unknown Patient'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Status
                    </p>
                    <div className={`px-3 py-2 rounded-lg ${getStatusBadgeClasses(selectedAppointment.status)}`}>
                      <div className="flex items-center">
                        {getStatusIcon(selectedAppointment.status)}
                        <span className="font-medium">
                          {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Reason for Visit
                    </p>
                    <div className="bg-surface-50 dark:bg-surface-800/80 rounded-lg p-3">
                      <p className="text-sm text-surface-800 dark:text-surface-100">
                        {selectedAppointment.reason || 'No reason specified'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    {selectedAppointment.status === 'scheduled' && (
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => {
                            handleEditAppointment({
                              ...selectedAppointment,
                              status: 'completed'
                            });
                          }}
                          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                        >
                          <CheckCircleIcon size={16} className="mr-2" />
                          Mark Completed
                        </button>
                        
                        <button
                          onClick={() => {
                            handleEditAppointment({
                              ...selectedAppointment,
                              status: 'cancelled'
                            });
                          }}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                        >
                          <XCircleIcon size={16} className="mr-2" />
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Delete Confirmation */}
                {confirmDelete === selectedAppointment.Id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Are you sure you want to delete this appointment? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleDeleteAppointment(selectedAppointment.Id)}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1.5 bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 text-sm font-medium rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="empty-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center py-12 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4">
                  <CalendarIcon size={24} className="text-surface-400 dark:text-surface-500" />
                </div>
                <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No appointment selected</h4>
                <p className="text-surface-500 dark:text-surface-400 max-w-xs">
                  Select an appointment from the list to view details or click "New Appointment" to create a new entry
                </p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Schedule Appointment
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AppointmentManagement;