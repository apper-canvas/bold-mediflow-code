import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getPatients } from '../services/patientService';
import { getAppointments } from '../services/appointmentService';
import { fetchPatientsStart, fetchPatientsSuccess, fetchPatientsFailure } from '../store/patientSlice';
import { fetchAppointmentsStart, fetchAppointmentsSuccess, fetchAppointmentsFailure } from '../store/appointmentSlice';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const LogOutIcon = getIcon('LogOut');
const PlusSquareIcon = getIcon('PlusSquare');
const UsersIcon = getIcon('Users');
const CalendarIcon = getIcon('Calendar');
const ClipboardListIcon = getIcon('ClipboardList');
const ActivityIcon = getIcon('Activity');
const ArrowRightIcon = getIcon('ArrowRight');
const ClockIcon = getIcon('Clock');
const CheckCircleIcon = getIcon('CheckCircle');
const XCircleIcon = getIcon('XCircle');
const UserIcon = getIcon('User');

function Dashboard({ isDarkMode, toggleDarkMode }) {
  const { logout } = useContext(AuthContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.user);
  const { patients, loading: patientsLoading } = useSelector(state => state.patients);
  const { appointments, loading: appointmentsLoading } = useSelector(state => state.appointments);
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    // Load patients data
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
    
    // Load appointments data
    const loadAppointments = async () => {
      try {
        dispatch(fetchAppointmentsStart());
        const response = await getAppointments();
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
    
    loadPatients();
    loadAppointments();
  }, [dispatch]);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Logout failed. Please try again.");
    }
  };
  
  const handleMenuItemClick = (tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
    if (tab === 'patients') {
      navigate('/patients');
    } else if (tab === 'appointments') {
      navigate('/appointments');
    } else {
      navigate('/');
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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-700 md:hidden"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
              </motion.button>
              
              <div className="flex items-center ml-2 md:ml-0">
                <motion.div 
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-lg md:text-xl mr-2 md:mr-3"
                >
                  M
                </motion.div>
                <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  MediFlow
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 md:space-x-4">
              <button 
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-700"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <SunIcon size={22} /> : <MoonIcon size={22} />}
              </button>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:text-surface-400 dark:hover:text-surface-200 dark:hover:bg-surface-700"
                aria-label="Logout"
              >
                <LogOutIcon size={22} />
              </button>
              
              <div className="hidden md:flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                  <span className="font-medium text-sm">
                    {user?.firstName?.charAt(0) || 'U'}
                    {user?.lastName?.charAt(0) || ''}
                  </span>
                </div>
                <span className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'User'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 container mx-auto px-4 pt-6 pb-20">
        {/* Sidebar */}
        <aside 
          className={`${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          } transform md:translate-x-0 fixed md:sticky top-16 left-0 bottom-0 w-64 bg-white dark:bg-surface-800 border-r border-surface-200 dark:border-surface-700 overflow-y-auto transition-transform duration-300 ease-in-out z-20 md:z-0`}
        >
          <nav className="p-4">
            <ul className="space-y-1">
              {[
                { id: 'dashboard', name: 'Dashboard', icon: ActivityIcon },
                { id: 'patients', name: 'Patients', icon: UsersIcon },
                { id: 'appointments', name: 'Appointments', icon: CalendarIcon },
                { id: 'records', name: 'Medical Records', icon: ClipboardListIcon },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => handleMenuItemClick(item.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeTab === item.id
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-700'
                    }`}
                  >
                    <item.icon 
                      size={20} 
                      className={activeTab === item.id ? 'text-primary' : ''}
                    />
                    <span className="ml-3 font-medium">{item.name}</span>
                    
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="sidebar-active-indicator"
                        className="ml-auto h-2 w-2 rounded-full bg-primary"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 md:ml-8">
          {/* Dashboard Content */}
          <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <h2 className="text-2xl font-bold text-surface-800 dark:text-surface-100 mb-2 md:mb-0">
                Dashboard
              </h2>
              
              <div className="flex space-x-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/patients/new')}
                  className="px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 border border-surface-300 dark:border-surface-600 rounded-lg flex items-center hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
                >
                  <UsersIcon size={16} className="mr-1" />
                  New Patient
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/appointments/new')}
                  className="px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg flex items-center hover:bg-primary-dark transition-colors duration-200"
                >
                  <PlusSquareIcon size={16} className="mr-1" />
                  New Appointment
                </motion.button>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <UsersIcon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-surface-500 dark:text-surface-400 text-sm">Total Patients</p>
                    <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                      {patientsLoading ? '...' : patients.length}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <CalendarIcon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-surface-500 dark:text-surface-400 text-sm">Scheduled Appointments</p>
                    <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                      {appointmentsLoading ? '...' : appointments.filter(a => a.status === 'scheduled').length}
                    </p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-surface-800 rounded-xl p-4 shadow-sm border border-surface-200 dark:border-surface-700"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                    <CheckCircleIcon size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-surface-500 dark:text-surface-400 text-sm">Completed Appointments</p>
                    <p className="text-2xl font-bold text-surface-800 dark:text-surface-100">
                      {appointmentsLoading ? '...' : appointments.filter(a => a.status === 'completed').length}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
            
            {/* Upcoming Appointments */}
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700 mb-6">
              <div className="border-b border-surface-200 dark:border-surface-700 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                    Upcoming Appointments
                  </h3>
                  <button 
                    onClick={() => navigate('/appointments')}
                    className="text-primary hover:text-primary-dark text-sm flex items-center"
                  >
                    View All <ArrowRightIcon size={16} className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {appointmentsLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-surface-600 dark:text-surface-400">Loading appointments...</p>
                  </div>
                ) : appointments.filter(a => a.status === 'scheduled').length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4 mx-auto">
                      <CalendarIcon size={24} className="text-surface-400 dark:text-surface-500" />
                    </div>
                    <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No upcoming appointments</h4>
                    <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
                      There are no scheduled appointments at the moment. Create a new appointment to get started.
                    </p>
                    <button
                      onClick={() => navigate('/appointments/new')}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                    >
                      Schedule Appointment
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-surface-200 dark:divide-surface-700">
                    {appointments
                      .filter(appointment => appointment.status === 'scheduled')
                      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                      .slice(0, 5)
                      .map((appointment) => {
                        // Find the patient info from expanded data or patient list
                        const patientInfo = appointment.patientInfo || 
                          patients.find(p => p.Id === appointment.patient);
                          
                        return (
                          <li key={appointment.Id} className="py-3 px-2 hover:bg-surface-50 dark:hover:bg-surface-700/50 rounded-lg transition-colors duration-150">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-300">
                                  <UserIcon size={18} />
                                </div>
                                <div className="ml-3">
                                  <p className="font-medium text-surface-800 dark:text-surface-100">
                                    {patientInfo?.Name || 'Unknown Patient'}
                                  </p>
                                  <div className="flex items-center text-xs text-surface-500 dark:text-surface-400 mt-1">
                                    <CalendarIcon size={12} className="mr-1" />
                                    <span>{formatDateTime(appointment.appointmentDate)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClasses(appointment.status)}`}>
                                  <ClockIcon size={12} className="mr-1" />
                                  Scheduled
                                </span>
                                <button
                                  onClick={() => navigate(`/appointments/${appointment.Id}`)}
                                  className="text-xs text-primary dark:text-primary-light hover:underline mt-1 block"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                  </ul>
                )}
              </div>
            </div>
            
            {/* Recent Patients */}
            <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
              <div className="border-b border-surface-200 dark:border-surface-700 p-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-surface-100">
                    Recent Patients
                  </h3>
                  <button 
                    onClick={() => navigate('/patients')}
                    className="text-primary hover:text-primary-dark text-sm flex items-center"
                  >
                    View All <ArrowRightIcon size={16} className="ml-1" />
                  </button>
                </div>
              </div>
              
              <div className="p-4">
                {patientsLoading ? (
                  <div className="py-8 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-surface-600 dark:text-surface-400">Loading patients...</p>
                  </div>
                ) : patients.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-surface-100 dark:bg-surface-700 flex items-center justify-center mb-4 mx-auto">
                      <UsersIcon size={24} className="text-surface-400 dark:text-surface-500" />
                    </div>
                    <h4 className="text-lg font-medium text-surface-800 dark:text-surface-100 mb-2">No patients found</h4>
                    <p className="text-surface-500 dark:text-surface-400 max-w-sm mx-auto">
                      There are no patients in the system yet. Add a new patient to get started.
                    </p>
                    <button
                      onClick={() => navigate('/patients/new')}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200"
                    >
                      Add New Patient
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          <th className="px-4 py-2">Name</th>
                          <th className="px-4 py-2">Age</th>
                          <th className="px-4 py-2">Gender</th>
                          <th className="px-4 py-2">Phone</th>
                          <th className="px-4 py-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-200 dark:divide-surface-700">
                        {patients.slice(0, 5).map((patient) => (
                          <tr key={patient.Id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors duration-150">
                            <td className="px-4 py-3 text-sm font-medium text-surface-800 dark:text-surface-100">
                              {patient.Name}
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-400">
                              {patient.age}
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-400">
                              {patient.gender}
                            </td>
                            <td className="px-4 py-3 text-sm text-surface-600 dark:text-surface-400">
                              {patient.phone}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => navigate(`/patients/${patient.Id}`)}
                                className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition-colors duration-200"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default Dashboard;