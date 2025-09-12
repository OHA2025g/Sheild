import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

// PUBLIC API FUNCTIONS
export const api = {
  // Contact form submission
  submitContactForm: async (formData) => {
    const response = await apiClient.post('/contact', {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
      inquiryType: formData.inquiryType || 'general'
    });
    return response.data;
  },

  // Volunteer registration
  submitVolunteerForm: async (formData) => {
    const response = await apiClient.post('/volunteer', formData);
    return response.data;
  },

  // Newsletter signup
  subscribeNewsletter: async (email) => {
    const response = await apiClient.post('/newsletter/subscribe', { email });
    return response.data;
  },

  // Get published news
  getPublishedNews: async () => {
    const response = await apiClient.get('/news');
    return response.data;
  },

  getNewsById: async (id) => {
  const response = await apiClient.get(`/news/${id}`);
  return response.data;
  },

    // Get published blogs
  getPublishedBlogs: async () => {
    const response = await apiClient.get('/blogs');
    return response.data;
  },

  getBlogById: async (id) => {
  const response = await apiClient.get(`/blogs/${id}`);
  return response.data;
  },

  // Get impact statistics
  getImpactStats: async () => {
    const response = await apiClient.get('/impact-stats');
    return response.data;
  },

  // ADMIN API FUNCTIONS
  admin: {
    // Admin login
    login: async (credentials) => {
      const response = await apiClient.post('/admin/login', credentials);
      if (response.data.success && response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
      }
      return response.data;
    },

    // Admin logout
    logout: () => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
    },

    // Get contacts
    getContacts: async () => {
      const response = await apiClient.get('/admin/contacts');
      return response.data;
    },

    // Get volunteers
    getVolunteers: async () => {
      const response = await apiClient.get('/admin/volunteers');
      return response.data;
    },

    // Get newsletter subscribers
    getNewsletterSubscribers: async () => {
      const response = await apiClient.get('/admin/newsletters');
      return response.data;
    },

    // Get all news (including drafts)
    getAllNews: async () => {
      const response = await apiClient.get('/admin/news');
      return response.data;
    },

    // Create news
    createNews: async (newsData) => {
      const response = await apiClient.post('/admin/news', newsData);
      return response.data;
    },

    // Update news
    updateNews: async (id, newsData) => {
      const response = await apiClient.put(`/admin/news/${id}`, newsData);
      return response.data;
    },

    // Delete news
    deleteNews: async (id) => {
      const response = await apiClient.delete(`/admin/news/${id}`);
      return response.data;
    },

    // Get all blogs (including drafts)
    getAllBlogs: async () => {
      const response = await apiClient.get('/admin/blogs');
      return response.data;
    },

    // Create a blog
    createBlog: async (blogData) => {
      const response = await apiClient.post('/admin/blogs', blogData);
      return response.data;
    },

    // Update a blog
    updateBlog: async (id, blogData) => {
      const response = await apiClient.put(`/admin/blogs/${id}`, blogData);
      return response.data;
    },

    // Delete a blog
    deleteBlog: async (id) => {
      const response = await apiClient.delete(`/admin/blogs/${id}`);
      return response.data;
    },

    // Update impact statistics
    updateImpactStats: async (statsData) => {
      const response = await apiClient.put('/admin/impact-stats', statsData);
      return response.data;
    },

    // Get site content
    getSiteContent: async () => {
      const response = await apiClient.get('/admin/site-content');
      return response.data;
    },

    // Update site content
    updateSiteContent: async (contentData) => {
      const response = await apiClient.put('/admin/site-content', { content: contentData });
      return response.data;
    },

    // Update contact information
    updateContactInfo: async (contactData) => {
      const response = await apiClient.put('/admin/contact-info', contactData);
      return response.data;
    },

    // Success Stories Management
    getAllSuccessStories: async () => {
      const response = await apiClient.get('/admin/success-stories');
      return response.data;
    },

    addSuccessStory: async (storyData) => {
      const response = await apiClient.post('/admin/success-stories', storyData);
      return response.data;
    },

    updateSuccessStory: async (storyId, storyData) => {
      const response = await apiClient.put(`/admin/success-stories/${storyId}`, storyData);
      return response.data;
    },

    deleteSuccessStory: async (storyId) => {
      const response = await apiClient.delete(`/admin/success-stories/${storyId}`);
      return response.data;
    },

    // Leadership Team Management
    getAllTeamMembers: async () => {
      const response = await apiClient.get('/admin/leadership-team');
      return response.data;
    },

    addTeamMember: async (memberData) => {
      const response = await apiClient.post('/admin/leadership-team', memberData);
      return response.data;
    },

    updateTeamMember: async (memberId, memberData) => {
      const response = await apiClient.put(`/admin/leadership-team/${memberId}`, memberData);
      return response.data;
    },

    deleteTeamMember: async (memberId) => {
      const response = await apiClient.delete(`/admin/leadership-team/${memberId}`);
      return response.data;
    },

    // Page Sections Management
    getPageSections: async (page) => {
      const response = await apiClient.get(`/admin/page-sections/${page}`);
      return response.data;
    },

    addPageSection: async (sectionData) => {
      const response = await apiClient.post('/admin/page-sections', sectionData);
      return response.data;
    },

    updatePageSection: async (sectionId, sectionData) => {
      const response = await apiClient.put(`/admin/page-sections/${sectionId}`, sectionData);
      return response.data;
    },

    deletePageSection: async (sectionId) => {
      const response = await apiClient.delete(`/admin/page-sections/${sectionId}`);
      return response.data;
    },

    // Gallery Items Management
    getAllGalleryItems: async () => {
      const response = await apiClient.get('/admin/gallery-items');
      return response.data;
    },

    addGalleryItem: async (itemData) => {
      const response = await apiClient.post('/admin/gallery-items', itemData);
      return response.data;
    },

    updateGalleryItem: async (itemId, itemData) => {
      const response = await apiClient.put(`/admin/gallery-items/${itemId}`, itemData);
      return response.data;
    },

    deleteGalleryItem: async (itemId) => {
      const response = await apiClient.delete(`/admin/gallery-items/${itemId}`);
      return response.data;
    },

    // Database Management
    getDatabaseCollections: async () => {
      const response = await apiClient.get('/admin/database/collections');
      return response.data;
    },

    getCollectionData: async (collectionName, limit = 100, skip = 0) => {
      const response = await apiClient.get(`/admin/database/${collectionName}?limit=${limit}&skip=${skip}`);
      return response.data;
    },

    deleteDocument: async (collectionName, documentId) => {
      const response = await apiClient.delete(`/admin/database/${collectionName}/${documentId}`);
      return response.data;
    },

    getDatabaseStats: async () => {
      const response = await apiClient.get('/admin/database/stats');
      return response.data;
    },

    // User Management
    getUsers: async () => {
      const response = await apiClient.get('/admin/users');
      return response.data;
    },

    createUser: async (userData) => {
      const response = await apiClient.post('/admin/users', userData);
      return response.data;
    },

    updateUser: async (userId, userData) => {
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    },

    updateUserPassword: async (userId, passwordData) => {
      const response = await apiClient.put(`/admin/users/${userId}/password`, passwordData);
      return response.data;
    },

    deleteUser: async (userId) => {
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    },

    // Site Settings/Branding Management
    getSiteSettings: async () => {
      const response = await apiClient.get('/admin/site-settings');
      return response.data;
    },

    updateSiteSettings: async (settingsData) => {
      const response = await apiClient.put('/admin/site-settings', settingsData);
      return response.data;
    },

    // Detailed Page Sections Management
    getDetailedPageSections: async (page) => {
      const response = await apiClient.get(`/admin/detailed-page-sections/${page}`);
      return response.data;
    },

    addDetailedPageSection: async (sectionData) => {
      const response = await apiClient.post('/admin/detailed-page-sections', sectionData);
      return response.data;
    },

    updateDetailedPageSection: async (sectionId, sectionData) => {
      const response = await apiClient.put(`/admin/detailed-page-sections/${sectionId}`, sectionData);
      return response.data;
    },

    deleteDetailedPageSection: async (sectionId) => {
      const response = await apiClient.delete(`/admin/detailed-page-sections/${sectionId}`);
      return response.data;
    }
  }
};

// Public site content API (no authentication required)
export const getPublicSiteContent = async () => {
  try {
    const response = await apiClient.get('/site-content');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch public site content:', error);
    throw error;
  }
};

// Success Stories API (public)
export const getSuccessStories = async () => {
  try {
    const response = await apiClient.get('/success-stories');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch success stories:', error);
    throw error;
  }
};

// Leadership Team API (public)
export const getLeadershipTeam = async () => {
  try {
    const response = await apiClient.get('/leadership-team');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch leadership team:', error);
    throw error;
  }
};

// Page Sections API (public)
export const getPageSections = async (page) => {
  try {
    const response = await apiClient.get(`/page-sections/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch page sections for ${page}:`, error);
    throw error;
  }
};

// Gallery Items API (public)
export const getGalleryItems = async () => {
  try {
    const response = await apiClient.get('/gallery-items');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch gallery items:', error);
    throw error;
  }
};

// Site Settings API (public)
export const getSiteSettings = async () => {
  try {
    const response = await apiClient.get('/site-settings');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch site settings:', error);
    throw error;
  }
};

// Detailed Page Sections API (public)
export const getDetailedPageSections = async (page) => {
  try {
    const response = await apiClient.get(`/detailed-page-sections/${page}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch detailed page sections for ${page}:`, error);
    throw error;
  }
};
