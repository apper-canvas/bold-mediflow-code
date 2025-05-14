import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import patientReducer from './patientSlice';
import appointmentReducer from './appointmentSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    patients: patientReducer,
    appointments: appointmentReducer,
  },
});

export default store;