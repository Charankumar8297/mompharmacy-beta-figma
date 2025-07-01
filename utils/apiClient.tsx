interface ApiClientOptions extends RequestInit {
    headers?: Record<string, string>;
    body?: any;
}

const API_BASE_URL = 'http://192.168.1.91:3000';

async function apiClient(path: string, options: ApiClientOptions = {}) {
    const cleanPath = path.replace(/^\/+|\/+$/g, '');
    const url = `${API_BASE_URL}/${cleanPath}`;

    console.log('API Request:', {
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
            body: options.body && typeof options.body === 'object' 
                ? JSON.stringify(options.body) 
                : options.body
        });

        const responseText = await response.text();
        let responseData;
        
        try {
            responseData = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
            console.warn('Non-JSON response:', responseText);
            responseData = responseText;
        }

        console.log(`API Response [${response.status} ${response.statusText}]:`, {
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
        console.error('API Error:', {
            url,
            error: error.message,
            ...(error.response && { response: error.response }),
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
        throw error;
    }
}
export default apiClient