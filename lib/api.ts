// Utility functions for API calls

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // Important for cookies
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'An error occurred',
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Network error occurred',
    };
  }
}

// Authentication APIs
export const authApi = {
  login: async (email: string, password: string) => {
    return fetchApi('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth?: string;
    gender?: string;
    phone?: string;
  }) => {
    return fetchApi('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: async () => {
    return fetchApi('/api/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async () => {
    return fetchApi('/api/auth/me');
  },
};

// Clinic APIs
export const clinicApi = {
  getAll: async (filters?: { specialty?: string; insurance?: string }) => {
    const params = new URLSearchParams();
    if (filters?.specialty) params.set('specialty', filters.specialty);
    if (filters?.insurance) params.set('insurance', filters.insurance);
    
    return fetchApi(`/api/clinics?${params.toString()}`);
  },

  getById: async (id: string) => {
    return fetchApi(`/api/clinics/${id}`);
  },

  create: async (clinicData: any) => {
    return fetchApi('/api/clinics', {
      method: 'POST',
      body: JSON.stringify(clinicData),
    });
  },

  update: async (id: string, clinicData: any) => {
    return fetchApi(`/api/clinics/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clinicData),
    });
  },

  delete: async (id: string) => {
    return fetchApi(`/api/clinics/${id}`, {
      method: 'DELETE',
    });
  },
};

// Diagnosis APIs
export const diagnosisApi = {
  create: async (data: { symptoms: string; age: number; gender: string }) => {
    return fetchApi('/api/diagnoses', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getAll: async () => {
    return fetchApi('/api/diagnoses');
  },
};
