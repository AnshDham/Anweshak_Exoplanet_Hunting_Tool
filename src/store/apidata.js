import {create} from "zustand";

const useApiData = create((set) => ({
    data: null,
    loading: false,
    error: null,
    isResponse: false,

    apiReq: async (url, payload) => {
        // Reset state before a new request
        set({ loading: true, error: null, isResponse: false, data: null });
        try {
            const isFormData = payload instanceof FormData;

            const response = await fetch(url, {
                method: 'POST',
                headers: isFormData ? {} : { 'Content-Type': 'application/json' },
                body: isFormData ? payload : JSON.stringify(payload),
            });
            
            const result = await response.json();

            if (!response.ok) {
                // Use the error message from the API if available
                throw new Error(result.message || `HTTP error! status: ${response.status}`);
            }
            
            set({ data: result, isResponse: true });
            console.log("Data stored in Zustand:", result);
            return result;

        } catch (error) {
            console.error('API Request Error:', error);
            set({ error: error });
            // Re-throw the error so the component can catch it if needed
            throw error; 
        } finally {
            set({ loading: false });
        }
    }
}));

export default useApiData;
