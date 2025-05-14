import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import MainFeature from '../components/MainFeature';
import PatientFeatures from '../components/PatientFeatures';

// Pre-define icons
const MenuIcon = getIcon('Menu');
const XIcon = getIcon('X');
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');
const PlusSquareIcon = getIcon('PlusSquare');
const UsersIcon = getIcon('Users');
const CalendarIcon = getIcon('Calendar');
const ClipboardListIcon = getIcon('ClipboardList');
const ActivityIcon = getIcon('Activity');

function Home({ isDarkMode, toggleDarkMode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showQuickAccess, setShowQuickAccess] = useState(true);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleQuickAccess = () => {
    setShowQuickAccess(!showQuickAccess);
    toast.info(
      showQuickAccess 
      ? "Quick access panel hidden" 
      : "Quick access panel shown",
      { icon: showQuickAccess ? "🙈" : "👀" }
    );
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
                onClick={toggleMenu}
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
              
              <div className="hidden md:flex items-center">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center">
                  <span className="font-medium text-sm">DR</span>
                </div>
                <span className="ml-2 text-sm font-medium text-surface-700 dark:text-surface-300">Dr. Demo</span>
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
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMenuOpen(false);
                    }}
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
                {activeTab === 'dashboard' && 'Dashboard'}
                {activeTab === 'patients' && 'Patient Management'}
                {activeTab === 'appointments' && 'Appointment Schedule'}
                {activeTab === 'records' && 'Medical Records'}
              </h2>
              
              <div className="flex space-x-2">
                <button 
                  onClick={toggleQuickAccess}
                  className="px-3 py-2 text-sm rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors duration-200"
                >
                  {showQuickAccess ? 'Hide' : 'Show'} Quick Access
                </button>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-3 py-2 text-sm font-medium bg-primary text-white rounded-lg flex items-center hover:bg-primary-dark transition-colors duration-200"
                >
                  <PlusSquareIcon size={16} className="mr-1" />
                  New Entry
                </motion.button>
              </div>
            </div>
            
            {/* Quick Access Section */}
            {showQuickAccess && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
              >
                {[
                  { title: "Add Patient", icon: UsersIcon, color: "from-blue-400 to-blue-600" },
                  { title: "Schedule Appointment", icon: CalendarIcon, color: "from-purple-400 to-purple-600" },
                  { title: "Create Medical Record", icon: ClipboardListIcon, color: "from-teal-400 to-teal-600" }
                ].map((card, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 shadow-sm"
                  >
                    <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                    <div className="p-4 flex items-center">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white`}>
                        <card.icon size={20} />
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium text-surface-800 dark:text-surface-100">{card.title}</h3>
                        <p className="text-xs text-surface-500 dark:text-surface-400">Quick access</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
            
            {/* Main Feature Component */}
            <MainFeature />
            
            {/* Patient Features */}
            <PatientFeatures />
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

export default Home;