import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  appointments: [],
  selectedAppointment: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    fetchAppointmentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchAppointmentsSuccess: (state, action) => {
      state.appointments = action.payload.data;
      state.totalCount = action.payload.count || action.payload.data.length;
      state.loading = false;
    },
    fetchAppointmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedAppointment: (state, action) => {
      state.selectedAppointment = action.payload;
    },
    addAppointment: (state, action) => {
      state.appointments.push(action.payload);
      state.totalCount += 1;
    },
    updateAppointment: (state, action) => {
      const index = state.appointments.findIndex(appointment => appointment.Id === action.payload.Id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
        if (state.selectedAppointment && state.selectedAppointment.Id === action.payload.Id) {
          state.selectedAppointment = action.payload;
        }
      }
    },
    deleteAppointment: (state, action) => {
      state.appointments = state.appointments.filter(appointment => appointment.Id !== action.payload);
      if (state.selectedAppointment && state.selectedAppointment.Id === action.payload) {
        state.selectedAppointment = null;
      }
      state.totalCount -= 1;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.selectedAppointment = null;
      state.totalCount = 0;
    }
  },
});

export const {
  fetchAppointmentsStart,
  fetchAppointmentsSuccess,
  fetchAppointmentsFailure,
  setSelectedAppointment,
  addAppointment,
  updateAppointment,
  deleteAppointment,
  clearAppointments
} = appointmentSlice.actions;

export default appointmentSlice.reducer;