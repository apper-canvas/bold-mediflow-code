import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { createAppointment, updateAppointment } from '../services/appointmentService';
import { getPatients } from '../services/patientService';
import { addAppointment, updateAppointment as updateAppointmentAction } from '../store/appointmentSlice';
import getIcon from '../utils/iconUtils';

const XCircleIcon = getIcon('XCircle');
const CalendarIcon = getIcon('Calendar');
const UserIcon = getIcon('User');

function AppointmentForm({ appointment, onClose, isEditing = false }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    Id: '',
    Name: '',
    patient: '',
    appointmentDate: '',
    status: 'scheduled',
    reason: ''
  });
  
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load patients for dropdown
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const response = await getPatients();
        if (response && response.data) {
          setPatients(response.data);
        }
      } catch (error) {
        console.error("Error loading patients:", error);
        toast.error("Failed to load patients");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadPatients();
  }, []);

  useEffect(() => {
    if (appointment && isEditing) {
      // Format date for datetime-local input
      const formattedDate = appointment.appointmentDate ? 
        new Date(appointment.appointmentDate).toISOString().slice(0, 16) : '';
        
      setFormData({
        Id: appointment.Id,
        Name: appointment.Name || '',
        patient: appointment.patient || '',
        appointmentDate: formattedDate,
        status: appointment.status || 'scheduled',
        reason: appointment.reason || ''
      });
    }
  }, [appointment, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Appointment name is required';
    }
    
    if (!formData.patient) {
      newErrors.patient = 'Patient is required';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Date and time are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (isEditing) {
        // Update existing appointment
        const response = await updateAppointment(formData);
        if (response.success) {
          const updatedAppointment = response.results[0].data;
          dispatch(updateAppointmentAction(updatedAppointment));
          toast.success("Appointment updated successfully");
          onClose();
        } else {
          toast.error(response.message || "Failed to update appointment");
        }
      } else {
        // Create new appointment
        const response = await createAppointment(formData);
        if (response.success) {
          const newAppointment = response.results[0].data;
          dispatch(addAppointment(newAppointment));
          toast.success("Appointment created successfully");
          onClose();
        } else {
          toast.error(response.message || "Failed to create appointment");
        }
      }
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error(error.message || "An error occurred while saving the appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
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
          onClick={onClose}
          className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
        >
          <XCircleIcon size={20} />
        </button>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-r-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-surface-600 dark:text-surface-400">Loading...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="Name" className="label">Appointment Title</label>
              <input
                id="Name"
                name="Name"
                type="text"
                value={formData.Name}
                onChange={handleChange}
                className={`input ${errors.Name ? 'border-red-500' : ''}`}
                placeholder="E.g., Regular Checkup, Follow-up Visit"
              />
              {errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name}</p>}
            </div>

            <div>
              <label htmlFor="patient" className="label">Patient</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={16} className="text-surface-400" />
                </div>
                <select
                  id="patient"
                  name="patient"
                  value={formData.patient}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.patient ? 'border-red-500' : ''}`}
                >
                  <option value="">Select a patient</option>
                  {patients.map(patient => (
                    <option key={patient.Id} value={patient.Id}>
                      {patient.Name} ({patient.age} years, {patient.gender})
                    </option>
                  ))}
                </select>
              </div>
              {errors.patient && <p className="text-red-500 text-xs mt-1">{errors.patient}</p>}
            </div>

            <div>
              <label htmlFor="appointmentDate" className="label">Date & Time</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CalendarIcon size={16} className="text-surface-400" />
                </div>
                <input
                  id="appointmentDate"
                  name="appointmentDate"
                  type="datetime-local"
                  value={formData.appointmentDate}
                  onChange={handleChange}
                  className={`input pl-10 ${errors.appointmentDate ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.appointmentDate && <p className="text-red-500 text-xs mt-1">{errors.appointmentDate}</p>}
            </div>

            <div>
              <label htmlFor="status" className="label">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
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
                onChange={handleChange}
                rows="3"
                className="input resize-none"
                placeholder="Brief description of the appointment reason"
              ></textarea>
            </div>

            <div className="pt-4 flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Appointment' : 'Create Appointment'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </form>
      )}
    </motion.div>
  );
}

export default AppointmentForm;