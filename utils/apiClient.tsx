interface ApiClientOptions extends RequestInit {
    headers?: Record<string, string>;
    body?: any;
}

const API_BASE_URL = 'http://13.233.194.93:3000';

async function apiClient(path: string, options: ApiClientOptions = {}) {
    // Remove leading/trailing slashes from path
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const url = `${API_BASE_URL}/${cleanPath}`;
    
    // Log the request
    console.log('📡 API Request:', {
        method: options.method || 'GET',
        url,
        headers: options.headers,
        body: options.body
    });

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(options.headers || {})
            },
            // Ensure body is stringified if it's an object
            body: options.body && typeof options.body === 'object' 
                ? JSON.stringify(options.body) 
                : options.body
        });

        const responseText = await response.text();
        let responseData;
        
        // Try to parse JSON response
        try {
            responseData = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
            console.warn('⚠️ Non-JSON response:', responseText);
            responseData = responseText;
        }

        // Log the response
        console.log(`📡 API Response [${response.status} ${response.statusText}]:`, {
            url,
            status: response.status,
            data: responseData
        });

        if (!response.ok) {
            const error = new Error(response.statusText || 'API request failed');
            (error as any).response = {
                status: response.status,
                data: responseData
            };
            throw error;
        }

        return responseData;
    } catch (error) {
        console.error('❌ API Error:', {
            url,
            error: error.message,
            ...(error.response && { response: error.response }),
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
        throw error; // Re-throw to allow error handling in components
    }
}
export default apiClient