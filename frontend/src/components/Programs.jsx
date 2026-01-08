import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Link } from 'react-router-dom';
import { GraduationCap, Heart, Users, Award, CheckCircle, Building, Calendar } from 'lucide-react';
import { getPublicSiteContent, getDetailedPageSections } from '../api';
import Header from './Header';
import Footer from './Footer';

const Programs = () => {
  // Site content state
  const [siteContent, setSiteContent] = useState({});
  // Detailed page sections state
  const [pageSections, setPageSections] = useState([]);
  // Active tab state
  const [activeTab, setActiveTab] = useState('youth');

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

        // Load detailed page sections
        try {
          const sectionsData = await getDetailedPageSections('programs');
          setPageSections(sectionsData.sections || []);
        } catch (sectionsError) {
          console.log('Using empty page sections');
        }
      } catch (error) {
        console.log('Using empty data for site content');
        setSiteContent({});
      }
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {siteContent.programs?.hero?.title || "Our Programs"}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {siteContent.programs?.hero?.subtitle || "Shield Foundation focuses on two major domains that create lasting impact in communities"}
          </p>
          {siteContent.programs?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {siteContent.programs?.hero?.description}
            </p>
          )}
        </div>
      </section>


      {/* Our Programs - Tabbed Interface */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-2 mb-8 h-14">
              <TabsTrigger value="youth" className="text-base py-3 h-full flex items-center justify-center">
                <GraduationCap className="h-5 w-5 mr-2" />
                Youth Skills & Livelihood
              </TabsTrigger>
              <TabsTrigger value="seniors" className="text-base py-3 h-full flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Senior Citizens Services
              </TabsTrigger>
            </TabsList>

            {/* Youth Skills and Livelihood Tab */}
            <TabsContent value="youth" className="space-y-8">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <div className="flex items-center mb-4">
                    <GraduationCap className="h-12 w-12 text-blue-600 mr-4" />
        <div>
                      <CardTitle className="text-3xl text-gray-900">Youth Skills & Livelihood</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        Empowering youth with vocational skills for sustainable livelihoods
                      </CardDescription>
                    </div>
                </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Featured Image */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.image_url && (
                    <div className="text-center mb-6">
                      <img 
                        src={pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.image_url}
                        alt="Youth Skills and Livelihood"
                        width="800"
                        height="450"
                        className="rounded-lg shadow-lg mx-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose max-w-none text-lg text-gray-700 leading-relaxed">
                    <p>
                      {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.text ||
                       "Specialized vocational training programs for underprivileged youth focusing on CRS, ITES-BPO, and Nursing Assistant courses."}
                    </p>
                  </div>

                  {/* HTML Content */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.html 
                      }}
                    />
                  )}

                  {/* Key Highlights - Editable from Admin */}
                  <div className="bg-blue-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-6 w-6 text-blue-600 mr-2" />
                      Key Highlights
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pageSections.find(s => s.title?.toLowerCase().includes('youth'))?.content?.items?.length > 0 ? (
                        // Display highlights from admin panel
                        pageSections.find(s => s.title?.toLowerCase().includes('youth')).content.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.title && item.description ? (
                                <>
                                  <strong className="font-bold">{item.title}:</strong> {item.description}
                                </>
                              ) : item.title || item.description}
                            </span>
                          </div>
                        ))
                      ) : (
                        // Fallback to default highlights
                        <>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Vocational training in CRS, ITES-BPO, Nursing Assistant</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">High placement rates with reputed employers</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Average salary: ₹8,700 - ₹13,946/month</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Soft skills and personality development</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Senior Citizens Services Tab */}
            <TabsContent value="seniors" className="space-y-8">
              <Card className="border-2 border-yellow-200">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <div className="flex items-center mb-4">
                    <Heart className="h-12 w-12 text-yellow-600 mr-4" />
                    <div>
                      <CardTitle className="text-3xl text-gray-900">Senior Citizens Services</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        Adding life to years through comprehensive senior care
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* Featured Image */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.image_url && (
                    <div className="text-center mb-6">
                      <img 
                        src={pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.image_url}
                        alt="Senior Citizens Services"
                        width="800"
                        height="450"
                        className="rounded-lg shadow-lg mx-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Text Content */}
                  <div className="prose max-w-none text-lg text-gray-700 leading-relaxed">
                    <p>
                      {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.text ||
                       "Comprehensive health and social support programs for senior citizens focusing on physical well-being, mental health, and community engagement."}
                    </p>
                  </div>

                  {/* HTML Content */}
                  {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.html 
                      }}
                    />
                  )}

                  {/* Key Highlights - Editable from Admin */}
                  <div className="bg-yellow-50 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle className="h-6 w-6 text-yellow-600 mr-2" />
                      Key Highlights
                            </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {pageSections.find(s => s.title?.toLowerCase().includes('senior'))?.content?.items?.length > 0 ? (
                        // Display highlights from admin panel
                        pageSections.find(s => s.title?.toLowerCase().includes('senior')).content.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">
                              {item.title && item.description ? (
                                <>
                                  <strong className="font-bold">{item.title}:</strong> {item.description}
                                </>
                              ) : item.title || item.description}
                            </span>
                          </div>
                        ))
                      ) : (
                        // Fallback to default highlights
                        <>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Regular health check-ups and medical support</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Social activities and community engagement</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Physiotherapy and wellness programs</span>
                          </div>
                          <div className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">Mental health and counseling support</span>
                          </div>
                        </>
                      )}
                    </div>
                </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Get Involved Today</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're looking to develop new skills or support our community programs, 
            we have opportunities for everyone.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/contact">
                <Users className="h-5 w-5 mr-2" />
                Join Our Programs
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/contact">
                <Heart className="h-5 w-5 mr-2" />
                Become a Volunteer
              </Link>
            </Button>
          </div>
        </div>
      </section>


      <Footer />
    </div>
  );
};

export default Programs;
