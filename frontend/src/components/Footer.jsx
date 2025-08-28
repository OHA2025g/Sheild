import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '../hooks/use-toast';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { api, getSiteSettings } from '../api';

const Footer = () => {
  const { toast } = useToast();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [siteSettings, setSiteSettings] = useState({
    facebook_url: null,
    instagram_url: null,
    youtube_url: null,
    twitter_url: null,
    linkedin_url: null
  });

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setSiteSettings(settings);
      } catch (error) {
        console.log('Using default social media settings');
      }
    };
    
    loadSiteSettings();
  }, []);

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.subscribeNewsletter(newsletterEmail);
      toast({
        title: "Success",
        description: response.message,
      });
      setNewsletterEmail('');
    } catch (error) {
      // Handle FastAPI validation errors properly
      let errorMessage = "Failed to subscribe. Please try again.";
      
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

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center mb-4">
              <Heart className="h-8 w-8 text-yellow-400 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">Shield Foundation</h1>
                <p className="text-sm text-gray-400">Adding Life to Years</p>
              </div>
            </Link>
            <p className="text-gray-300 mb-6 max-w-md">
              Shield Foundation is a Mumbai-based non-profit organization dedicated to empowering 
              communities through youth skilling programs and comprehensive senior citizen care.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-gray-300">shieldfoundation@gmail.com</span>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-gray-300">+91 98334 06288</span>
              </div>
              <div className="flex items-center text-sm">
                <MapPin className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-gray-300">Dharavi, Mumbai, Maharashtra</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex space-x-4">
              {siteSettings.facebook_url && (
                <a 
                  href={siteSettings.facebook_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {siteSettings.twitter_url && (
                <a 
                  href={siteSettings.twitter_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {siteSettings.instagram_url && (
                <a 
                  href={siteSettings.instagram_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {siteSettings.youtube_url && (
                <a 
                  href={siteSettings.youtube_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {siteSettings.linkedin_url && (
                <a 
                  href={siteSettings.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              
              {/* Show fallback message if no social links are configured */}
              {!siteSettings.facebook_url && !siteSettings.twitter_url && !siteSettings.instagram_url && 
               !siteSettings.youtube_url && !siteSettings.linkedin_url && (
                <p className="text-gray-500 text-sm">
                  Social links can be configured in the admin panel
                </p>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-300 hover:text-yellow-400 transition-colors">Programs</Link></li>
              <li><Link to="/impact" className="text-gray-300 hover:text-yellow-400 transition-colors">Impact</Link></li>
              <li><Link to="/gallery" className="text-gray-300 hover:text-yellow-400 transition-colors">Gallery</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-yellow-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for updates on our programs and impact.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                required
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit"
                disabled={loading}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Shield Foundation. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Terms of Service
              </a>
              <Link to="/admin" className="text-gray-400 hover:text-yellow-400 text-sm transition-colors">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;