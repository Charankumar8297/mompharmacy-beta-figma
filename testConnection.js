const apiClient = require('./utils/apiClient');

async function testConnection() {
    console.log('Testing connection to backend...');
    
    try {
        // Test a simple GET request
        console.log('Sending test request to /api/health...');
        const response = await apiClient('api/health');
        console.log('Response from server:', response);
        
        if (response) {
            console.log('✅ Successfully connected to the backend!');
        } else {
            console.log('❌ Received empty response from the server');
        }
    } catch (error) {
        console.error('❌ Connection test failed:', error);
    }
}

testConnection();
