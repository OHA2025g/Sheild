import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
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
            {siteContent.programs?.hero?.subtitle || "Comprehensive Programs for Community Impact"}
          </p>
          {siteContent.programs?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {siteContent.programs?.hero?.description}
            </p>
          )}
        </div>
      </section>


      {/* Dynamic Page Sections */}
      {pageSections.length > 0 && (
        <div className="space-y-16">
          {pageSections.map((section, index) => (
            <section key={section.id} className="py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-8">
                  {/* Text Content */}
                  {section.content.text && (
                    <div className="prose max-w-none text-lg text-gray-600 leading-relaxed">
                      <p>{section.content.text}</p>
                    </div>
                  )}

                  {/* HTML Content */}
                  {section.content.html && (
                    <div 
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: section.content.html }}
                    />
                  )}

                  {/* Featured Image */}
                  {section.content.image_url && (
                    <div className="text-center">
                      <img 
                        src={section.content.image_url} 
                        alt={section.title}
                        className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
                      />
                    </div>
                  )}

                  {/* Dynamic Items */}
                  {section.content.items && section.content.items.length > 0 && (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {section.content.items.map((item, itemIndex) => {
                        // Debug: log item data
                        if (item.image_url) {
                          console.log('Item with image:', { index: itemIndex, title: item.title, image_url: item.image_url });
                        }
                        return (
                        <div key={itemIndex} className="bg-white p-6 rounded-lg shadow-md">
                          {item.image_url && item.image_url.trim() !== '' && (
                            <div className="mb-4 flex items-center justify-center bg-gray-50 rounded-lg p-4" style={{ minHeight: '160px', maxHeight: '160px' }}>
                              <img 
                                src={item.image_url} 
                                alt={item.title || 'Item image'}
                                className="max-w-full max-h-full object-contain"
                                style={{ display: 'block', width: 'auto', height: 'auto', maxWidth: '100%', maxHeight: '132px' }}
                                onError={(e) => {
                                  console.error('Failed to load image:', item.image_url, 'for item:', item.title);
                                  e.target.style.display = 'none';
                                }}
                                onLoad={() => {
                                  console.log('Image loaded successfully:', item.image_url);
                                }}
                              />
                            </div>
                          )}
                          {item.title && (
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                              {item.title}
                            </h3>
                          )}
                          {item.description && (
                            <p className="text-gray-600">
                              {item.description}
                            </p>
                          )}
                        </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

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
