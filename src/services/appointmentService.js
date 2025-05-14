import { 
  fetchRecords, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from './apiService';

// Appointment table name from the provided schema
const TABLE_NAME = 'appointment';

// Field mapping for appointment table - maps UI field names to database field names
const fieldMapping = {
  id: 'Id',
  name: 'Name',
  patientId: 'patient',
  appointmentDate: 'appointmentDate',
  status: 'status',
  reason: 'reason',
  tags: 'Tags',
  owner: 'Owner',
  createdOn: 'CreatedOn',
  isDeleted: 'IsDeleted'
};

// Get all appointments with optional filtering and pagination
export const getAppointments = async (filters = {}, page = 1, limit = 20) => {
  const queryParams = {
    Fields: [
      { Field: { Name: 'Id' } },
      { Field: { Name: 'Name' } },
      { Field: { Name: 'patient' } },
      { Field: { Name: 'appointmentDate' } },
      { Field: { Name: 'status' } },
      { Field: { Name: 'reason' } },
      { Field: { Name: 'CreatedOn' } }
    ],
    expands: [
      {
        name: "patient",
        alias: "patientInfo"
      }
    ],
    pagingInfo: {
      limit: limit,
      offset: (page - 1) * limit
    },
    where: [],
    orderBy: [
      {
        field: "appointmentDate",
        direction: "DESC"
      }
    ]
  };

  // Add filters if provided
  if (filters.patientId) {
    queryParams.where.push({
      fieldName: 'patient',
      Operator: 'ExactMatch',
      values: [filters.patientId]
    });
  }

  if (filters.status) {
    queryParams.where.push({
      fieldName: 'status',
      Operator: 'ExactMatch',
      values: [filters.status]
    });
  }

  if (filters.dateFrom && filters.dateTo) {
    queryParams.where.push({
      fieldName: 'appointmentDate',
      Operator: 'Between',
      values: [filters.dateFrom, filters.dateTo]
    });
  } else if (filters.dateFrom) {
    queryParams.where.push({
      fieldName: 'appointmentDate',
      Operator: 'GreaterThanOrEquals',
      values: [filters.dateFrom]
    });
  } else if (filters.dateTo) {
    queryParams.where.push({
      fieldName: 'appointmentDate',
      Operator: 'LessThanOrEquals',
      values: [filters.dateTo]
    });
  }

  // Search in reason field
  if (filters.searchTerm) {
    queryParams.where.push({
      fieldName: 'reason',
      Operator: 'Contains',
      values: [filters.searchTerm]
    });
  }

  // Hide deleted records
  queryParams.where.push({
    fieldName: 'IsDeleted',
    Operator: 'ExactMatch',
    values: [false]
  });

  return await fetchRecords(TABLE_NAME, queryParams);
};

// Get an appointment by ID
export const getAppointmentById = async (id) => {
  const queryParams = {
    Fields: [
      { Field: { Name: 'Id' } },
      { Field: { Name: 'Name' } },
      { Field: { Name: 'patient' } },
      { Field: { Name: 'appointmentDate' } },
      { Field: { Name: 'status' } },
      { Field: { Name: 'reason' } },
      { Field: { Name: 'CreatedOn' } },
      { Field: { Name: 'Owner' } }
    ],
    expands: [
      {
        name: "patient",
        alias: "patientInfo"
      }
    ]
  };
  
  return await getRecordById(TABLE_NAME, id, queryParams);
};

// Create a new appointment
export const createAppointment = async (appointmentData) => {
  // Transform UI field names to database field names
  const transformedData = {};
  Object.keys(appointmentData).forEach(key => {
    if (fieldMapping[key]) {
      transformedData[fieldMapping[key]] = appointmentData[key];
    } else {
      transformedData[key] = appointmentData[key];
    }
  });
  
  const params = {
    records: [transformedData]
  };
  
  return await createRecord(TABLE_NAME, params);
};

// Update an existing appointment
export const updateAppointment = async (appointmentData) => {
  // Ensure Id exists for update operation
  if (!appointmentData.Id && !appointmentData.id) {
    throw new Error('Appointment ID is required for update operation');
  }
  
  // Transform UI field names to database field names
  const transformedData = {};
  Object.keys(appointmentData).forEach(key => {
    if (fieldMapping[key]) {
      transformedData[fieldMapping[key]] = appointmentData[key];
    } else {
      transformedData[key] = appointmentData[key];
    }
  });
  
  // Ensure ID is set in the correct field name
  if (!transformedData.Id && appointmentData.id) {
    transformedData.Id = appointmentData.id;
  }
  
  const params = {
    records: [transformedData]
  };
  
  return await updateRecord(TABLE_NAME, params);
};

// Delete an appointment (can be one or multiple)
export const deleteAppointment = async (appointmentIds) => {
  // Convert to array if single ID is provided
  const ids = Array.isArray(appointmentIds) ? appointmentIds : [appointmentIds];
  
  const params = {
    RecordIds: ids
  };
  
  return await deleteRecord(TABLE_NAME, params);
};