import {create} from "zustand";

const useApiData2 = create((set) => ({
    data: [],
    isResponese: false,

    apiReq: async (url, formData) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                // Don't set Content-Type header when sending FormData
                // The browser will set it automatically with the correct boundary
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            set({ isResponese: true });
            set({ data: result.data || result });
            console.log("data", result.data);
            return result;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }
}))

export default useApiData2