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

// Interceptor to log exact backend errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.data) {
      console.error("Backend Error Details:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (email, password, fullName, program, branch) => {
    const response = await api.post('/auth/signup', { email, password, fullName, program, branch });
    return response.data;
  },
  verify: async (email, code) => {
    const response = await api.post('/auth/verify', { email, code });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.id);
    }
    return response.data;
  },
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('uid', response.data.id);
    }
    return response.data;
  },
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  resetPassword: async (email, code, newPassword) => {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
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
  },
  updateWorkingHours: async (uid, workingHours) => {
    const response = await api.put(`/students/${uid}/working-hours`, { workingHours });
    return response.data;
  },
  getPastSemesters: async (uid) => {
    const response = await api.get(`/students/${uid}/pastSemesters`);
    return response.data;
  },
  addPastSemester: async (uid, data) => {
    const response = await api.post(`/students/${uid}/pastSemesters`, data);
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
  },
  updateTimetable: async (docId, schedule) => {
    const response = await api.put(`/students/timetable/${docId}`, { schedule });
    return response.data;
  },
  getCurriculum: async (docId) => {
    const response = await api.get(`/students/curriculum/${docId}`);
    return response.data;
  },
  updateCurriculum: async (docId, courses) => {
    const response = await api.put(`/students/curriculum/${docId}`, { courses });
    return response.data;
  }
};

export const documentService = {
  getDocuments: async (uid) => {
    const response = await api.get(`/students/${uid}/documents`);
    return response.data;
  },
  uploadDocument: async (uid, name, fileData) => {
    const response = await api.post(`/students/${uid}/documents`, { name, fileData });
    return response.data;
  },
  deleteDocument: async (uid, docId) => {
    const response = await api.delete(`/students/${uid}/documents/${docId}`);
    return response.data;
  }
};

export const leetcodeService = {
  linkUsername: async (uid, username) => {
    const response = await api.put(`/students/${uid}/leetcode/link`, { username });
    return response.data;
  },
  getChallenge: async (uid) => {
    const response = await api.get(`/students/${uid}/leetcode/challenge`);
    return response.data;
  },
  verifyChallenge: async (uid) => {
    const response = await api.post(`/students/${uid}/leetcode/verify`);
    return response.data;
  }
};

export const codeforcesService = {
  linkUsername: async (uid, username) => {
    const response = await api.put(`/students/${uid}/codeforces/link`, { username });
    return response.data;
  },
  getChallenge: async (uid) => {
    const response = await api.get(`/students/${uid}/codeforces/challenge`);
    return response.data;
  },
  verifyChallenge: async (uid) => {
    const response = await api.post(`/students/${uid}/codeforces/verify`);
    return response.data;
  }
};

export const atcoderService = {
  linkUsername: async (uid, username) => {
    const response = await api.put(`/students/${uid}/atcoder/link`, { username });
    return response.data;
  },
  getChallenge: async (uid) => {
    const response = await api.get(`/students/${uid}/atcoder/challenge`);
    return response.data;
  },
  verifyChallenge: async (uid) => {
    const response = await api.post(`/students/${uid}/atcoder/verify`);
    return response.data;
  }
};

export const codechefService = {
  linkUsername: async (uid, username) => {
    const response = await api.put(`/students/${uid}/codechef/link`, { username });
    return response.data;
  },
  getChallenge: async (uid) => {
    const response = await api.get(`/students/${uid}/codechef/challenge`);
    return response.data;
  },
  verifyChallenge: async (uid) => {
    const response = await api.post(`/students/${uid}/codechef/verify`);
    return response.data;
  }
};

export const contestService = {
  getUpcoming: async () => {
    const response = await api.get(`/students/hub/contests/upcoming`);
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

export const plannerService = {
  getTasks: async (uid) => {
    const response = await api.get(`/planner/${uid}`);
    return response.data;
  },
  addTask: async (uid, data) => {
    const response = await api.post(`/planner/${uid}`, data);
    return response.data;
  },
  updateTask: async (uid, taskId, data) => {
    const response = await api.put(`/planner/${uid}/${taskId}`, data);
    return response.data;
  },
  deleteTask: async (uid, taskId) => {
    const response = await api.delete(`/planner/${uid}/${taskId}`);
    return response.data;
  },
  getScheduleSuggestion: async (uid, data) => {
    const response = await api.post(`/planner/${uid}/schedule-suggestion`, data);
    return response.data;
  }
};

export const analyticsService = {
  getWeeklyAnalytics: async (uid) => {
    const response = await api.get(`/analytics/${uid}/weekly`);
    return response.data;
  },
  getDailyAnalytics: async (uid) => {
    const response = await api.get(`/analytics/${uid}/daily`);
    return response.data;
  },
  getSmartAttendance: async (uid) => {
    const response = await api.get(`/analytics/${uid}/smart-attendance`);
    return response.data;
  },
  getAttendanceTimeline: async (uid) => {
    const response = await api.get(`/analytics/${uid}/attendance-timeline`);
    return response.data;
  },
  getLeaderboard: async () => {
    const response = await api.get(`/analytics/leaderboard`);
    return response.data;
  }
};

export const dsaService = {
  submitProblem: async (uid, data) => {
    const response = await api.post(`/dsa/${uid}/submit`, data);
    return response.data;
  },
  getProgress: async (uid) => {
    const response = await api.get(`/dsa/${uid}/progress`);
    return response.data;
  },
  getDailySuggestion: async (uid) => {
    const response = await api.get(`/dsa/${uid}/daily-suggestion`);
    return response.data;
  }
};

export default api;
