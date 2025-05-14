import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  patients: [],
  selectedPatient: null,
  loading: false,
  error: null,
  totalCount: 0,
};

export const patientSlice = createSlice({
  name: 'patients',
  initialState,
  reducers: {
    fetchPatientsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPatientsSuccess: (state, action) => {
      state.patients = action.payload.data;
      state.totalCount = action.payload.count || action.payload.data.length;
      state.loading = false;
    },
    fetchPatientsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedPatient: (state, action) => {
      state.selectedPatient = action.payload;
    },
    addPatient: (state, action) => {
      state.patients.push(action.payload);
      state.totalCount += 1;
    },
    updatePatient: (state, action) => {
      const index = state.patients.findIndex(patient => patient.Id === action.payload.Id);
      if (index !== -1) {
        state.patients[index] = action.payload;
        if (state.selectedPatient && state.selectedPatient.Id === action.payload.Id) {
          state.selectedPatient = action.payload;
        }
      }
    },
    deletePatient: (state, action) => {
      state.patients = state.patients.filter(patient => patient.Id !== action.payload);
      if (state.selectedPatient && state.selectedPatient.Id === action.payload) {
        state.selectedPatient = null;
      }
      state.totalCount -= 1;
    },
    clearPatients: (state) => {
      state.patients = [];
      state.selectedPatient = null;
      state.totalCount = 0;
    }
  },
});

export const {
  fetchPatientsStart,
  fetchPatientsSuccess,
  fetchPatientsFailure,
  setSelectedPatient,
  addPatient,
  updatePatient,
  deletePatient,
  clearPatients
} = patientSlice.actions;

export default patientSlice.reducer;