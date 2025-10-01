import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { Mail, Phone, MapPin, Clock, Heart, Users, HandHeart, UserPlus } from 'lucide-react';
import { api } from '../api';

import { getPublicSiteContent } from '../api';
import Header from './Header';
import Footer from './Footer';

const Contact = () => {
  const { toast } = useToast();
  // Site content state
  const [siteContent, setSiteContent] = useState({});

  // Load site content on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from public API first
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
    };
    
    loadData();
  }, []);

  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    occupation: '',
    skills: '',
    availability: '',
    interests: [],
    experience: '',
    motivation: ''
  });

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Interest options for volunteers
  const interestOptions = [
    { id: 'youth', label: 'Youth Skilling Programs' },
    { id: 'seniors', label: 'Senior Citizen Care' },
    { id: 'events', label: 'Events & Activities' },
    { id: 'fundraising', label: 'Fundraising' },
    { id: 'admin', label: 'Administrative Support' }
  ];

  // Handle contact form submission
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitContact(contactForm);
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setContactForm({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Handle volunteer form submission
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitVolunteer(volunteerForm);
      toast({
        title: "Application Submitted!",
        description: "Thank you for your interest in volunteering. We'll contact you soon.",
      });
      setVolunteerForm({
        name: '',
        email: '',
        phone: '',
        age: '',
        occupation: '',
        skills: '',
        availability: '',
        interests: [],
        experience: '',
        motivation: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    setLoading(true);
    try {
      await api.subscribeNewsletter({ email: newsletterEmail });
      toast({
        title: "Subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setNewsletterEmail('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  // Handle volunteer interest changes
  const handleInterestChange = (interestId, checked) => {
    setVolunteerForm(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interestId]
        : prev.interests.filter(id => id !== interestId)
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {siteContent.contact?.hero?.title || "Contact Us"}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {siteContent.contact?.hero?.subtitle || "Get in Touch - We're Here to Help"}
          </p>
          {siteContent.contact?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {siteContent.contact?.hero?.description}
            </p>
          )}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Visit Us</h3>
                {/*               <p className="text-gray-600">
                  A-202, Runwal Pinnacle<br />
                  Thane West, Maharashtra 400604<br />
                  Mumbai, India
                </p> */}
                {/* This now pulls the address from the database */}
                <p className="text-gray-600 whitespace-pre-line">
                  {siteContent.contact?.contactInfo?.address || "Default Address"}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <Phone className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                {/*<p className="text-gray-600">
                  <strong>Main Office:</strong><br />
                  +91 98765 43210<br />
                  <strong>Programs:</strong><br />
                  +91 98765 43211
                </p>*/}
                <p className="text-gray-600">
                  {siteContent.contact?.contactInfo?.phone || "loading..."}
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg">
              <CardContent className="pt-8">
                <Mail className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email Us</h3>
                {/*<p className="text-gray-600">
                  <strong>General:</strong><br />
                  info@shieldfoundation.org<br />
                  <strong>Programs:</strong><br />
                  programs@shieldfoundation.org
                </p>*/}
                <p className="text-gray-600">
                  {siteContent.contact?.contactInfo?.email || "loading..."}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Office Hours */}
          <div className="text-center mb-16">
            <Card className="max-w-md mx-auto border-0 shadow-lg">
              <CardContent className="pt-8">
                <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Office Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                  <p><strong>Saturday:</strong> 9:00 AM - 2:00 PM</p>
                  <p><strong>Sunday:</strong> Closed</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-600 flex items-center">
                  <Mail className="h-6 w-6 mr-2" />
                  Send Us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                      <Input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <Input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                      <Input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      rows={5}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Volunteer Application Form */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-600 flex items-center">
                  <Heart className="h-6 w-6 mr-2" />
                  Volunteer With Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <Input
                        type="text"
                        value={volunteerForm.name}
                        onChange={(e) => setVolunteerForm({...volunteerForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <Input
                        type="email"
                        value={volunteerForm.email}
                        onChange={(e) => setVolunteerForm({...volunteerForm, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <Input
                        type="tel"
                        value={volunteerForm.phone}
                        onChange={(e) => setVolunteerForm({...volunteerForm, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                      <Input
                        type="number"
                        value={volunteerForm.age}
                        onChange={(e) => setVolunteerForm({...volunteerForm, age: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <Input
                      type="text"
                      value={volunteerForm.occupation}
                      onChange={(e) => setVolunteerForm({...volunteerForm, occupation: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skills & Expertise</label>
                    <Textarea
                      value={volunteerForm.skills}
                      onChange={(e) => setVolunteerForm({...volunteerForm, skills: e.target.value})}
                      rows={3}
                      placeholder="Tell us about your skills, expertise, or professional background"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Areas of Interest *</label>
                    <div className="space-y-2">
                      {interestOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={volunteerForm.interests.includes(option.id)}
                            onCheckedChange={(checked) => handleInterestChange(option.id, checked)}
                          />
                          <label htmlFor={option.id} className="text-sm text-gray-700">
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                    <Select value={volunteerForm.availability} onValueChange={(value) => setVolunteerForm({...volunteerForm, availability: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekdays">Weekdays</SelectItem>
                        <SelectItem value="weekends">Weekends</SelectItem>
                        <SelectItem value="flexible">Flexible</SelectItem>
                        <SelectItem value="monthly">Once a month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Why do you want to volunteer? *</label>
                    <Textarea
                      value={volunteerForm.motivation}
                      onChange={(e) => setVolunteerForm({...volunteerForm, motivation: e.target.value})}
                      rows={3}
                      required
                      placeholder="Tell us about your motivation to volunteer with Shield Foundation"
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                    disabled={loading}
                  >
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Stay Connected</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to receive updates about our programs, impact stories, 
            and volunteer opportunities.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1"
                required
              />
              <Button 
                type="submit"
                className="bg-white text-blue-600 hover:bg-gray-100"
                disabled={loading}
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Contact Options */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <p className="text-lg text-gray-600">
              Need immediate assistance? Choose the option that best fits your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <UserPlus className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Join Programs</h3>
                <p className="text-sm text-gray-600 mb-4">Apply for our youth skilling or senior care programs</p>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Learn More
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-yellow-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <HandHeart className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Volunteer</h3>
                <p className="text-sm text-gray-600 mb-4">Join our team of dedicated volunteers</p>
                <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600">
                  Apply Now
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Heart className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Donate</h3>
                <p className="text-sm text-gray-600 mb-4">Support our mission with a contribution</p>
                <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                  Donate
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center border-yellow-200 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 text-yellow-500 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-2">Partner</h3>
                <p className="text-sm text-gray-600 mb-4">Explore partnership opportunities</p>
                <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
