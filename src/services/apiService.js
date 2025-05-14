// This service handles base API operations using the ApperSDK

// Initialize ApperClient
const initializeClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Fetch records with filtering, pagination, etc.
export const fetchRecords = async (tableName, queryParams = {}) => {
  try {
    const apperClient = initializeClient();
    const response = await apperClient.fetchRecords(tableName, queryParams);
    return response;
  } catch (error) {
    console.error(`Error fetching ${tableName} records:`, error);
    throw error;
  }
};

// Get a single record by ID
export const getRecordById = async (tableName, recordId, queryParams = {}) => {
  try {
    const apperClient = initializeClient();
    const response = await apperClient.getRecordById(tableName, recordId, queryParams);
    return response;
  } catch (error) {
    console.error(`Error fetching ${tableName} record with ID ${recordId}:`, error);
    throw error;
  }
};

// Create one or more records
export const createRecord = async (tableName, params) => {
  try {
    const apperClient = initializeClient();
    const response = await apperClient.createRecord(tableName, params);
    return response;
  } catch (error) {
    console.error(`Error creating ${tableName} record:`, error);
    throw error;
  }
};

// Update one or more records
export const updateRecord = async (tableName, params) => {
  try {
    const apperClient = initializeClient();
    const response = await apperClient.updateRecord(tableName, params);
    return response;
  } catch (error) {
    console.error(`Error updating ${tableName} record:`, error);
    throw error;
  }
};

// Delete one or more records
export const deleteRecord = async (tableName, params) => {
  try {
    const apperClient = initializeClient();
    const response = await apperClient.deleteRecord(tableName, params);
    return response;
  } catch (error) {
    console.error(`Error deleting ${tableName} record:`, error);
    throw error;
  }
};