import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import {
  Shield,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Users,
  User,
  FileText,
  TrendingUp,
  Calendar,
  Eye,
  Save,
  X,
  BookOpen,
  Tag,
  Award,
  GraduationCap,
  Database,
  UserCheck,
  Settings,
  Layout
} from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import { api } from '../api';
import UserManagement from './admin-sections/UserManagement';
import SiteSettings from './admin-sections/SiteSettings';
import PageManagement from './admin-sections/PageManagement';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [news, setNews] = useState([]);
  const [impactStats, setImpactStats] = useState({});
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);

  // Blog management state
  const [blogPosts, setBlogPosts] = useState([]);
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    image: '',
    status: 'draft'
  });

  // Contact Information Management state
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: 'shieldfoundation@gmail.com',
    phone: '+91 98334 06288',
    address: 'Dharavi, Mumbai, Maharashtra'
  });
  const [tempContactInfo, setTempContactInfo] = useState(contactInfo);
  
  // Success Stories Management state
  const [successStories, setSuccessStories] = useState([]);
  const [showSuccessStoryForm, setShowSuccessStoryForm] = useState(false);
  const [editingSuccessStory, setEditingSuccessStory] = useState(null);
  const [successStoryForm, setSuccessStoryForm] = useState({
    name: '',
    story: '',
    image: '',
    achievement: '',
    location: '',
    program: '',
    order: 0,
    is_active: true
  });

  // Leadership Team Management state
  const [teamMembers, setTeamMembers] = useState([]);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState(null);
  const [teamMemberForm, setTeamMemberForm] = useState({
    name: '',
    role: '',
    image: '',
    description: '',
    category: 'Trustee',
    order: 0,
    is_active: true
  });

  // Gallery Management state
  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryForm, setShowGalleryForm] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    date: '',
    type: 'image',
    order: 0,
    is_active: true
  });

  // Database Management state
  const [databaseCollections, setDatabaseCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [collectionData, setCollectionData] = useState([]);
  const [databaseStats, setDatabaseStats] = useState(null);
  const [databaseLoading, setDatabaseLoading] = useState(false);
  // User Management state
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Site Settings/Branding state
  const [siteSettings, setSiteSettings] = useState({
    logo_url: '',
    favicon_url: '',
    site_title: 'Shield Foundation',
    site_description: 'Adding Life to Years',
    primary_color: '#2563eb',
    secondary_color: '#eab308',
    accent_color: '#ffffff'
  });
  const [tempSiteSettings, setTempSiteSettings] = useState(siteSettings);
  const [showSiteSettingsForm, setShowSiteSettingsForm] = useState(false);

  // Enhanced Page Management state
  const [selectedPage, setSelectedPage] = useState('about');
  const [pageContent, setPageContent] = useState({
    about: [],
    programs: [],
    impact: []
  });
  const [showPageSectionForm, setShowPageSectionForm] = useState(false);
  const [pageSectionForm, setPageSectionForm] = useState({
    page: 'about',
    section: '',
    title: '',
    content: {
      text: '',
      html: '',
      image_url: '',
      images: [],
      links: [],
      items: [],
      subsections: [],
      metadata: {}
    },
    order: 0,
    is_active: true
  });

  // Page Content Management state
  const [showPageContentForm, setShowPageContentForm] = useState(false);
  const [editingPageSection, setEditingPageSection] = useState(null);
  const [editingSubSection, setEditingSubSection] = useState(null);
  const [siteContent, setSiteContent] = useState({});
  const [tempSiteContent, setTempSiteContent] = useState({});

  // Check authentication and load data
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const adminUser = localStorage.getItem('adminUser');

    // Check authentication - redirect to login if not authenticated
    if (!adminToken || !adminUser) {
      navigate('/admin');
      return;
    }

    // Parse authenticated user data
    const user = JSON.parse(adminUser);
    setCurrentUser(user);
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      // Load impact statistics
      const stats = await api.getImpactStats();
      setImpactStats(stats);

      // Load news if on news tab
      if (activeTab === 'news') {
        const newsData = await api.admin.getAllNews();
        setNews(newsData);
      }

      // Always load blog posts and site content for the admin
      await loadBlogPosts();
      await loadSiteContent();
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  // Load news when switching to news tab
  useEffect(() => {
    if (activeTab === 'news' && currentUser) {
      loadNews();
    }
  }, [activeTab, currentUser]);

  const loadNews = async () => {
    try {
      const newsData = await api.admin.getAllNews();
      setNews(newsData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load news articles.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    api.admin.logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/admin');
  };

  const handleAddNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.admin.createNews(newsForm);
      toast({
        title: "Success",
        description: "News article created successfully!",
      });
      setNewsForm({ title: '', content: '', status: 'draft' });
      setShowNewsForm(false);
      loadNews(); // Reload news list
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create news article.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdateNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.admin.updateNews(editingNews.id, newsForm);
      toast({
        title: "Success",
        description: "News article updated successfully!",
      });
      setNewsForm({ title: '', content: '', status: 'draft' });
      setEditingNews(null);
      loadNews(); // Reload news list
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update news article.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm('Are you sure you want to delete this news article?')) return;

    try {
      await api.admin.deleteNews(id);
      toast({
        title: "Success",
        description: "News article deleted successfully!",
      });
      loadNews(); // Reload news list
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete news article.",
        variant: "destructive",
      });
    }
  };

  const startEdit = (newsItem) => {
    setEditingNews(newsItem);
    setNewsForm({
      title: newsItem.title,
      content: newsItem.content,
      status: newsItem.status
    });
  };

  const cancelEdit = () => {
    setEditingNews(null);
    setNewsForm({ title: '', content: '', status: 'draft' });
    setShowNewsForm(false);
  };

  const handleUpdateImpactStats = async () => {
    setLoading(true);
    try {
      await api.admin.updateImpactStats({
        youth_trained: impactStats.youthTrained,
        youth_placed: impactStats.youthPlaced,
        seniors_supported: impactStats.seniorsSupported,
        women_empowered: impactStats.womenEmpowered
      });
      toast({
        title: "Success",
        description: "Impact statistics updated successfully!",
      });
      // Reload the dashboard data to reflect changes
      loadDashboardData();
    } catch (error) {
      // Handle FastAPI validation errors properly
      let errorMessage = "Failed to update impact statistics.";

      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.detail) {
          if (Array.isArray(error.response.data.detail)) {
            const validationErrors = error.response.data.detail.map(err => {
              const field = err.loc?.join(' ') || 'field';
              return `${field}: ${err.msg}`;
            }).join(', ');
            errorMessage = `Validation error: ${validationErrors}`;
          } else if (typeof error.response.data.detail === 'string') {
            errorMessage = error.response.data.detail;
          }
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Blog Management Functions
  const loadBlogPosts = async () => {
    try {
      const data = await api.admin.getAllBlogs();
      setBlogPosts(data || []);
    } catch (error) {
      console.log('Error loading blog posts');
      setBlogPosts([]);
    }
  };

  // Success Stories Management Functions
  const loadSuccessStories = async () => {
    try {
      const data = await api.admin.getAllSuccessStories();
      setSuccessStories(data.stories || []);
    } catch (error) {
      console.error('Failed to load success stories:', error);
      toast({
        title: "Error",
        description: "Failed to load success stories.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSuccessStory = async () => {
    if (!successStoryForm.name.trim() || !successStoryForm.story.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingSuccessStory) {
        await api.admin.updateSuccessStory(editingSuccessStory.id, successStoryForm);
        toast({
          title: "Success",
          description: "Success story updated successfully!",
        });
      } else {
        await api.admin.addSuccessStory(successStoryForm);
        toast({
          title: "Success",
          description: "Success story created successfully!",
        });
      }

      setSuccessStoryForm({
        name: '',
        story: '',
        image: '',
        achievement: '',
        location: '',
        program: '',
        order: 0,
        is_active: true
      });
      setShowSuccessStoryForm(false);
      setEditingSuccessStory(null);
      loadSuccessStories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save success story. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditSuccessStory = (story) => {
    setSuccessStoryForm({
      name: story.name,
      story: story.story,
      image: story.image,
      achievement: story.achievement,
      location: story.location,
      program: story.program,
      order: story.order || 0,
      is_active: story.is_active !== false
    });
    setEditingSuccessStory(story);
    setShowSuccessStoryForm(true);
  };

  const handleDeleteSuccessStory = async (storyId) => {
    if (window.confirm('Are you sure you want to delete this success story?')) {
      setLoading(true);
      try {
        await api.admin.deleteSuccessStory(storyId);
        toast({
          title: "Success",
          description: "Success story deleted successfully!",
        });
        loadSuccessStories();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete success story.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const cancelSuccessStoryEdit = () => {
    setEditingSuccessStory(null);
    setSuccessStoryForm({
      name: '',
      story: '',
      image: '',
      achievement: '',
      location: '',
      program: '',
      order: 0,
      is_active: true
    });
    setShowSuccessStoryForm(false);
  };

  // Leadership Team Management Functions
  const loadTeamMembers = async () => {
    try {
      const data = await api.admin.getAllTeamMembers();
      setTeamMembers(data.members || []);
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast({
        title: "Error",
        description: "Failed to load team members.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTeamMember = async () => {
    if (!teamMemberForm.name.trim() || !teamMemberForm.role.trim() || !teamMemberForm.category.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingTeamMember) {
        await api.admin.updateTeamMember(editingTeamMember.id, teamMemberForm);
        toast({
          title: "Success",
          description: "Team member updated successfully!",
        });
      } else {
        await api.admin.addTeamMember(teamMemberForm);
        toast({
          title: "Success",
          description: "Team member created successfully!",
        });
      }

      setTeamMemberForm({
        name: '',
        role: '',
        image: '',
        description: '',
        category: 'Trustee',
        order: 0,
        is_active: true
      });
      setShowTeamMemberForm(false);
      setEditingTeamMember(null);
      loadTeamMembers();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save team member. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditTeamMember = (member) => {
    setTeamMemberForm({
      name: member.name,
      role: member.role,
      image: member.image,
      description: member.description,
      category: member.category || 'Trustee',
      order: member.order || 0,
      is_active: member.is_active !== false
    });
    setEditingTeamMember(member);
    setShowTeamMemberForm(true);
  };

  const handleDeleteTeamMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      setLoading(true);
      try {
        await api.admin.deleteTeamMember(memberId);
        toast({
          title: "Success",
          description: "Team member deleted successfully!",
        });
        loadTeamMembers();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete team member.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const cancelTeamMemberEdit = () => {
    setEditingTeamMember(null);
    setTeamMemberForm({
      name: '',
      role: '',
      image: '',
      description: '',
      category: 'Trustee',
      order: 0,
      is_active: true
    });
    setShowTeamMemberForm(false);
  };

  // Gallery Management Functions
  const loadGalleryItems = async () => {
    try {
      const data = await api.admin.getAllGalleryItems();
      setGalleryItems(data.items || []);
    } catch (error) {
      console.error('Failed to load gallery items:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery items.",
        variant: "destructive",
      });
    }
  };

  const handleSaveGalleryItem = async () => {
    if (!galleryForm.title.trim() || !galleryForm.category.trim()) {
      toast({
        title: "Error",
        description: "Please fill in title and category.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const formData = {
        ...galleryForm,
        date: galleryForm.date || new Date().toISOString().split('T')[0]
      };

      if (editingGalleryItem) {
        await api.admin.updateGalleryItem(editingGalleryItem.id, formData);
        toast({
          title: "Success",
          description: "Gallery item updated successfully!",
        });
      } else {
        await api.admin.addGalleryItem(formData);
        toast({
          title: "Success",
          description: "Gallery item created successfully!",
        });
      }

      setGalleryForm({
        title: '',
        description: '',
        image: '',
        category: '',
        date: '',
        type: 'image',
        order: 0,
        is_active: true
      });
      setEditingGalleryItem(null);
      setShowGalleryForm(false);
      loadGalleryItems();
    } catch (error) {
      console.error('Failed to save gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to save gallery item.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditGalleryItem = (item) => {
    setEditingGalleryItem(item);
    setGalleryForm({
      title: item.title || '',
      description: item.description || '',
      image: item.image || '',
      category: item.category || '',
      date: item.date || '',
      type: item.type || 'image',
      order: item.order || 0,
      is_active: item.is_active !== undefined ? item.is_active : true
    });
    setShowGalleryForm(true);
  };

  const handleDeleteGalleryItem = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) {
      return;
    }

    setLoading(true);
    try {
      await api.admin.deleteGalleryItem(itemId);
      toast({
        title: "Success",
        description: "Gallery item deleted successfully!",
      });
      loadGalleryItems();
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      toast({
        title: "Error",
        description: "Failed to delete gallery item.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const resetGalleryForm = () => {
    setEditingGalleryItem(null);
    setGalleryForm({
      title: '',
      description: '',
      image: '',
      category: '',
      date: '',
      type: 'image',
      order: 0,
      is_active: true
    });
    setShowGalleryForm(false);
  };

  const cancelGalleryEdit = () => {
    resetGalleryForm();
  };

  // User Management Functions
  const loadUsers = async () => {
    try {
      const data = await api.admin.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.log('Error loading users');
      setUsers([]);
    }
  };

  // Site Settings Functions
  const loadSiteSettings = async () => {
    try {
      const data = await api.admin.getSiteSettings();
      setSiteSettings(data);
      setTempSiteSettings(data);
    } catch (error) {
      console.log('Error loading site settings');
    }
  };

  // Enhanced Page Content Functions
  const loadPageContent = async (page) => {
    try {
      const data = await api.admin.getDetailedPageSections(page);
      setPageContent(prev => ({
        ...prev,
        [page]: data.sections || []
      }));
    } catch (error) {
      console.log(`Error loading ${page} page content`);
      setPageContent(prev => ({
        ...prev,
        [page]: []
      }));
    }
  };
  // Database Management Functions
  const loadDatabaseCollections = async () => {
    try {
      setDatabaseLoading(true);
      const data = await api.admin.getDatabaseCollections();
      setDatabaseCollections(data.collections || []);
    } catch (error) {
      console.error('Failed to load database collections:', error);
      toast({
        title: "Error",
        description: "Failed to load database collections.",
        variant: "destructive",
      });
    } finally {
      setDatabaseLoading(false);
    }
  };

  const loadDatabaseStats = async () => {
    try {
      const stats = await api.admin.getDatabaseStats();
      setDatabaseStats(stats);
    } catch (error) {
      console.error('Failed to load database stats:', error);
      toast({
        title: "Error",
        description: "Failed to load database statistics.",
        variant: "destructive",
      });
    }
  };

  const loadCollectionData = async (collectionName) => {
    try {
      setDatabaseLoading(true);
      const data = await api.admin.getCollectionData(collectionName, 50, 0);
      setCollectionData(data.documents || []);
      setSelectedCollection(data);
    } catch (error) {
      console.error('Failed to load collection data:', error);
      toast({
        title: "Error",
        description: `Failed to load data for collection: ${collectionName}`,
        variant: "destructive",
      });
    } finally {
      setDatabaseLoading(false);
    }
  };

  const deleteDocumentFromCollection = async (collectionName, documentId) => {
    if (!window.confirm(`Are you sure you want to delete this document from ${collectionName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.admin.deleteDocument(collectionName, documentId);
      toast({
        title: "Success",
        description: "Document deleted successfully!",
      });

      // Reload the collection data
      await loadCollectionData(collectionName);

      // Reload stats to update counts
      await loadDatabaseStats();
      await loadDatabaseCollections();
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document.",
        variant: "destructive",
      });
    }
  };

  // Site Content Management Functions
  const loadSiteContent = async () => {
    try {
      // Try to load from backend first
      const backendContent = await api.admin.getSiteContent();
      if (backendContent.content && Object.keys(backendContent.content).length > 0) {
        setSiteContent(backendContent.content);
        setTempSiteContent(backendContent.content);
      } else {
        // Initialize with empty content if no backend content
        setSiteContent({});
        setTempSiteContent({});
      }
    } catch (error) {
      console.error('Failed to load site content from backend:', error);
      // Initialize with empty content
      setSiteContent({});
      setTempSiteContent({});
    }
  };

  useEffect(() => {
    if (activeTab === 'blog' && currentUser) {
      loadBlogPosts();
    }
    if (activeTab === 'content' && currentUser) {
      loadSiteContent();
    }
    if (activeTab === 'stories' && currentUser) {
      loadSuccessStories();
    }
    if (activeTab === 'team' && currentUser) {
      loadTeamMembers();
    }
    if (activeTab === 'gallery' && currentUser) {
      loadGalleryItems();
    }
    if (activeTab === 'database' && currentUser) {
      loadDatabaseCollections();
      loadDatabaseStats();
    }
    if (activeTab === 'users' && currentUser) {
      loadUsers();
    }
    if (activeTab === 'site-settings' && currentUser) {
      loadSiteSettings();
    }
    if (activeTab === 'page-management' && currentUser) {
      loadPageContent(selectedPage);
    }
  }, [activeTab, currentUser, selectedPage]);

// src/components/AdminPanel.jsx

// NEW UPDATED FUNCTION
const handleAddBlog = async () => {
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      toast({
        title: "Error",
        description: "Title and Content are required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.filter(tag => tag.trim() !== '')
      };

      // 1. Capture the response from the API call
      const response = await api.admin.createBlog(payload);
      
      // 2. Use the response to add the new post to the top of your existing list
      setBlogPosts(prevPosts => [response, ...prevPosts]);

      toast({
        title: "Success",
        description: "Blog post created successfully!",
      });

      cancelBlogEdit(); // This now correctly happens after the state update

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create blog post.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  
  const handleUpdateBlog = async () => {
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      toast({
        title: "Error",
        description: "Title and Content are required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...blogForm,
        tags: blogForm.tags.filter(tag => tag.trim() !== '')
      };

      // Send the updated blog data to the server
      await api.admin.updateBlog(editingBlog.id, payload);

      toast({
        title: "Success",
        description: "Blog post updated successfully!",
      });

      cancelBlogEdit(); // Resets and hides the form
      await loadBlogPosts(); // Reloads the list from the database

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update blog post.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteBlog = async (blogId) => {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    setLoading(true);
    try {
      // Tell the server to delete the blog post
      await api.admin.deleteBlog(blogId);

      toast({
        title: "Success",
        description: "Blog post deleted successfully!",
      });

      await loadBlogPosts(); // Reload the list from the database

    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete blog post.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const startEditBlog = (blogPost) => {
    setEditingBlog(blogPost);
    setBlogForm({
      title: blogPost.title,
      excerpt: blogPost.excerpt,
      content: blogPost.content,
      category: blogPost.category,
      tags: blogPost.tags || [],
      image: blogPost.image || '',
      status: blogPost.status
    });
    setShowBlogForm(true);
  };

  const cancelBlogEdit = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      image: '',
      status: 'draft'
    });
    setShowBlogForm(false);
  };

  const addTag = (tag) => {
    if (tag.trim() && !blogForm.tags.includes(tag.trim())) {
      setBlogForm({
        ...blogForm,
        tags: [...blogForm.tags, tag.trim()]
      });
    }
  };

  const removeTag = (tagToRemove) => {
    setBlogForm({
      ...blogForm,
      tags: blogForm.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Contact Information Management Functions
  const handleEditContact = () => {
    setTempContactInfo(contactInfo);
    setShowContactForm(true);
  };

  const handleCancelContactEdit = () => {
    setTempContactInfo(contactInfo);
    setShowContactForm(false);
  };

  // Page Content Management Functions
  const handleEditPageContent = (page, section, subsection = null) => {
    setEditingPageSection(page);
    setEditingSubSection(subsection ? `${section}.${subsection}` : section);
    setTempSiteContent({...siteContent});
    setShowPageContentForm(true);
  };

  const handleSavePageContent = async () => {
    setLoading(true);
    try {
      // Save to backend
      await api.admin.updateSiteContent(tempSiteContent);

      // Update local state
      setSiteContent(tempSiteContent);
      setShowPageContentForm(false);
      setEditingPageSection(null);
      setEditingSubSection(null);

      toast({
        title: "Success",
        description: "Page content updated successfully!",
      });
    } catch (error) {
      console.error('Failed to save page content:', error);
      toast({
        title: "Error",
        description: "Failed to save page content. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleSaveContactInfo = async () => {
    setLoading(true);
    try {
      const contactData = {
        email: tempContactInfo.email,
        phone: tempContactInfo.phone,
        address: tempContactInfo.address
      };

      // Save to backend
      await api.admin.updateContactInfo(contactData);

      // Update local state
      setContactInfo(tempContactInfo);
      setTempContactInfo(tempContactInfo);  // ✅ keep form in sync
      setShowContactForm(false);

      // Also update in site content
      const updatedSiteContent = { ...siteContent };
      if (!updatedSiteContent.contact) updatedSiteContent.contact = {};
      updatedSiteContent.contact.contactInfo = contactData;
      setSiteContent(updatedSiteContent);

      toast({
        title: "Success",
        description: "Contact information updated successfully!",
      });
    } catch (error) {
      console.error('Failed to save contact info:', error);
      toast({
        title: "Error",
        description: "Failed to save contact information. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleCancelPageContentEdit = () => {
    setTempSiteContent({...siteContent});
    setShowPageContentForm(false);
    setEditingPageSection(null);
    setEditingSubSection(null);
  };

  const updateSiteContent = (path, value) => {
    const pathArray = path.split('.');
    const newContent = {...tempSiteContent};

    let current = newContent;
    for (let i = 0; i < pathArray.length - 1; i++) {
      if (!current[pathArray[i]]) current[pathArray[i]] = {};
      current = current[pathArray[i]];
    }
    current[pathArray[pathArray.length - 1]] = value;

    setTempSiteContent(newContent);
  };

  const getSiteContentValue = (path) => {
    const pathArray = path.split('.');
    let current = tempSiteContent;

    for (const key of pathArray) {
      if (!current || !current[key]) return '';
      current = current[key];
    }
    return current;
  };
  // User Management Handlers
  const handleCreateUser = async () => {
    setLoading(true);
    try {
      await api.admin.createUser(userForm);
      await loadUsers();
      resetUserForm();

      toast({
        title: "Success",
        description: "User created successfully!",
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create user. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdateUser = async () => {
    setLoading(true);
    try {
      await api.admin.updateUser(editingUser.id, {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role
      });
      await loadUsers();
      resetUserForm();

      toast({
        title: "Success",
        description: "User updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update user. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.admin.deleteUser(userId);
      await loadUsers();

      toast({
        title: "Success",
        description: "User deleted successfully!",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.admin.updateUserPassword(currentUser.id, {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });

      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setShowPasswordForm(false);

      toast({
        title: "Success",
        description: "Password updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      name: '',
      email: '',
      password: '',
      role: 'admin'
    });
    setEditingUser(null);
    setShowUserForm(false);
  };

  // Site Settings Handlers
  const handleUpdateSiteSettings = async () => {
    setLoading(true);
    try {
      await api.admin.updateSiteSettings(tempSiteSettings);
      setSiteSettings(tempSiteSettings);
      setShowSiteSettingsForm(false);

      toast({
        title: "Success",
        description: "Site settings updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update site settings:', error);
      toast({
        title: "Error",
        description: "Failed to update site settings. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleResetSiteSettings = () => {
    setTempSiteSettings(siteSettings);
    setShowSiteSettingsForm(false);
  };

  // Page Management Handlers
  const handleCreatePageSection = async () => {
    setLoading(true);
    try {
      await api.admin.addDetailedPageSection(pageSectionForm);
      await loadPageContent(selectedPage);
      resetPageSectionForm();

      toast({
        title: "Success",
        description: "Page section created successfully!",
      });
    } catch (error) {
      console.error('Failed to create page section:', error);
      toast({
        title: "Error",
        description: "Failed to create page section. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdatePageSection = async () => {
    setLoading(true);
    try {
      await api.admin.updateDetailedPageSection(editingPageSection.id, {
        title: pageSectionForm.title,
        content: pageSectionForm.content,
        order: pageSectionForm.order,
        is_active: pageSectionForm.is_active
      });
      await loadPageContent(selectedPage);
      resetPageSectionForm();

      toast({
        title: "Success",
        description: "Page section updated successfully!",
      });
    } catch (error) {
      console.error('Failed to update page section:', error);
      toast({
        title: "Error",
        description: "Failed to update page section. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleDeletePageSection = async (sectionId) => {
    if (!window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await api.admin.deleteDetailedPageSection(sectionId);
      await loadPageContent(selectedPage);

      toast({
        title: "Success",
        description: "Page section deleted successfully!",
      });
    } catch (error) {
      console.error('Failed to delete page section:', error);
      toast({
        title: "Error",
        description: "Failed to delete page section. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const resetPageSectionForm = () => {
    setPageSectionForm({
      page: selectedPage,
      section: '',
      title: '',
      content: {
        text: '',
        html: '',
        image_url: '',
        images: [],
        links: [],
        items: [],
        subsections: [],
        metadata: {}
      },
      order: 0,
      is_active: true
    });
    setEditingPageSection(null);
    setShowPageSectionForm(false);
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-blue-600">Shield Foundation</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {currentUser.name}</span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full justify-start"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                  <Button
                    variant={activeTab === 'news' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('news')}
                    className="w-full justify-start"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    News & Updates
                  </Button>
                  <Button
                    variant={activeTab === 'blog' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('blog')}
                    className="w-full justify-start"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Blog Management
                  </Button>
                  <Button
                    variant={activeTab === 'stories' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('stories')}
                    className="w-full justify-start"
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Success Stories
                  </Button>
                  <Button
                    variant={activeTab === 'team' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('team')}
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Leadership Team
                  </Button>
                  <Button
                    variant={activeTab === 'gallery' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('gallery')}
                    className="w-full justify-start"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Gallery Management
                  </Button>
                  <Button
                    variant={activeTab === 'page-management' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('page-management')}
                    className="w-full justify-start"
                  >
                    <Layout className="h-4 w-4 mr-2" />
                    Advanced Page Management
                  </Button>
                  <Button
                    variant={activeTab === 'users' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('users')}
                    className="w-full justify-start"
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    User Management
                  </Button>
                  <Button
                    variant={activeTab === 'site-settings' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('site-settings')}
                    className="w-full justify-start"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Site Settings & Branding
                  </Button>
                  <Button
                    variant={activeTab === 'database' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('database')}
                    className="w-full justify-start"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Database Management
                  </Button>
                  <Button
                    variant={activeTab === 'content' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('content')}
                    className="w-full justify-start"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Content Management
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {impactStats.youthTrained?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Youth Trained</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <TrendingUp className="h-8 w-8 text-yellow-500" />
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {impactStats.youthPlaced?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Youth Placed</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-blue-600" />
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {impactStats.seniorsSupported?.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Seniors Supported</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <Users className="h-8 w-8 text-yellow-500" />
                        <div className="ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            {impactStats.womenEmpowered}
                          </div>
                          <div className="text-sm text-gray-600">Women Empowered</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">New physiotherapy unit launched in Dharavi</p>
                          <p className="text-xs text-gray-500">2 days ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Users className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">25 youth completed CRS training program</p>
                          <p className="text-xs text-gray-500">1 week ago</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Monthly impact report published</p>
                          <p className="text-xs text-gray-500">2 weeks ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'news' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">News & Updates</h2>
                  <Button
                    onClick={() => setShowNewsForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                  </Button>
                </div>

                {/* News Form */}
                {(showNewsForm || editingNews) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {editingNews ? 'Edit News Article' : 'Add New Article'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Title *
                          </label>
                          <Input
                            placeholder="Enter article title"
                            value={newsForm.title}
                            onChange={(e) => setNewsForm({...newsForm, title: e.target.value})}
                            required
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">Content *</label>
                          <TiptapEditor
                            content={newsForm.content}
                            onContentChange={(newContent) => setNewsForm({ ...newsForm, content: newContent })}
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Status
                          </label>
                          <Select
                            value={newsForm.status}
                            onValueChange={(value) => setNewsForm({...newsForm, status: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="published">Published</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex space-x-3">
                          <Button
                            type="button"
                            onClick={editingNews ? handleUpdateNews : handleAddNews}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Saving...' : (editingNews ? 'Update' : 'Save')}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelEdit}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* News List */}
                <div className="space-y-4">
                  {news.map((article) => (
                    <Card key={article.id}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                              <Badge
                                variant={article.status === 'published' ? 'default' : 'secondary'}
                                className={article.status === 'published'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                                }
                              >
                                {article.status}
                              </Badge>
                            </div>
                            {/*<p className="text-gray-600 mb-3 line-clamp-2">{article.content}</p>*/}
                            <div
                              className="text-gray-600 mb-3 line-clamp-2 prose"
                               dangerouslySetInnerHTML={{ __html: article.content }}
                            />
                            <div className="text-sm text-gray-500">
                              Published on {new Date(article.date).toLocaleDateString()} by {article.author}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEdit(article)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteNews(article.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {news.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No news articles yet. Create your first article!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
                  <Button
                    onClick={() => setShowBlogForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Blog Post
                  </Button>
                </div>

                {/* Blog Form Modal */}
                {showBlogForm && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelBlogEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <Input
                            value={blogForm.title}
                            onChange={(e) => setBlogForm({...blogForm, title: e.target.value})}
                            placeholder="Enter blog post title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select
                            value={blogForm.category}
                            onChange={(e) => setBlogForm({...blogForm, category: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">Select Category</option>
                            <option value="Youth Development">Youth Development</option>
                            <option value="Senior Care">Senior Care</option>
                            <option value="Partnerships">Partnerships</option>
                            <option value="Expansion">Expansion</option>
                            <option value="Community Impact">Community Impact</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                        <Textarea
                          value={blogForm.excerpt}
                          onChange={(e) => setBlogForm({...blogForm, excerpt: e.target.value})}
                          placeholder="Brief description of the blog post"
                          rows={2}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                        <Input
                          value={blogForm.image}
                          onChange={(e) => setBlogForm({...blogForm, image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {blogForm.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button onClick={() => removeTag(tag)} className="ml-1">
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <Input
                          placeholder="Add tags (press Enter)"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag(e.target.value);
                              e.target.value = '';
                            }
                          }}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                        <TiptapEditor
                          content={blogForm.content}
                          onContentChange={(newContent) => setBlogForm({ ...blogForm, content: newContent })}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                          <select
                            value={blogForm.status}
                            onChange={(e) => setBlogForm({...blogForm, status: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          onClick={editingBlog ? handleUpdateBlog : handleAddBlog}
                          disabled={loading || !blogForm.title || !blogForm.content}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {loading ? 'Saving...' : (editingBlog ? 'Update Post' : 'Create Post')}
                        </Button>
                        <Button type="button" variant="outline" onClick={cancelBlogEdit}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Blog Posts List */}
                <div className="space-y-4">
                  {blogPosts.map((post) => (
                    <Card key={post.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                              <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                                {post.status}
                              </Badge>
                              {post.category && (
                                <Badge variant="outline">{post.category}</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{post.excerpt}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {post.publishDate}
                              </span>
                              <span className="flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {post.author}
                              </span>
                              {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-1">
                                  <Tag className="h-3 w-3" />
                                  <span>{post.tags.slice(0, 3).join(', ')}</span>
                                  {post.tags.length > 3 && <span>+{post.tags.length - 3} more</span>}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditBlog(post)}
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBlog(post.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {blogPosts.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No blog posts yet. Create your first blog post!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stories' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Success Stories Management</h2>
                  <Button
                    onClick={() => setShowSuccessStoryForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Success Story
                  </Button>
                </div>

                {/* Success Story Form Modal */}
                {showSuccessStoryForm && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingSuccessStory ? 'Edit Success Story' : 'Create New Success Story'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelSuccessStoryEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <Input
                            value={successStoryForm.name}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, name: e.target.value})}
                            placeholder="Enter person's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                          <select
                            value={successStoryForm.program}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, program: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select a program</option>
                            <option value="Youth Skilling">Youth Skilling</option>
                            <option value="Senior Care">Senior Care</option>
                            <option value="ITES-BPO">ITES-BPO</option>
                            <option value="CRS">CRS</option>
                            <option value="Nursing Assistant">Nursing Assistant</option>
                            <option value="Women Empowerment">Women Empowerment</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                          <Input
                            value={successStoryForm.location}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, location: e.target.value})}
                            placeholder="e.g., Mumbai, Maharashtra"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Achievement *</label>
                          <Input
                            value={successStoryForm.achievement}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, achievement: e.target.value})}
                            placeholder="e.g., Placed at TCS with ₹25,000/month"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                        <Input
                          value={successStoryForm.image}
                          onChange={(e) => setSuccessStoryForm({...successStoryForm, image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Success Story *</label>
                        <Textarea
                          value={successStoryForm.story}
                          onChange={(e) => setSuccessStoryForm({...successStoryForm, story: e.target.value})}
                          placeholder="Tell their inspiring story..."
                          rows={4}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <Input
                            type="number"
                            value={successStoryForm.order}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first in the carousel</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="is_active"
                            checked={successStoryForm.is_active}
                            onChange={(e) => setSuccessStoryForm({...successStoryForm, is_active: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                            Active (show in carousel)
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={cancelSuccessStoryEdit}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveSuccessStory}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Saving...' : (editingSuccessStory ? 'Update Story' : 'Create Story')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Success Stories List */}
                <div className="space-y-4">
                  {successStories.map((story) => (
                    <Card key={story.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{story.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                story.is_active !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {story.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {story.program}
                              </span>
                            </div>
                            <p className="text-gray-600 mb-2">
                              <strong>Achievement:</strong> {story.achievement}
                            </p>
                            <p className="text-gray-600 mb-2">
                              <strong>Location:</strong> {story.location}
                            </p>
                            <p className="text-gray-600 line-clamp-2">{story.story}</p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSuccessStory(story)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSuccessStory(story.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {successStories.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No success stories yet. Create your first success story!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Leadership Team Management</h2>
                  <Button
                    onClick={() => setShowTeamMemberForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </Button>
                </div>

                {/* Team Member Form Modal */}
                {showTeamMemberForm && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingTeamMember ? 'Edit Team Member' : 'Add New Team Member'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelTeamMemberEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <Input
                            value={teamMemberForm.name}
                            onChange={(e) => setTeamMemberForm({...teamMemberForm, name: e.target.value})}
                            placeholder="Enter team member's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role/Position *</label>
                          <Input
                            value={teamMemberForm.role}
                            onChange={(e) => setTeamMemberForm({...teamMemberForm, role: e.target.value})}
                            placeholder="e.g., Founder & Director"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <Select
                          value={teamMemberForm.category}
                          onValueChange={(value) => setTeamMemberForm({...teamMemberForm, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trustee">Trustee</SelectItem>
                            <SelectItem value="Programs Team">Programs Team</SelectItem>
                            <SelectItem value="Admin & Finance">Admin & Finance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL *</label>
                        <Input
                          value={teamMemberForm.image}
                          onChange={(e) => setTeamMemberForm({...teamMemberForm, image: e.target.value})}
                          placeholder="https://example.com/profile-image.jpg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <Textarea
                          value={teamMemberForm.description}
                          onChange={(e) => setTeamMemberForm({...teamMemberForm, description: e.target.value})}
                          placeholder="Brief description of the team member's background and expertise..."
                          rows={3}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <Input
                            type="number"
                            value={teamMemberForm.order}
                            onChange={(e) => setTeamMemberForm({...teamMemberForm, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first on the page</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="team_is_active"
                            checked={teamMemberForm.is_active}
                            onChange={(e) => setTeamMemberForm({...teamMemberForm, is_active: e.target.checked})}
                            className="rounded border-gray-300"
                          />
                          <label htmlFor="team_is_active" className="text-sm font-medium text-gray-700">
                            Active (show on website)
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={cancelTeamMemberEdit}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveTeamMember}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Saving...' : (editingTeamMember ? 'Update Member' : 'Add Member')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Team Members List */}
                <div className="space-y-4">
                  {teamMembers.map((member) => (
                    <Card key={member.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4 flex-1">
                            <img
                              src={member.image}
                              alt={member.name}
                              className="w-16 h-16 rounded-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face";
                              }}
                            />
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  member.is_active !== false
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {member.is_active !== false ? 'Active' : 'Inactive'}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {member.category || 'Trustee'}
                                </span>
                              </div>
                              <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                              <p className="text-gray-600 line-clamp-2">{member.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTeamMember(member)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTeamMember(member.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {teamMembers.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No team members yet. Add your first team member!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Gallery Management</h2>
                  <Button
                    onClick={() => setShowGalleryForm(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Gallery Item
                  </Button>
                </div>

                <div className="space-y-4">
                  {galleryItems.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <img
                            src={item.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"}
                            alt={item.title}
                            className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
                            onError={(e) => {
                              e.target.src = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";
                            }}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.is_active !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {item.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                {item.category}
                              </span>
                            </div>
                            <p className="text-gray-600 line-clamp-2 mb-2">{item.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Type: {item.type}</span>
                              <span>Date: {item.date}</span>
                              <span>Order: {item.order}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditGalleryItem(item)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="text-red-600 hover:text-red-700 hover:border-red-300"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {galleryItems.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No gallery items yet. Add your first gallery item!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Gallery Form Modal */}
                {showGalleryForm && (
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingGalleryItem ? 'Edit Gallery Item' : 'Add New Gallery Item'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelGalleryEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                          <Input
                            value={galleryForm.title}
                            onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})}
                            placeholder="Enter gallery item title"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                          <Select value={galleryForm.category} onValueChange={(value) => setGalleryForm({...galleryForm, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="youth">Youth Programs</SelectItem>
                              <SelectItem value="seniors">Senior Care</SelectItem>
                              <SelectItem value="community">Community</SelectItem>
                              <SelectItem value="events">Events</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                        <Input
                          value={galleryForm.image}
                          onChange={(e) => setGalleryForm({...galleryForm, image: e.target.value})}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                          value={galleryForm.description}
                          onChange={(e) => setGalleryForm({...galleryForm, description: e.target.value})}
                          placeholder="Brief description of the gallery item..."
                          rows={3}
                        />
                      </div>

                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <Select value={galleryForm.type} onValueChange={(value) => setGalleryForm({...galleryForm, type: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="image">Image</SelectItem>
                              <SelectItem value="video">Video</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <Input
                            type="date"
                            value={galleryForm.date}
                            onChange={(e) => setGalleryForm({...galleryForm, date: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <Input
                            type="number"
                            value={galleryForm.order}
                            onChange={(e) => setGalleryForm({...galleryForm, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="gallery_is_active"
                          checked={galleryForm.is_active}
                          onChange={(e) => setGalleryForm({...galleryForm, is_active: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="gallery_is_active" className="text-sm font-medium text-gray-700">
                          Active (show on website)
                        </label>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={cancelGalleryEdit}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveGalleryItem}
                          disabled={loading}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          {loading ? 'Saving...' : (editingGalleryItem ? 'Update Item' : 'Add Item')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
                  <p className="text-gray-600">View and manage all database collections</p>
                </div>

                {/* Database Statistics */}
                {databaseStats && (
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Database className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="text-2xl font-bold">{databaseStats.total_collections}</p>
                            <p className="text-sm text-gray-600">Collections</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-8 w-8 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold">{databaseStats.total_documents}</p>
                            <p className="text-sm text-gray-600">Total Documents</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-8 w-8 text-purple-600" />
                          <div>
                            <p className="text-2xl font-bold">
                              {Math.round(databaseStats.total_documents / databaseStats.total_collections)}
                            </p>
                            <p className="text-sm text-gray-600">Avg per Collection</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Collections Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {databaseCollections.map((collection) => (
                    <Card key={collection.collection} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{collection.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">{collection.description}</p>
                          </div>
                          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {collection.count}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => loadCollectionData(collection.collection)}
                            disabled={databaseLoading}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Data
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Collection Data Viewer */}
                {selectedCollection && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Collection: {selectedCollection.collection}</span>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{selectedCollection.total_count} total documents</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedCollection(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Data Preview
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created/Updated
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {collectionData.map((doc, index) => (
                              <tr key={doc._id || doc.id || index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                                  {doc.id || doc._id || 'No ID'}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-900 max-w-xs truncate">
                                    {doc.title || doc.name || doc.email || doc.subject || doc.username ||
                                      Object.keys(doc).filter(key => !['_id', 'id', 'created_at', 'updated_at', 'password'].includes(key))
                                        .slice(0, 3).map(key => `${key}: ${doc[key]}`).join(', ') || 'No preview'}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {doc.created_at ? new Date(doc.created_at).toLocaleDateString() :
                                   doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : 'Unknown'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      navigator.clipboard.writeText(JSON.stringify(doc, null, 2));
                                      toast({ title: "Copied!", description: "Document data copied to clipboard" });
                                    }}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    Copy
                                  </Button>
                                  {selectedCollection.collection !== 'admin_users' && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => deleteDocumentFromCollection(selectedCollection.collection, doc.id || doc._id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {collectionData.length === 0 && (
                        <div className="text-center py-8">
                          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No documents found in this collection</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {databaseLoading && (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="text-gray-500 mt-2">Loading database information...</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'page-management' && (
              <PageManagement
                selectedPage={selectedPage}
                setSelectedPage={setSelectedPage}
                pageContent={pageContent}
                showPageSectionForm={showPageSectionForm}
                setShowPageSectionForm={setShowPageSectionForm}
                editingPageSection={editingPageSection}
                setEditingPageSection={setEditingPageSection}
                pageSectionForm={pageSectionForm}
                setPageSectionForm={setPageSectionForm}
                handleCreatePageSection={handleCreatePageSection}
                handleUpdatePageSection={handleUpdatePageSection}
                handleDeletePageSection={handleDeletePageSection}
              />
            )}

            {activeTab === 'users' && (
              <UserManagement
                users={users}
                showUserForm={showUserForm}
                setShowUserForm={setShowUserForm}
                editingUser={editingUser}
                setEditingUser={setEditingUser}
                userForm={userForm}
                setUserForm={setUserForm}
                showPasswordForm={showPasswordForm}
                setShowPasswordForm={setShowPasswordForm}
                passwordForm={passwordForm}
                setPasswordForm={setPasswordForm}
                handleCreateUser={handleCreateUser}
                handleUpdateUser={handleUpdateUser}
                handleDeleteUser={handleDeleteUser}
                handleUpdatePassword={handleUpdatePassword}
                currentUser={currentUser}
              />
            )}

            {activeTab === 'site-settings' && (
              <SiteSettings
                siteSettings={siteSettings}
                tempSiteSettings={tempSiteSettings}
                setTempSiteSettings={setTempSiteSettings}
                showSiteSettingsForm={showSiteSettingsForm}
                setShowSiteSettingsForm={setShowSiteSettingsForm}
                handleUpdateSiteSettings={handleUpdateSiteSettings}
                handleResetSiteSettings={handleResetSiteSettings}
              />
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Content Management</h2>
                </div>

                {/* Impact Statistics Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600">Impact Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">Update the impact statistics displayed on the homepage and throughout the website.</p>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Youth Trained
                        </label>
                        <Input
                          type="number"
                          value={impactStats.youthTrained || ''}
                          onChange={(e) => setImpactStats({...impactStats, youthTrained: parseInt(e.target.value) || 0})}
                          placeholder="e.g., 1300"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Youth Placed
                        </label>
                        <Input
                          type="number"
                          value={impactStats.youthPlaced || ''}
                          onChange={(e) => setImpactStats({...impactStats, youthPlaced: parseInt(e.target.value) || 0})}
                          placeholder="e.g., 1000"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Seniors Supported
                        </label>
                        <Input
                          type="number"
                          value={impactStats.seniorsSupported || ''}
                          onChange={(e) => setImpactStats({...impactStats, seniorsSupported: parseInt(e.target.value) || 0})}
                          placeholder="e.g., 6000"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Women Empowered
                        </label>
                        <Input
                          type="number"
                          value={impactStats.womenEmpowered || ''}
                          onChange={(e) => setImpactStats({...impactStats, womenEmpowered: parseInt(e.target.value) || 0})}
                          placeholder="e.g., 200"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button
                        onClick={handleUpdateImpactStats}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {loading ? 'Updating...' : 'Update Statistics'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Information Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-yellow-600">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">Current contact information displayed across the website:</p>

                    {/* Contact Info Edit Form */}
                    {showContactForm && (
                      <Card className="border-2 border-yellow-200 mb-6">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Edit Contact Information</span>
                            <Button variant="ghost" size="sm" onClick={handleCancelContactEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <Input
                              type="email"
                              value={tempContactInfo.email}
                              onChange={(e) => setTempContactInfo({...tempContactInfo, email: e.target.value})}
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <Input
                              type="tel"
                              value={tempContactInfo.phone}
                              onChange={(e) => setTempContactInfo({...tempContactInfo, phone: e.target.value})}
                              placeholder="Enter phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                            <Textarea
                              value={tempContactInfo.address}
                              onChange={(e) => setTempContactInfo({...tempContactInfo, address: e.target.value})}
                              placeholder="Enter full address"
                              rows={3}
                            />
                          </div>
                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleSaveContactInfo}
                              className="bg-yellow-400 hover:bg-yellow-500 text-black"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancelContactEdit}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">Email:</span>
                          <span className="ml-2 text-gray-600">{contactInfo.email}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditContact}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">Phone:</span>
                          <span className="ml-2 text-gray-600">{contactInfo.phone}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditContact}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">Address:</span>
                          <span className="ml-2 text-gray-600">{contactInfo.address}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleEditContact}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Page Content Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-600">Site Content Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">Edit content for all pages and sections across the website.</p>

                    {/* Content Edit Form */}
                    {showPageContentForm && (
                      <Card className="border-2 border-blue-200 mb-6">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Edit {editingPageSection} - {editingSubSection}</span>
                            <Button variant="ghost" size="sm" onClick={handleCancelPageContentEdit}>
                              <X className="h-4 w-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Dynamic form rendering based on section */}
                          {editingPageSection === 'homepage' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <Input
                                  value={getSiteContentValue('homepage.hero.title')}
                                  onChange={(e) => updateSiteContent('homepage.hero.title', e.target.value)}
                                  placeholder="Shield Foundation"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <Input
                                  value={getSiteContentValue('homepage.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('homepage.hero.subtitle', e.target.value)}
                                  placeholder="Adding Life to Years"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <Textarea
                                  value={getSiteContentValue('homepage.hero.description')}
                                  onChange={(e) => updateSiteContent('homepage.hero.description', e.target.value)}
                                  placeholder="Main hero description"
                                  rows={3}
                                />
                              </div>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Primary Button</label>
                                  <Input
                                    value={getSiteContentValue('homepage.hero.primaryButton')}
                                    onChange={(e) => updateSiteContent('homepage.hero.primaryButton', e.target.value)}
                                    placeholder="Support Our Mission"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Button</label>
                                  <Input
                                    value={getSiteContentValue('homepage.hero.secondaryButton')}
                                    onChange={(e) => updateSiteContent('homepage.hero.secondaryButton', e.target.value)}
                                    placeholder="Become a Volunteer"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {editingPageSection === 'homepage' && editingSubSection === 'programs' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                                <Input
                                  value={getSiteContentValue('homepage.programs.title')}
                                  onChange={(e) => updateSiteContent('homepage.programs.title', e.target.value)}
                                  placeholder="Our Programs"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                <Input
                                  value={getSiteContentValue('homepage.programs.subtitle')}
                                  onChange={(e) => updateSiteContent('homepage.programs.subtitle', e.target.value)}
                                  placeholder="Transforming lives through comprehensive support"
                                />
                              </div>
                              <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900">Youth Program</h4>
                                  <Input
                                    value={getSiteContentValue('homepage.programs.youthProgram.title')}
                                    onChange={(e) => updateSiteContent('homepage.programs.youthProgram.title', e.target.value)}
                                    placeholder="Youth Skilling & Livelihoods"
                                  />
                                  <Textarea
                                    value={getSiteContentValue('homepage.programs.youthProgram.description')}
                                    onChange={(e) => updateSiteContent('homepage.programs.youthProgram.description', e.target.value)}
                                    placeholder="Program description"
                                    rows={2}
                                  />
                                  <Input
                                    value={getSiteContentValue('homepage.programs.youthProgram.buttonText')}
                                    onChange={(e) => updateSiteContent('homepage.programs.youthProgram.buttonText', e.target.value)}
                                    placeholder="Learn More"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <h4 className="font-medium text-gray-900">Senior Program</h4>
                                  <Input
                                    value={getSiteContentValue('homepage.programs.seniorProgram.title')}
                                    onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.title', e.target.value)}
                                    placeholder="Senior Citizens Care"
                                  />
                                  <Textarea
                                    value={getSiteContentValue('homepage.programs.seniorProgram.description')}
                                    onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.description', e.target.value)}
                                    placeholder="Program description"
                                    rows={2}
                                  />
                                  <Input
                                    value={getSiteContentValue('homepage.programs.seniorProgram.buttonText')}
                                    onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.buttonText', e.target.value)}
                                    placeholder="Get Involved"
                                  />
                                </div>
                              </div>
                            </>
                          )}

                          {editingPageSection === 'about' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <Input
                                  value={getSiteContentValue('about.hero.title')}
                                  onChange={(e) => updateSiteContent('about.hero.title', e.target.value)}
                                  placeholder="About Shield Foundation"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                <Input
                                  value={getSiteContentValue('about.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('about.hero.subtitle', e.target.value)}
                                  placeholder="Our Story of Impact and Transformation"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <Textarea
                                  value={getSiteContentValue('about.hero.description')}
                                  onChange={(e) => updateSiteContent('about.hero.description', e.target.value)}
                                  placeholder="Hero section description"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'about' && editingSubSection === 'story' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                                <Input
                                  value={getSiteContentValue('about.story.title')}
                                  onChange={(e) => updateSiteContent('about.story.title', e.target.value)}
                                  placeholder="Our Story"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Story Content</label>
                                <Textarea
                                  value={getSiteContentValue('about.story.content')}
                                  onChange={(e) => updateSiteContent('about.story.content', e.target.value)}
                                  placeholder="Foundation story and background"
                                  rows={5}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Box Text</label>
                                <Input
                                  value={getSiteContentValue('about.story.highlightBox.text')}
                                  onChange={(e) => updateSiteContent('about.story.highlightBox.text', e.target.value)}
                                  placeholder="6+ Years Serving Communities"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Highlight Subtext</label>
                                <Input
                                  value={getSiteContentValue('about.story.highlightBox.subtext')}
                                  onChange={(e) => updateSiteContent('about.story.highlightBox.subtext', e.target.value)}
                                  placeholder="Transforming lives daily"
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'about' && editingSubSection === 'mission' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Title</label>
                                <Input
                                  value={getSiteContentValue('about.mission.title')}
                                  onChange={(e) => updateSiteContent('about.mission.title', e.target.value)}
                                  placeholder="Mission"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mission Content</label>
                                <Textarea
                                  value={getSiteContentValue('about.mission.content')}
                                  onChange={(e) => updateSiteContent('about.mission.content', e.target.value)}
                                  placeholder="Mission statement and description"
                                  rows={4}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'about' && editingSubSection === 'vision' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vision Title</label>
                                <Input
                                  value={getSiteContentValue('about.vision.title')}
                                  onChange={(e) => updateSiteContent('about.vision.title', e.target.value)}
                                  placeholder="Vision"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vision Content</label>
                                <Textarea
                                  value={getSiteContentValue('about.vision.content')}
                                  onChange={(e) => updateSiteContent('about.vision.content', e.target.value)}
                                  placeholder="Vision statement and description"
                                  rows={4}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'programs' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <Input
                                  value={getSiteContentValue('programs.hero.title')}
                                  onChange={(e) => updateSiteContent('programs.hero.title', e.target.value)}
                                  placeholder="Our Programs"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
                                <Input
                                  value={getSiteContentValue('programs.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('programs.hero.subtitle', e.target.value)}
                                  placeholder="Comprehensive Programs for Community Impact"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                                <Textarea
                                  value={getSiteContentValue('programs.hero.description')}
                                  onChange={(e) => updateSiteContent('programs.hero.description', e.target.value)}
                                  placeholder="Programs page description"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'impact' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <Input
                                  value={getSiteContentValue('impact.hero.title')}
                                  onChange={(e) => updateSiteContent('impact.hero.title', e.target.value)}
                                  placeholder="Our Impact"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
                                <Input
                                  value={getSiteContentValue('impact.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('impact.hero.subtitle', e.target.value)}
                                  placeholder="Measuring Success Through Lives Transformed"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                                <Textarea
                                  value={getSiteContentValue('impact.hero.description')}
                                  onChange={(e) => updateSiteContent('impact.hero.description', e.target.value)}
                                  placeholder="Impact page description"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'gallery' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <Input
                                  value={getSiteContentValue('gallery.hero.title')}
                                  onChange={(e) => updateSiteContent('gallery.hero.title', e.target.value)}
                                  placeholder="Gallery"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
                                <Input
                                  value={getSiteContentValue('gallery.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('gallery.hero.subtitle', e.target.value)}
                                  placeholder="Capturing Moments of Impact and Transformation"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                                <Textarea
                                  value={getSiteContentValue('gallery.hero.description')}
                                  onChange={(e) => updateSiteContent('gallery.hero.description', e.target.value)}
                                  placeholder="Gallery page description"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {editingPageSection === 'contact' && editingSubSection === 'hero' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
                                <Input
                                  value={getSiteContentValue('contact.hero.title')}
                                  onChange={(e) => updateSiteContent('contact.hero.title', e.target.value)}
                                  placeholder="Contact Us"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Subtitle</label>
                                <Input
                                  value={getSiteContentValue('contact.hero.subtitle')}
                                  onChange={(e) => updateSiteContent('contact.hero.subtitle', e.target.value)}
                                  placeholder="Get in Touch with Shield Foundation"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                                <Textarea
                                  value={getSiteContentValue('contact.hero.description')}
                                  onChange={(e) => updateSiteContent('contact.hero.description', e.target.value)}
                                  placeholder="Contact page description"
                                  rows={3}
                                />
                              </div>
                            </>
                          )}

                          {/* Add more section editors as needed */}

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleSavePageContent}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </Button>
                            <Button variant="outline" onClick={handleCancelPageContentEdit}>
                              Cancel
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Page and Section List */}
                    <div className="space-y-6">
                      {/* Homepage Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Homepage</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">Main title, subtitle, description, and buttons</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('homepage', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Programs Section</span>
                              <p className="text-sm text-gray-600">Program cards, titles, and descriptions</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('homepage', 'programs')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* About Page Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">About Page</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">About page title and introduction</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('about', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Foundation Story</span>
                              <p className="text-sm text-gray-600">Our story section and highlight box</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('about', 'story')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Mission Statement</span>
                              <p className="text-sm text-gray-600">Mission content and description</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('about', 'mission')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Vision Statement</span>
                              <p className="text-sm text-gray-600">Vision content and description</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('about', 'vision')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Programs Page Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Programs Page</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">Programs page title and introduction</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('programs', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Impact Page Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Impact Page</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">Impact page title and introduction</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('impact', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Gallery Page Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Gallery Page</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">Gallery page title and introduction</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('gallery', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Contact Page Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Contact Page</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Hero Section</span>
                              <p className="text-sm text-gray-600">Contact page title and introduction</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('contact', 'hero')}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* More sections can be added here */}
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-green-800 text-sm">
                          ✅ <strong>Content Management System Complete</strong> - All major page sections are now configurable through this admin panel.
                          You can edit content for Homepage, About, Programs, Impact, Gallery, and Contact pages. Additional sections can be easily added as needed.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Submissions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl text-yellow-600">Recent Submissions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">View and manage recent form submissions from visitors.</p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
                        <div className="text-sm text-gray-600">Contact Forms</div>
                        <div className="text-xs text-gray-500 mt-1">This week</div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-500 mb-2">8</div>
                        <div className="text-sm text-gray-600">Volunteer Applications</div>
                        <div className="text-xs text-gray-500 mt-1">This week</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">25</div>
                        <div className="text-sm text-gray-600">Newsletter Signups</div>
                        <div className="text-xs text-gray-500 mt-1">This week</div>
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        View All Contacts
                      </Button>
                      <Button variant="outline" className="border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-black">
                        View All Volunteers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
