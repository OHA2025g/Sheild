import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '../hooks/use-toast';
import { Heart, Users, GraduationCap, Award, Phone, Mail, MapPin, ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { api, getPublicSiteContent } from '../api';

import Header from './Header';
import Footer from './Footer';
import TestimonialsSection from './TestimonialsSection';
import ImpactHighlightsSection from './ImpactHighlightsSection';

const Homepage = () => {
  const { toast } = useToast();
  const [contactForm, setContactForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [impactStats, setImpactStats] = useState({});

  // Site content state
  const [siteContent, setSiteContent] = useState({});

  // Load site content and impact statistics on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load impact statistics
        const stats = await api.getImpactStats();
        setImpactStats(stats);
        
        // Load site content from database API
        try {
          const backendContent = await getPublicSiteContent();
          if (backendContent.content && Object.keys(backendContent.content).length > 0) {
            setSiteContent(backendContent.content);
          } else {
            setSiteContent({});
          }
        } catch (error) {
          console.log('Using empty site content');
          setSiteContent({});
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      }
    };
    
    loadData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.submitContactForm(contactForm);
      toast({
        title: "Success",
        description: response.message,
      });
      setContactForm({ name: '', email: '', phone: '', subject: '', message: '', inquiryType: 'general' });
    } catch (error) {
      // Handle FastAPI validation errors properly
      let errorMessage = "Failed to send message. Please try again.";
      
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    
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
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {siteContent?.homepage?.hero?.title || "Adding Life to Years"}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              {siteContent?.homepage?.hero?.description || "Empowering Youth & Caring for Seniors - Shield Foundation equips and empowers communities so that every individual can live with dignity till the end of life."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild
                size="lg" 
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                <Link to="/donate">
                  {siteContent?.homepage?.hero?.primaryButton || "Support Our Mission"}
                </Link>
              </Button>
              <Button 
                asChild
                variant="outline" 
                size="lg" 
                className="border-yellow-400 text-yellow-600 hover:bg-yellow-400 hover:text-black px-8 py-3 text-lg"
              >
                <Link to="/contact">
                  {siteContent?.homepage?.hero?.secondaryButton || "Become a Volunteer"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {impactStats.youthTrained?.toLocaleString()}+
              </div>
              <div className="text-gray-600">Youth Trained</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                {impactStats.youthPlaced?.toLocaleString()}+
              </div>
              <div className="text-gray-600">Youth Placed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                {impactStats.seniorsSupported?.toLocaleString()}+
              </div>
              <div className="text-gray-600">Seniors Supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-yellow-500 mb-2">
                {impactStats.womenEmpowered}+
              </div>
              <div className="text-gray-600">Women Empowered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Overview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {siteContent?.homepage?.programs?.title || "Our Core Programs"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {siteContent?.homepage?.programs?.subtitle || "Shield Foundation focuses on two major domains that create lasting impact in communities"}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Youth Skilling */}
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-12 w-12 text-blue-600 mr-4" />
                  <div>
                    <CardTitle className="text-2xl">
                      {siteContent?.homepage?.programs?.youthProgram?.title || "Youth Skilling & Livelihoods"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {siteContent?.homepage?.programs?.youthProgram?.partnership || ""}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-gray-600 mb-6">
                    {siteContent?.homepage?.programs?.youthProgram?.description || "Specialized vocational training programs for underprivileged youth focusing on CRS, ITES-BPO, and Nursing Assistant courses."}
                  </p>
                  <div className="space-y-2 mb-6">
                    {siteContent?.homepage?.programs?.youthProgram?.feature1 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.youthProgram.feature1}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.youthProgram?.feature2 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.youthProgram.feature2}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.youthProgram?.feature3 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.youthProgram.feature3}
                      </div>
                    )}
                    {/* Fallback to dynamic stats if features not set */}
                    {!siteContent?.homepage?.programs?.youthProgram?.feature1 && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {impactStats.youthTrained?.toLocaleString()}+ youth trained across all programs
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {impactStats.youthPlaced?.toLocaleString()}+ placed with reputed employers
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          Average salary: ₹8,700 - ₹13,946/month
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto">
                  <Link to="/programs">
                    {siteContent?.homepage?.programs?.youthProgram?.buttonText || "Learn More"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Senior Citizens */}
            <Card className="h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
              <CardHeader>
                <div className="flex items-center mb-4">
                  <Heart className="h-12 w-12 text-yellow-500 mr-4" />
                  <div>
                    <CardTitle className="text-2xl">
                      {siteContent?.homepage?.programs?.seniorProgram?.title || "Senior Citizens Services"}
                    </CardTitle>
                    <CardDescription className="text-lg">
                      {siteContent?.homepage?.programs?.seniorProgram?.subtitle || "Multi-Service Support Centers"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className="flex-grow">
                  <p className="text-gray-600 mb-6">
                    {siteContent?.homepage?.programs?.seniorProgram?.description || "Comprehensive healthcare, psychosocial, legal, and recreational services for elderly in Dharavi and beyond."}
                  </p>
                  <div className="space-y-2 mb-6">
                    {siteContent?.homepage?.programs?.seniorProgram?.feature1 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.seniorProgram.feature1}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.seniorProgram?.feature2 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.seniorProgram.feature2}
                      </div>
                    )}
                    {siteContent?.homepage?.programs?.seniorProgram?.feature3 && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {siteContent.homepage.programs.seniorProgram.feature3}
                      </div>
                    )}
                    {/* Fallback to default if features not set */}
                    {!siteContent?.homepage?.programs?.seniorProgram?.feature1 && (
                      <>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          2000+ seniors in daily exercise & yoga
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          750+ free cataract surgeries performed
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          500+ elder abuse cases addressed
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black mt-auto">
                  <Link to="/programs">
                    {siteContent?.homepage?.programs?.seniorProgram?.buttonText || "Learn More"} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Highlights Section */}
      <ImpactHighlightsSection />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Contact Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    required
                    rows={4}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-yellow-400 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-white/80">{siteContent?.contact?.contactInfo?.email || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-yellow-400 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-white/80">{siteContent?.contact?.contactInfo?.phone || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-yellow-400 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p className="text-white/80">{siteContent?.contact?.contactInfo?.address || ""}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-yellow-400 mr-4 mt-1" />
                  <div>
                    <p className="font-semibold">Office Hours</p>
                    <p className="text-white/80">{siteContent?.contact?.contactInfo?.office_hours || ""}</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="mt-12 p-6 bg-white/10 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Stay Updated</h3>
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                  />
                  <Button 
                    type="submit"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black whitespace-nowrap"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Homepage;
