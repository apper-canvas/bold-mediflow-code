import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const SearchIcon = getIcon('Search');
const PlusIcon = getIcon('Plus');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const CheckCircleIcon = getIcon('CheckCircle');
const XCircleIcon = getIcon('XCircle');
const CalendarIcon = getIcon('Calendar');
const UserIcon = getIcon('User');
const PhoneIcon = getIcon('Phone');
const ClockIcon = getIcon('Clock');

// Sample data for patients
const initialPatients = [
  { 
    id: '1', 
    name: 'Jane Cooper', 
    age: 32, 
    gender: 'Female',
    phone: '(555) 123-4567',
    appointmentDate: '2023-11-15T09:30:00', 
    status: 'scheduled',
    reason: 'Annual check-up'
  },
  { 
    id: '2', 
    name: 'Michael Scott', 
    age: 45, 
    gender: 'Male',
    phone: '(555) 234-5678',
    appointmentDate: '2023-11-16T14:15:00', 
    status: 'completed',
    reason: 'Follow-up consultation'
  },
  { 
    id: '3', 
    name: 'Sarah Johnson', 
    age: 28, 
    gender: 'Female',
    phone: '(555) 345-6789',
    appointmentDate: '2023-11-17T11:00:00', 
    status: 'cancelled',
    reason: 'Chronic headache evaluation'
  },
  { 
    id: '4', 
    name: 'Robert Chen', 
    age: 51, 
    gender: 'Male',
    phone: '(555) 456-7890',
    appointmentDate: '2023-11-18T10:45:00', 
    status: 'scheduled',
    reason: 'Blood pressure monitoring'
  }
];

function MainFeature() {
  const [patients, setPatients] = useState(initialPatients);
  const [filteredPatients, setFilteredPatients] = useState(initialPatients);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    age: '',
    gender: 'Female',
    phone: '',
    appointmentDate: '',
    status: 'scheduled',
    reason: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activePatient, setActivePatient] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Filter patients when search query or status filter changes
  useEffect(() => {
    let results = patients;
    
    if (searchQuery) {
      results = results.filter(patient => 
        patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.reason.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      results = results.filter(patient => patient.status === statusFilter);
    }
    
    setFilteredPatients(results);
  }, [patients, searchQuery, statusFilter]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
  };

  const handleViewPatient = (patient) => {
    setActivePatient(patient);
    setConfirmDelete(null);
  };

  const handleAddNew = () => {
    setFormData({
      id: Date.now().toString(),
      name: '',
      age: '',
      gender: 'Female',
      phone: '',
      appointmentDate: '',
      status: 'scheduled',
      reason: ''
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setFormData({...patient});
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
    setConfirmDelete(null);
    setActivePatient(null);
    
    toast.success("Patient appointment deleted successfully", {
      icon: "🗑️"
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing) {
      setPatients(patients.map(patient => 
        patient.id === formData.id ? formData : patient
      ));
      toast.success("Patient appointment updated successfully", {
        icon: "✏️"
      });
    } else {
      setPatients([...patients, formData]);
      toast.success("New patient appointment added successfully", {
        icon: "✅"
      });
    }
    
    setShowForm(false);
    setFormData({
      id: '',
      name: '',
      age: '',
      gender: 'Female',
      phone: '',
      appointmentDate: '',
      status: 'scheduled',
      reason: ''
    });
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

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-3 md:mb-0">
            Patient Appointments
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
                className="input pl-10 py-2 text-sm"
              />
            </div>
            
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
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddNew}
              className="btn-primary py-2 flex items-center justify-center"
            >
              <PlusIcon size={16} className="mr-1" />
              <span>New Appointment</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-200 dark:divide-surface-700">
        {/* Appointment List */}
        <div className="col-span-2 md:max-h-[600px] md:overflow-y-auto">
          <AnimatePresence mode="wait">
            {filteredPatients.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ul className="divide-y divide-surface-200 dark:divide-surface-700">
                  {filteredPatients.map((patient) => (
                    <motion.li 
                      key={patient.id}
                      layoutId={`patient-${patient.id}`}
                      whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                      className={`px-4 py-4 md:px-6 cursor-pointer transition-colors duration-150 ${activePatient?.id === patient.id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                      onClick={() => handleViewPatient(patient)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300">
                            <UserIcon size={18} />
                          </div>
                          <div className="ml-3">
                            <p className="font-medium text-surface-800 dark:text-surface-100">
                              {patient.name}
                            </p>
                            <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 mt-1">
                              <CalendarIcon size={12} className="mr-1" />
                              <span>{formatDateTime(patient.appointmentDate)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(patient.status)}`}>
                            {patient.status === 'scheduled' && (
                              <ClockIcon size={12} className="mr-1" />
                            )}
                            {patient.status === 'completed' && (
                              <CheckCircleIcon size={12} className="mr-1" />
                            )}
                            {patient.status === 'cancelled' && (
                              <XCircleIcon size={12} className="mr-1" />
                            )}
                            {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                          </span>
                          <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">
                            {patient.age} years, {patient.gender}
                          </p>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
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
                <p className="text-surface-500 dark:text-surface-400 max-w-xs">
                  {searchQuery 
                    ? `No results for "${searchQuery}" with the selected filters` 
                    : "No appointments match the selected filters"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setStatusFilter('all');
                  }}
                  className="mt-4 text-primary hover:text-primary-dark dark:text-primary-light transition-colors duration-200"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Patient Details or Form */}
        <div className="col-span-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            {showForm ? (
              <motion.div
                key="appointment-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h4 className="font-medium text-lg text-surface-800 dark:text-surface-100">
                    {isEditing ? 'Edit Appointment' : 'New Appointment'}
                  </h4>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
                  >
                    <XCircleIcon size={20} />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="label">Patient Name</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleFormChange}
                        required
                        className="input"
                        placeholder="Full name"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="age" className="label">Age</label>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="0"
                          max="120"
                          value={formData.age}
                          onChange={handleFormChange}
                          required
                          className="input"
                          placeholder="Age"
                        />
                      </div>

                      <div>
                        <label htmlFor="gender" className="label">Gender</label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleFormChange}
                          className="input"
                        >
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="label">Phone Number</label>
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        value={formData.phone}
                        onChange={handleFormChange}
                        required
                        className="input"
                        placeholder="(555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="appointmentDate" className="label">Appointment Date & Time</label>
                      <input
                        id="appointmentDate"
                        name="appointmentDate"
                        type="datetime-local"
                        value={formData.appointmentDate}
                        onChange={handleFormChange}
                        required
                        className="input"
                      />
                    </div>

                    <div>
                      <label htmlFor="status" className="label">Status</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleFormChange}
                        className="input"
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="reason" className="label">Reason for Visit</label>
                      <textarea
                        id="reason"
                        name="reason"
                        value={formData.reason}
                        onChange={handleFormChange}
                        rows="3"
                        className="input resize-none"
                        placeholder="Brief description of the appointment reason"
                      ></textarea>
                    </div>

                    <div className="pt-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full btn-primary"
                      >
                        {isEditing ? 'Update Appointment' : 'Create Appointment'}
                      </motion.button>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : activePatient ? (
              <motion.div
                key="patient-details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-lg text-surface-800 dark:text-surface-100">
                      Patient Details
                    </h4>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleEditPatient(activePatient)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-300 transition-colors duration-200"
                      >
                        <EditIcon size={15} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteConfirm(activePatient.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-red-100 dark:bg-surface-700 dark:hover:bg-red-900/30 text-surface-600 hover:text-red-600 dark:text-surface-300 dark:hover:text-red-400 transition-colors duration-200"
                      >
                        <TrashIcon size={15} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary">
                      <UserIcon size={24} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-lg text-surface-800 dark:text-surface-100">{activePatient.name}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {activePatient.age} years, {activePatient.gender}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-surface-50 dark:bg-surface-800/80 rounded-lg">
                    <CalendarIcon size={20} className="text-primary mr-3" />
                    <div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Appointment Date</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                        {formatDateTime(activePatient.appointmentDate)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-surface-50 dark:bg-surface-800/80 rounded-lg">
                    <PhoneIcon size={20} className="text-primary mr-3" />
                    <div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Contact Number</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                        {activePatient.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
                      Appointment Status
                    </p>
                    <div className={`px-3 py-2 rounded-lg ${getStatusBadgeClasses(activePatient.status)}`}>
                      <div className="flex items-center">
                        {activePatient.status === 'scheduled' && <ClockIcon size={16} className="mr-2" />}
                        {activePatient.status === 'completed' && <CheckCircleIcon size={16} className="mr-2" />}
                        {activePatient.status === 'cancelled' && <XCircleIcon size={16} className="mr-2" />}
                        <span className="font-medium">
                          {activePatient.status.charAt(0).toUpperCase() + activePatient.status.slice(1)}
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
                        {activePatient.reason}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Delete Confirmation */}
                {confirmDelete === activePatient.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Are you sure you want to delete this appointment?
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleDeletePatient(activePatient.id)}
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
                  <UserIcon size={24} className="text-surface-400 dark:text-surface-500" />
                </div>
                <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No patient selected</h4>
                <p className="text-surface-500 dark:text-surface-400 max-w-xs">
                  Select a patient from the list to view details or click "New Appointment" to create a new entry
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MainFeature;