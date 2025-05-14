import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { createPatient, updatePatient } from '../services/patientService';
import { useDispatch } from 'react-redux';
import { addPatient, updatePatient as updatePatientAction } from '../store/patientSlice';
import getIcon from '../utils/iconUtils';

const XCircleIcon = getIcon('XCircle');

function PatientForm({ patient, onClose, isEditing = false }) {
  const dispatch = useDispatch();
  
  const [formData, setFormData] = useState({
    Id: '',
    Name: '',
    age: '',
    gender: 'Female',
    phone: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient && isEditing) {
      setFormData({
        Id: patient.Id,
        Name: patient.Name || '',
        age: patient.age || '',
        gender: patient.gender || 'Female',
        phone: patient.phone || '',
      });
    }
  }, [patient, isEditing]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.Name.trim()) {
      newErrors.Name = 'Patient name is required';
    }
    
    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (formData.age < 0 || formData.age > 120) {
      newErrors.age = 'Age must be between 0 and 120';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s()+\-]+$/.test(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
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
        // Update existing patient
        const response = await updatePatient(formData);
        if (response.success) {
          const updatedPatient = response.results[0].data;
          dispatch(updatePatientAction(updatedPatient));
          toast.success("Patient updated successfully");
          onClose();
        } else {
          toast.error(response.message || "Failed to update patient");
        }
      } else {
        // Create new patient
        const response = await createPatient(formData);
        if (response.success) {
          const newPatient = response.results[0].data;
          dispatch(addPatient(newPatient));
          toast.success("Patient created successfully");
          onClose();
        } else {
          toast.error(response.message || "Failed to create patient");
        }
      }
    } catch (error) {
      console.error("Error saving patient:", error);
      toast.error(error.message || "An error occurred while saving the patient");
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
          {isEditing ? 'Edit Patient' : 'New Patient'}
        </h4>
        <button
          onClick={onClose}
          className="text-surface-500 hover:text-surface-700 dark:text-surface-400 dark:hover:text-surface-200"
        >
          <XCircleIcon size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="Name" className="label">Full Name</label>
            <input
              id="Name"
              name="Name"
              type="text"
              value={formData.Name}
              onChange={handleChange}
              className={`input ${errors.Name ? 'border-red-500' : ''}`}
              placeholder="Patient's full name"
            />
            {errors.Name && <p className="text-red-500 text-xs mt-1">{errors.Name}</p>}
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
                onChange={handleChange}
                className={`input ${errors.age ? 'border-red-500' : ''}`}
                placeholder="Age"
              />
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div>
              <label htmlFor="gender" className="label">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
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
              onChange={handleChange}
              className={`input ${errors.phone ? 'border-red-500' : ''}`}
              placeholder="(555) 123-4567"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          <div className="pt-4 flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="flex-1 btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Patient' : 'Create Patient'}
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
    </motion.div>
  );
}

export default PatientForm;