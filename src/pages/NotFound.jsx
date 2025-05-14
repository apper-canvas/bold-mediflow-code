import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Pre-define icons
const HomeIcon = getIcon('Home');
const AlertCircleIcon = getIcon('AlertCircle');

function NotFound({ isDarkMode, toggleDarkMode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 bg-surface-50 dark:bg-surface-900"
    >
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            className="mx-auto w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-6"
          >
            <AlertCircleIcon size={40} className="text-red-500 dark:text-red-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-surface-800 dark:text-surface-100 mb-2"
          >
            404
          </motion.h1>
          
          <motion.h2
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-bold text-surface-700 dark:text-surface-200 mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-surface-600 dark:text-surface-300 mb-8 max-w-sm mx-auto"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
            >
              <HomeIcon size={18} className="mr-2" />
              Back to Dashboard
            </Link>
          </motion.div>
        </div>
      </div>
      
      <div className="mt-12 text-center text-sm text-surface-500 dark:text-surface-400">
        <p>
          MediFlow Hospital Management System
        </p>
      </div>
    </motion.div>
  );
}

export default NotFound;