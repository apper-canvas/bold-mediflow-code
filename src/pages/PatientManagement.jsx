import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { 
  fetchPatientsStart, 
  fetchPatientsSuccess, 
  fetchPatientsFailure,
  setSelectedPatient,
  deletePatient as deletePatientAction
} from '../store/patientSlice';
import { getPatients, deletePatient } from '../services/patientService';
import PatientForm from '../components/PatientForm';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const PlusIcon = getIcon('Plus');
const SearchIcon = getIcon('Search');
const UserIcon = getIcon('User');
const EditIcon = getIcon('Edit');
const TrashIcon = getIcon('Trash');
const PhoneIcon = getIcon('Phone');
const CalendarIcon = getIcon('Calendar');

function PatientManagement() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { patients, loading, error, selectedPatient } = useSelector(state => state.patients);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  
  // Load patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        dispatch(fetchPatientsStart());
        const response = await getPatients();
        if (response && response.data) {
          dispatch(fetchPatientsSuccess(response));
        } else {
          dispatch(fetchPatientsFailure('No patient data returned'));
        }
      } catch (error) {
        console.error("Error loading patients:", error);
        dispatch(fetchPatientsFailure(error.message || 'Failed to load patients'));
        toast.error("Failed to load patients");
      }
    };
    
    loadPatients();
  }, [dispatch]);
  
  // Filter patients when search query changes
  useEffect(() => {
    if (patients) {
      let results = patients;
      
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        results = results.filter(patient => 
          patient.Name?.toLowerCase().includes(query) || 
          patient.phone?.toLowerCase().includes(query)
        );
      }
      
      setFilteredPatients(results);
      setCurrentPage(1); // Reset to first page when filtering
    }
  }, [patients, searchQuery]);
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleViewPatient = (patient) => {
    dispatch(setSelectedPatient(patient));
    setConfirmDelete(null);
  };
  
  const handleAddNew = () => {
    setIsEditing(false);
    setShowForm(true);
  };
  
  const handleEditPatient = (patient) => {
    dispatch(setSelectedPatient(patient));
    setIsEditing(true);
    setShowForm(true);
  };
  
  const handleDeleteConfirm = (id) => {
    setConfirmDelete(id);
  };
  
  const handleDeletePatient = async (id) => {
    try {
      const response = await deletePatient(id);
      if (response && response.success) {
        dispatch(deletePatientAction(id));
        setConfirmDelete(null);
        if (selectedPatient && selectedPatient.Id === id) {
          dispatch(setSelectedPatient(null));
        }
        toast.success("Patient deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete patient");
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error(error.message || "An error occurred while deleting the patient");
    }
  };
  
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  // Calculate pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm dark:shadow-none border border-surface-200 dark:border-surface-700 overflow-hidden">
      <div className="border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 md:p-6">
          <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100 mb-3 md:mb-0">
            Patient Management
          </h3>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon size={16} className="text-surface-400" />
              </div>
              <input
                type="text"
                placeholder="Search patients..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 py-2 pr-4 border border-surface-200 dark:border-surface-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-light bg-surface-50 dark:bg-surface-700 text-surface-800 dark:text-surface-100 w-full"
              />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleAddNew}
              className="py-2 px-4 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors duration-200"
            >
              <PlusIcon size={16} className="mr-1" />
              <span>New Patient</span>
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-200 dark:divide-surface-700">
        {/* Patient List */}
        <div className="col-span-2 md:max-h-[600px] md:overflow-y-auto">
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="py-12 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-surface-600 dark:text-surface-400">Loading patients...</p>
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
            ) : filteredPatients.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
                  <thead className="bg-surface-50 dark:bg-surface-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Age / Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Created On
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
                    {currentPatients.map((patient) => (
                      <motion.tr 
                        key={patient.Id}
                        className={`hover:bg-surface-50 dark:hover:bg-surface-700/50 cursor-pointer ${selectedPatient?.Id === patient.Id ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                        onClick={() => handleViewPatient(patient)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300">
                              <UserIcon size={20} />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-surface-800 dark:text-surface-100">
                                {patient.Name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {patient.age} years, {patient.gender}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-surface-600 dark:text-surface-400">
                            {patient.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-surface-500 dark:text-surface-400">
                          {formatDate(patient.CreatedOn)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditPatient(patient);
                            }}
                            className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary mr-3"
                          >
                            <EditIcon size={16} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteConfirm(patient.Id);
                            }}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            <TrashIcon size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-3 flex items-center justify-between border-t border-surface-200 dark:border-surface-700">
                    <div>
                      <p className="text-sm text-surface-700 dark:text-surface-400">
                        Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{" "}
                        <span className="font-medium">
                          {Math.min(indexOfLastPatient, filteredPatients.length)}
                        </span>{" "}
                        of <span className="font-medium">{filteredPatients.length}</span> patients
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
                  <UserIcon size={24} className="text-surface-400 dark:text-surface-500" />
                </div>
                <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No patients found</h4>
                <p className="text-surface-500 dark:text-surface-400 max-w-sm">
                  {searchQuery 
                    ? `No patients match "${searchQuery}"` 
                    : "There are no patients in the system yet."}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-4 text-primary hover:text-primary-dark dark:text-primary-light transition-colors duration-200"
                  >
                    Clear search
                  </button>
                )}
                {!searchQuery && (
                  <button
                    onClick={handleAddNew}
                    className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                  >
                    Add Your First Patient
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Patient Details or Form */}
        <div className="col-span-1 p-4 md:p-6">
          <AnimatePresence mode="wait">
            {showForm ? (
              <PatientForm 
                patient={selectedPatient}
                isEditing={isEditing}
                onClose={() => setShowForm(false)}
              />
            ) : selectedPatient ? (
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
                        onClick={() => handleEditPatient(selectedPatient)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-100 hover:bg-surface-200 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-600 dark:text-surface-300 transition-colors duration-200"
                      >
                        <EditIcon size={15} />
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteConfirm(selectedPatient.Id)}
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
                      <h3 className="font-semibold text-lg text-surface-800 dark:text-surface-100">{selectedPatient.Name}</h3>
                      <p className="text-sm text-surface-500 dark:text-surface-400">
                        {selectedPatient.age} years, {selectedPatient.gender}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-surface-50 dark:bg-surface-800/80 rounded-lg">
                    <PhoneIcon size={20} className="text-primary mr-3" />
                    <div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Contact Number</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                        {selectedPatient.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-3 bg-surface-50 dark:bg-surface-800/80 rounded-lg">
                    <CalendarIcon size={20} className="text-primary mr-3" />
                    <div>
                      <p className="text-xs text-surface-500 dark:text-surface-400">Created On</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-100">
                        {formatDate(selectedPatient.CreatedOn)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <button
                      onClick={() => navigate(`/appointments/new?patientId=${selectedPatient.Id}`)}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center"
                    >
                      <CalendarIcon size={16} className="mr-2" />
                      Schedule Appointment
                    </button>
                  </div>
                </div>
                
                {/* Delete Confirmation */}
                {confirmDelete === selectedPatient.Id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 rounded-lg"
                  >
                    <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                      Are you sure you want to delete this patient? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleDeletePatient(selectedPatient.Id)}
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
                  Select a patient from the list to view details or click "New Patient" to create a new entry
                </p>
                <button
                  onClick={handleAddNew}
                  className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                >
                  Add New Patient
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default PatientManagement;