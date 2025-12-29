import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { useAlert } from '../hooks/use-alert';
import AlertDialog from './ui/alert-dialog';
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
  Layout,
  Quote,
  DollarSign
} from 'lucide-react';
import TiptapEditor from './TiptapEditor';
import { api } from '../api';
import UserManagement from './admin-sections/UserManagement';
import SiteSettings from './admin-sections/SiteSettings';
import PageManagement from './admin-sections/PageManagement';

const AdminPanel = () => {
  const navigate = useNavigate();
  const { alert, showAlert, closeAlert } = useAlert();
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
    email: '',
    phone: '',
    address: '',
    office_hours: ''
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

  // Testimonials Management state
  const [testimonials, setTestimonials] = useState([]);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    company: '',
    content: '',
    image: '',
    rating: 5,
    order: 0,
    is_active: true
  });

  // Donations Management state
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [donationForm, setDonationForm] = useState({
    status: 'pending',
    payment_reference: '',
    notes: ''
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
      showAlert({
        title: "Error",
        description: "Failed to load news articles.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    api.admin.logout();
    showAlert({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      variant: "success",
    });
    navigate('/admin');
  };

  const handleAddNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      showAlert({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.admin.createNews(newsForm);
      showAlert({
        title: "Success",
        description: "News article created successfully!",
        variant: "success",
      });
      setNewsForm({ title: '', content: '', status: 'draft' });
      setShowNewsForm(false);
      loadNews(); // Reload news list
    } catch (error) {
      showAlert({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create news article.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdateNews = async () => {
    if (!newsForm.title.trim() || !newsForm.content.trim()) {
      showAlert({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await api.admin.updateNews(editingNews.id, newsForm);
      showAlert({
        title: "Success",
        description: "News article updated successfully!",
        variant: "success",
      });
      setNewsForm({ title: '', content: '', status: 'draft' });
      setEditingNews(null);
      loadNews(); // Reload news list
    } catch (error) {
      showAlert({
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
      showAlert({
        title: "Success",
        description: "News article deleted successfully!",
        variant: "success",
      });
      loadNews(); // Reload news list
    } catch (error) {
      showAlert({
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
      showAlert({
        title: "Success",
        description: "Impact statistics updated successfully!",
        variant: "success",
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

      showAlert({
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
      showAlert({
        title: "Error",
        description: "Failed to load success stories.",
        variant: "destructive",
      });
    }
  };

  const handleSaveSuccessStory = async () => {
    if (!successStoryForm.name.trim() || !successStoryForm.story.trim()) {
      showAlert({
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
        showAlert({
          title: "Success",
          description: "Success story updated successfully!",
          variant: "success",
        });
      } else {
        await api.admin.addSuccessStory(successStoryForm);
        showAlert({
          title: "Success",
          description: "Success story created successfully!",
          variant: "success",
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
      showAlert({
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
        showAlert({
          title: "Success",
          description: "Success story deleted successfully!",
          variant: "success",
        });
        loadSuccessStories();
      } catch (error) {
        showAlert({
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
      showAlert({
        title: "Error",
        description: "Failed to load team members.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTeamMember = async () => {
    if (!teamMemberForm.name.trim() || !teamMemberForm.role.trim() || !teamMemberForm.image.trim() || !teamMemberForm.category.trim()) {
      showAlert({
        title: "Error",
        description: "Please fill in all required fields (Name, Role, Image, and Category).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingTeamMember) {
        await api.admin.updateTeamMember(editingTeamMember.id, teamMemberForm);
        showAlert({
          title: "Success",
          description: "Team member updated successfully!",
          variant: "success",
        });
      } else {
        await api.admin.addTeamMember(teamMemberForm);
        showAlert({
          title: "Success",
          description: "Team member created successfully!",
          variant: "success",
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
      showAlert({
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
        showAlert({
          title: "Success",
          description: "Team member deleted successfully!",
          variant: "success",
        });
        loadTeamMembers();
      } catch (error) {
        showAlert({
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
      showAlert({
        title: "Error",
        description: "Failed to load gallery items.",
        variant: "destructive",
      });
    }
  };

  const handleSaveGalleryItem = async () => {
    if (!galleryForm.title.trim() || !galleryForm.category.trim()) {
      showAlert({
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
        showAlert({
          title: "Success",
          description: "Gallery item updated successfully!",
          variant: "success",
        });
      } else {
        await api.admin.addGalleryItem(formData);
        showAlert({
          title: "Success",
          description: "Gallery item created successfully!",
          variant: "success",
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
      showAlert({
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
      showAlert({
        title: "Success",
        description: "Gallery item deleted successfully!",
        variant: "success",
      });
      loadGalleryItems();
    } catch (error) {
      console.error('Failed to delete gallery item:', error);
      showAlert({
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

  // Testimonials Management Functions
  const loadTestimonials = async () => {
    try {
      const data = await api.admin.getAllTestimonials();
      setTestimonials(data.testimonials || []);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
      showAlert({
        title: "Error",
        description: "Failed to load testimonials.",
        variant: "destructive",
      });
    }
  };

  const handleSaveTestimonial = async () => {
    if (!testimonialForm.name.trim() || !testimonialForm.role.trim() || !testimonialForm.content.trim()) {
      showAlert({
        title: "Error",
        description: "Please fill in name, role, and content fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (editingTestimonial) {
        await api.admin.updateTestimonial(editingTestimonial.id, testimonialForm);
        showAlert({
          title: "Success",
          description: "Testimonial updated successfully!",
          variant: "success",
        });
      } else {
        await api.admin.addTestimonial(testimonialForm);
        showAlert({
          title: "Success",
          description: "Testimonial created successfully!",
          variant: "success",
        });
      }

      setTestimonialForm({
        name: '',
        role: '',
        company: '',
        content: '',
        image: '',
        rating: 5,
        order: 0,
        is_active: true
      });
      setShowTestimonialForm(false);
      setEditingTestimonial(null);
      loadTestimonials();
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Failed to save testimonial. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditTestimonial = (testimonial) => {
    setTestimonialForm({
      name: testimonial.name || '',
      role: testimonial.role || '',
      company: testimonial.company || '',
      content: testimonial.content || '',
      image: testimonial.image || '',
      rating: testimonial.rating || 5,
      order: testimonial.order || 0,
      is_active: testimonial.is_active !== undefined ? testimonial.is_active : true
    });
    setEditingTestimonial(testimonial);
    setShowTestimonialForm(true);
  };

  const handleDeleteTestimonial = async (testimonialId) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) {
      return;
    }

    setLoading(true);
    try {
      await api.admin.deleteTestimonial(testimonialId);
      showAlert({
        title: "Success",
        description: "Testimonial deleted successfully!",
        variant: "success",
      });
      loadTestimonials();
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Failed to delete testimonial.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const cancelTestimonialEdit = () => {
    setTestimonialForm({
      name: '',
      role: '',
      company: '',
      content: '',
      image: '',
      rating: 5,
      order: 0,
      is_active: true
    });
    setEditingTestimonial(null);
    setShowTestimonialForm(false);
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

  // Donations Management Functions
  const loadDonations = async () => {
    try {
      const data = await api.admin.getAllDonations();
      setDonations(data || []);
    } catch (error) {
      console.error('Failed to load donations:', error);
      showAlert({
        title: "Error",
        description: "Failed to load donations.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateDonation = async (donationId) => {
    setLoading(true);
    try {
      await api.admin.updateDonation(donationId, donationForm);
      showAlert({
        title: "Success",
        description: "Donation updated successfully!",
        variant: "success",
      });
      setDonationForm({
        status: 'pending',
        payment_reference: '',
        notes: ''
      });
      setEditingDonation(null);
      loadDonations();
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Failed to update donation. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleEditDonation = (donation) => {
    setDonationForm({
      status: donation.status || 'pending',
      payment_reference: donation.payment_reference || '',
      notes: donation.notes || ''
    });
    setEditingDonation(donation);
  };

  const handleDeleteDonation = async (donationId) => {
    if (!window.confirm('Are you sure you want to delete this donation record?')) {
      return;
    }

    setLoading(true);
    try {
      await api.admin.deleteDonation(donationId);
      showAlert({
        title: "Success",
        description: "Donation deleted successfully!",
        variant: "success",
      });
      loadDonations();
    } catch (error) {
      showAlert({
        title: "Error",
        description: "Failed to delete donation.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Database Management Functions
  const loadDatabaseCollections = async () => {
    try {
      setDatabaseLoading(true);
      const data = await api.admin.getDatabaseCollections();
      setDatabaseCollections(data.collections || []);
    } catch (error) {
      console.error('Failed to load database collections:', error);
      showAlert({
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
      showAlert({
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
      showAlert({
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
      showAlert({
        title: "Success",
        description: "Document deleted successfully!",
        variant: "success",
      });

      // Reload the collection data
      await loadCollectionData(collectionName);

      // Reload stats to update counts
      await loadDatabaseStats();
      await loadDatabaseCollections();
    } catch (error) {
      console.error('Failed to delete document:', error);
      showAlert({
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
        
        // Load contact info from site content
        const contactInfoFromContent = backendContent.content?.contact?.contactInfo || {};
        if (Object.keys(contactInfoFromContent).length > 0) {
          setContactInfo({
            email: contactInfoFromContent.email || '',
            phone: contactInfoFromContent.phone || '',
            address: contactInfoFromContent.address || '',
            office_hours: contactInfoFromContent.office_hours || ''
          });
        }
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
    if (activeTab === 'testimonials' && currentUser) {
      loadTestimonials();
    }
    if (activeTab === 'donations' && currentUser) {
      loadDonations();
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
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Blog post created successfully!",
        variant: "success",
      });

      cancelBlogEdit(); // This now correctly happens after the state update

    } catch (error) {
      showAlert({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create blog post.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };
  
  const handleUpdateBlog = async () => {
    if (!blogForm.title.trim() || !blogForm.content.trim()) {
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Blog post updated successfully!",
        variant: "success",
      });

      cancelBlogEdit(); // Resets and hides the form
      await loadBlogPosts(); // Reloads the list from the database

    } catch (error) {
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Blog post deleted successfully!",
        variant: "success",
      });

      await loadBlogPosts(); // Reload the list from the database

    } catch (error) {
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Page content updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to save page content:', error);
      showAlert({
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
        address: tempContactInfo.address,
        office_hours: tempContactInfo.office_hours
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

      showAlert({
        title: "Success",
        description: "Contact information updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to save contact info:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "User created successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to create user:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "User updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to update user:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "User deleted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      showAlert({
        title: "Error",
        description: error.response?.data?.detail || "Failed to delete user. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Password updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to update password:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Site settings updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to update site settings:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Page section created successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to create page section:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Page section updated successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to update page section:', error);
      showAlert({
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

      showAlert({
        title: "Success",
        description: "Page section deleted successfully!",
        variant: "success",
      });
    } catch (error) {
      console.error('Failed to delete page section:', error);
      showAlert({
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
          <div className="w-72 flex-shrink-0">
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
                    variant={activeTab === 'testimonials' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('testimonials')}
                    className="w-full justify-start"
                  >
                    <Quote className="h-4 w-4 mr-2" />
                    Testimonials
                  </Button>
                  <Button
                    variant={activeTab === 'donations' ? 'default' : 'ghost'}
                    onClick={() => setActiveTab('donations')}
                    className="w-full justify-start"
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Donations
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
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <Textarea
                          value={teamMemberForm.description}
                          onChange={(e) => setTeamMemberForm({...teamMemberForm, description: e.target.value})}
                          placeholder="Brief description of the team member's background and expertise (optional)..."
                          rows={3}
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

            {activeTab === 'testimonials' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
                  <Button
                    onClick={() => setShowTestimonialForm(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Testimonial
                  </Button>
                </div>

                <div className="space-y-4">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          {testimonial.image && (
                            <img
                              src={testimonial.image}
                              alt={testimonial.name}
                              className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-blue-100"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{testimonial.name}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                testimonial.is_active !== false
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {testimonial.is_active !== false ? 'Active' : 'Inactive'}
                              </span>
                              {testimonial.rating && (
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < testimonial.rating
                                          ? 'text-yellow-400 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-gray-600 mb-2">
                              <span className="font-medium">{testimonial.role}</span>
                              {testimonial.company && `, ${testimonial.company}`}
                            </p>
                            <p className="text-gray-700 italic line-clamp-2 mb-2">
                              "{testimonial.content}"
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>Order: {testimonial.order}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditTestimonial(testimonial)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
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

                  {testimonials.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No testimonials yet. Add your first testimonial!</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Testimonial Form Modal */}
                {showTestimonialForm && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{editingTestimonial ? 'Edit Testimonial' : 'Create New Testimonial'}</span>
                        <Button variant="ghost" size="sm" onClick={cancelTestimonialEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                          <Input
                            value={testimonialForm.name}
                            onChange={(e) => setTestimonialForm({...testimonialForm, name: e.target.value})}
                            placeholder="Enter person's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                          <Input
                            value={testimonialForm.role}
                            onChange={(e) => setTestimonialForm({...testimonialForm, role: e.target.value})}
                            placeholder="e.g., Program Graduate, Volunteer"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company/Organization</label>
                        <Input
                          value={testimonialForm.company}
                          onChange={(e) => setTestimonialForm({...testimonialForm, company: e.target.value})}
                          placeholder="Optional: Company or organization name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Testimonial Content *</label>
                        <Textarea
                          value={testimonialForm.content}
                          onChange={(e) => setTestimonialForm({...testimonialForm, content: e.target.value})}
                          placeholder="Enter the testimonial text..."
                          rows={4}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                        <Input
                          value={testimonialForm.image}
                          onChange={(e) => setTestimonialForm({...testimonialForm, image: e.target.value})}
                          placeholder="https://example.com/photo.jpg"
                        />
                        <p className="text-xs text-gray-500 mt-1">Optional: URL to person's photo</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                          <Select 
                            value={testimonialForm.rating?.toString()} 
                            onValueChange={(value) => setTestimonialForm({...testimonialForm, rating: parseInt(value)})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select rating" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 Star</SelectItem>
                              <SelectItem value="2">2 Stars</SelectItem>
                              <SelectItem value="3">3 Stars</SelectItem>
                              <SelectItem value="4">4 Stars</SelectItem>
                              <SelectItem value="5">5 Stars</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                          <Input
                            type="number"
                            value={testimonialForm.order}
                            onChange={(e) => setTestimonialForm({...testimonialForm, order: parseInt(e.target.value) || 0})}
                            placeholder="0"
                          />
                          <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="testimonial_is_active"
                          checked={testimonialForm.is_active}
                          onChange={(e) => setTestimonialForm({...testimonialForm, is_active: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="testimonial_is_active" className="text-sm font-medium text-gray-700">
                          Active (show on website)
                        </label>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={cancelTestimonialEdit}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSaveTestimonial}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Saving...' : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'donations' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Donations Management</h2>
                </div>

                <div className="space-y-4">
                  {donations.map((donation) => (
                    <Card key={donation.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {donation.anonymous ? 'Anonymous Donor' : donation.name}
                              </h3>
                              <Badge className={
                                donation.status === 'completed' ? 'bg-green-100 text-green-800' :
                                donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                donation.status === 'failed' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }>
                                {donation.status}
                              </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-gray-600">
                                  <span className="font-medium">Amount:</span> {donation.currency} {typeof donation.amount === 'number' ? donation.amount.toLocaleString() : parseFloat(donation.amount || 0).toLocaleString()}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Payment Method:</span> {donation.payment_method}
                                </p>
                                {donation.recurring && (
                                  <p className="text-gray-600">
                                    <span className="font-medium">Recurring:</span> {donation.frequency || 'N/A'}
                                  </p>
                                )}
                              </div>
                              <div>
                                {!donation.anonymous && (
                                  <>
                                    <p className="text-gray-600">
                                      <span className="font-medium">Email:</span> {donation.email}
                                    </p>
                                    {donation.phone && (
                                      <p className="text-gray-600">
                                        <span className="font-medium">Phone:</span> {donation.phone}
                                      </p>
                                    )}
                                  </>
                                )}
                                <p className="text-gray-600">
                                  <span className="font-medium">Date:</span> {new Date(donation.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            {donation.message && (
                              <p className="text-gray-700 mt-2 italic">"{donation.message}"</p>
                            )}
                            {donation.payment_reference && (
                              <p className="text-gray-600 mt-2 text-sm">
                                <span className="font-medium">Payment Reference:</span> {donation.payment_reference}
                              </p>
                            )}
                            {donation.notes && (
                              <p className="text-gray-600 mt-2 text-sm">
                                <span className="font-medium">Notes:</span> {donation.notes}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditDonation(donation)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteDonation(donation.id)}
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

                  {donations.length === 0 && (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No donations yet.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Donation Edit Form */}
                {editingDonation && (
                  <Card className="border-2 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Update Donation Status</span>
                        <Button variant="ghost" size="sm" onClick={() => setEditingDonation(null)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <Select
                          value={donationForm.status}
                          onValueChange={(value) => setDonationForm({...donationForm, status: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Reference</label>
                        <Input
                          value={donationForm.payment_reference}
                          onChange={(e) => setDonationForm({...donationForm, payment_reference: e.target.value})}
                          placeholder="Enter payment reference number"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                        <Textarea
                          value={donationForm.notes}
                          onChange={(e) => setDonationForm({...donationForm, notes: e.target.value})}
                          placeholder="Add any notes about this donation..."
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        <Button variant="outline" onClick={() => setEditingDonation(null)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleUpdateDonation(editingDonation.id)}
                          disabled={loading}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          {loading ? 'Updating...' : 'Update Donation'}
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
                                      showAlert({ title: "Copied!", description: "Document data copied to clipboard", variant: "success" });
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
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                            <Input
                              value={tempContactInfo.office_hours}
                              onChange={(e) => setTempContactInfo({...tempContactInfo, office_hours: e.target.value})}
                              placeholder="e.g., Monday - Friday: 10:00 AM - 6:00 PM"
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
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">Office Hours:</span>
                          <span className="ml-2 text-gray-600">{contactInfo.office_hours}</span>
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
                                  placeholder="Our Core Programs"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                                <Input
                                  value={getSiteContentValue('homepage.programs.subtitle')}
                                  onChange={(e) => updateSiteContent('homepage.programs.subtitle', e.target.value)}
                                  placeholder="Shield Foundation focuses on two major domains that create lasting impact in communities"
                                />
                              </div>
                              <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="space-y-4 p-4 border rounded-lg">
                                  <h4 className="font-semibold text-gray-900 text-lg">Youth Program</h4>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.title')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.title', e.target.value)}
                                      placeholder="Youth Skilling & Livelihoods"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Partnership Info</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.partnership')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.partnership', e.target.value)}
                                      placeholder="Partnership with Tech Mahindra Foundation"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Textarea
                                      value={getSiteContentValue('homepage.programs.youthProgram.description')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.description', e.target.value)}
                                      placeholder="Specialized vocational training programs for underprivileged youth..."
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.buttonText')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.buttonText', e.target.value)}
                                      placeholder="Learn More"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 1</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.feature1')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.feature1', e.target.value)}
                                      placeholder="e.g., 1300+ youth trained across all programs"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 2</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.feature2')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.feature2', e.target.value)}
                                      placeholder="e.g., 1000+ placed with reputed employers"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 3</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.youthProgram.feature3')}
                                      onChange={(e) => updateSiteContent('homepage.programs.youthProgram.feature3', e.target.value)}
                                      placeholder="e.g., Average salary: ₹8,700 - ₹13,946/month"
                                    />
                                  </div>
                                </div>
                                <div className="space-y-4 p-4 border rounded-lg">
                                  <h4 className="font-semibold text-gray-900 text-lg">Senior Program</h4>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Title</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.title')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.title', e.target.value)}
                                      placeholder="Senior Citizens Services"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.subtitle')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.subtitle', e.target.value)}
                                      placeholder="Multi-Service Support Centers"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <Textarea
                                      value={getSiteContentValue('homepage.programs.seniorProgram.description')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.description', e.target.value)}
                                      placeholder="Comprehensive healthcare, psychosocial, legal, and recreational services..."
                                      rows={3}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.buttonText')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.buttonText', e.target.value)}
                                      placeholder="Learn More"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 1</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.feature1')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.feature1', e.target.value)}
                                      placeholder="e.g., 2000+ seniors in daily exercise & yoga"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 2</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.feature2')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.feature2', e.target.value)}
                                      placeholder="e.g., 750+ free cataract surgeries performed"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Feature 3</label>
                                    <Input
                                      value={getSiteContentValue('homepage.programs.seniorProgram.feature3')}
                                      onChange={(e) => updateSiteContent('homepage.programs.seniorProgram.feature3', e.target.value)}
                                      placeholder="e.g., 500+ elder abuse cases addressed"
                                    />
                                  </div>
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

                          {editingPageSection === 'footer' && editingSubSection === 'content' && (
                            <>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Organization Tagline</label>
                                <Input
                                  value={getSiteContentValue('footer.tagline')}
                                  onChange={(e) => updateSiteContent('footer.tagline', e.target.value)}
                                  placeholder="Adding Life to Years"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Footer Description</label>
                                <Textarea
                                  value={getSiteContentValue('footer.description')}
                                  onChange={(e) => updateSiteContent('footer.description', e.target.value)}
                                  placeholder="Shield Foundation is a Mumbai-based non-profit organization dedicated to empowering communities through youth skilling programs and comprehensive senior citizen care."
                                  rows={4}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Text</label>
                                <Input
                                  value={getSiteContentValue('footer.copyright')}
                                  onChange={(e) => updateSiteContent('footer.copyright', e.target.value)}
                                  placeholder="© 2024 Shield Foundation. All rights reserved."
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

                      {/* Footer Sections */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Footer</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div>
                              <span className="font-medium">Footer Content</span>
                              <p className="text-sm text-gray-600">Description, tagline, and organization info</p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditPageContent('footer', 'content')}
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

      {/* Alert Dialog */}
      <AlertDialog
        open={alert.open}
        onOpenChange={(open) => {
          if (!open) closeAlert();
        }}
        title={alert.title}
        description={alert.description}
        variant={alert.variant}
      />
    </div>
  );
};

export default AdminPanel;
