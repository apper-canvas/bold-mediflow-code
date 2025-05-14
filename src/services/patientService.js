import { 
  fetchRecords, 
  getRecordById, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from './apiService';

// Patient table name from the provided schema
const TABLE_NAME = 'patient';

// Field mapping for patient table - maps UI field names to database field names
const fieldMapping = {
  id: 'Id',
  name: 'Name',
  age: 'age',
  gender: 'gender',
  phone: 'phone',
  tags: 'Tags',
  owner: 'Owner',
  createdOn: 'CreatedOn',
  isDeleted: 'IsDeleted'
};

// Get all patients with optional filtering and pagination
export const getPatients = async (filters = {}, page = 1, limit = 20) => {
  const queryParams = {
    Fields: [
      { Field: { Name: 'Id' } },
      { Field: { Name: 'Name' } },
      { Field: { Name: 'age' } },
      { Field: { Name: 'gender' } },
      { Field: { Name: 'phone' } },
      { Field: { Name: 'Tags' } },
      { Field: { Name: 'CreatedOn' } }
    ],
    pagingInfo: {
      limit: limit,
      offset: (page - 1) * limit
    },
    where: []
  };

  // Add filters if provided
  if (filters.name) {
    queryParams.where.push({
      fieldName: 'Name',
      Operator: 'Contains',
      values: [filters.name]
    });
  }

  if (filters.gender) {
    queryParams.where.push({
      fieldName: 'gender',
      Operator: 'ExactMatch',
      values: [filters.gender]
    });
  }

  if (filters.ageMin && filters.ageMax) {
    queryParams.where.push({
      fieldName: 'age',
      Operator: 'Between',
      values: [filters.ageMin, filters.ageMax]
    });
  } else if (filters.ageMin) {
    queryParams.where.push({
      fieldName: 'age',
      Operator: 'GreaterThanOrEquals',
      values: [filters.ageMin]
    });
  } else if (filters.ageMax) {
    queryParams.where.push({
      fieldName: 'age',
      Operator: 'LessThanOrEquals',
      values: [filters.ageMax]
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

// Get a patient by ID
export const getPatientById = async (id) => {
  const queryParams = {
    Fields: [
      { Field: { Name: 'Id' } },
      { Field: { Name: 'Name' } },
      { Field: { Name: 'age' } },
      { Field: { Name: 'gender' } },
      { Field: { Name: 'phone' } },
      { Field: { Name: 'Tags' } },
      { Field: { Name: 'CreatedOn' } },
      { Field: { Name: 'Owner' } }
    ]
  };
  
  return await getRecordById(TABLE_NAME, id, queryParams);
};

// Create a new patient
export const createPatient = async (patientData) => {
  // Transform UI field names to database field names
  const transformedData = {};
  Object.keys(patientData).forEach(key => {
    if (fieldMapping[key]) {
      transformedData[fieldMapping[key]] = patientData[key];
    } else {
      transformedData[key] = patientData[key];
    }
  });
  
  const params = {
    records: [transformedData]
  };
  
  return await createRecord(TABLE_NAME, params);
};

// Update an existing patient
export const updatePatient = async (patientData) => {
  // Ensure Id exists for update operation
  if (!patientData.Id && !patientData.id) {
    throw new Error('Patient ID is required for update operation');
  }
  
  // Transform UI field names to database field names
  const transformedData = {};
  Object.keys(patientData).forEach(key => {
    if (fieldMapping[key]) {
      transformedData[fieldMapping[key]] = patientData[key];
    } else {
      transformedData[key] = patientData[key];
    }
  });
  
  // Ensure ID is set in the correct field name
  if (!transformedData.Id && patientData.id) {
    transformedData.Id = patientData.id;
  }
  
  const params = {
    records: [transformedData]
  };
  
  return await updateRecord(TABLE_NAME, params);
};

// Delete a patient (can be one or multiple)
export const deletePatient = async (patientIds) => {
  // Convert to array if single ID is provided
  const ids = Array.isArray(patientIds) ? patientIds : [patientIds];
  
  const params = {
    RecordIds: ids
  };
  
  return await deleteRecord(TABLE_NAME, params);
};