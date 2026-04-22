import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const authService = {
  signup: async (email, password, fullName) => {
    const response = await api.post('/auth/signup', { email, password, fullName });
    return response.data;
  },
  verify: async (email, code) => {
    const response = await api.post('/auth/verify', { email, code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.uid);
    }
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.uid);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    window.location.href = '/';
  }
};

export const studentService = {
  getStudent: async (uid) => {
    const response = await api.get(`/students/${uid}`);
    return response.data;
  },
  updateStudent: async (uid, data) => {
    const response = await api.put(`/students/${uid}`, data);
    return response.data;
  },
  saveFocusSession: async (uid, minutes) => {
    const response = await api.post(`/students/${uid}/focus`, { minutes });
    return response.data;
  }
};

export const attendanceService = {
  getAttendance: async (uid) => {
    const response = await api.get(`/students/${uid}/attendance`);
    return response.data;
  },
  updateAttendance: async (uid, courseCode, data) => {
    const response = await api.put(`/students/${uid}/attendance/${courseCode}`, data);
    return response.data;
  },
  getTimetable: async (docId) => {
    const response = await api.get(`/students/timetable/${docId}`);
    return response.data;
  }
};

export const reminderService = {
  getSmartReminders: async (uid) => {
    const response = await api.get(`/reminders/${uid}`);
    return response.data;
  },
  getLibraryBooks: async (uid) => {
    const response = await api.get(`/reminders/${uid}/library`);
    return response.data;
  },
  addLibraryBook: async (uid, title, dueDate) => {
    const response = await api.post(`/reminders/${uid}/library`, { title, dueDate });
    return response.data;
  },
  deleteLibraryBook: async (uid, bookId) => {
    const response = await api.delete(`/reminders/${uid}/library/${bookId}`);
    return response.data;
  }
};

export default api;
