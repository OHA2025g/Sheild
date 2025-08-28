import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Users, Award, Target, Eye, Star, CheckCircle, Calendar, Building } from 'lucide-react';
import { api, getPublicSiteContent, getLeadershipTeam, getDetailedPageSections } from '../api';
import Header from './Header';
import Footer from './Footer';

const About = () => {
  // Site content state
  const [siteContent, setSiteContent] = useState({});
  // Leadership team state
  const [teamMembers, setTeamMembers] = useState([]);
  // Impact statistics state
  const [impactStats, setImpactStats] = useState({});
  // Detailed page sections state
  const [pageSections, setPageSections] = useState([]);

  // Load site content and leadership team on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load site content
        const backendContent = await getPublicSiteContent();
        if (backendContent.content && Object.keys(backendContent.content).length > 0) {
          setSiteContent(backendContent.content);
        } else {
          // Set empty object if no site content available
          setSiteContent({});
        }

        // Load leadership team
        const teamData = await getLeadershipTeam();
        if (teamData.members && teamData.members.length > 0) {
          setTeamMembers(teamData.members);
        } else {
          // Fallback to default team members if no data in backend
          setTeamMembers([
            {
              name: "Mrs. Swati Ingole",
              role: "Founder & Director",
              image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
              description: "Visionary leader with over 15 years of experience in social development and community empowerment."
            },
            {
              name: "Dr. Rajesh Kumar",
              role: "Senior Medical Advisor",
              image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
              description: "Leading geriatrician specializing in senior citizen healthcare and physiotherapy services."
            },
            {
              name: "Ms. Priya Sharma",
              role: "Training Program Manager",
              image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
              description: "Expert in vocational training with focus on youth skill development and employment placement."
            }
          ]);
        }

        // Load impact statistics
        try {
          const statsData = await api.getImpactStats();
          if (statsData && Object.keys(statsData).length > 0) {
            setImpactStats(statsData);
          }
        } catch (statsError) {
          console.log('Using fallback impact statistics');
        }

        // Load detailed page sections
        try {
          const sectionsData = await getDetailedPageSections('about');
          setPageSections(sectionsData.sections || []);
        } catch (sectionsError) {
          console.log('Using empty page sections');
        }
      } catch (error) {
        console.log('Using fallback data for site content and leadership team');
        setSiteContent({});
        // Set fallback team members
        setTeamMembers([
          {
            name: "Mrs. Swati Ingole",
            role: "Founder & Director",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face",
            description: "Visionary leader with over 15 years of experience in social development and community empowerment."
          },
          {
            name: "Dr. Rajesh Kumar",
            role: "Senior Medical Advisor",
            image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
            description: "Leading geriatrician specializing in senior citizen healthcare and physiotherapy services."
          },
          {
            name: "Ms. Priya Sharma",
            role: "Training Program Manager",
            image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&h=400&fit=crop&crop=face",
            description: "Expert in vocational training with focus on youth skill development and employment placement."
          }
        ]);
      }
    };
    
    loadData();
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Compassion",
      description: "We approach every individual with empathy and understanding, recognizing their unique dignity and worth."
    },
    {
      icon: Users,
      title: "Community",
      description: "We believe in the power of community support and collective action to create lasting change."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for the highest standards in our programs and services, ensuring quality outcomes."
    },
    {
      icon: Target,
      title: "Impact",
      description: "We focus on measurable results that create meaningful improvements in people's lives."
    }
  ];

  // Timeline/milestones now managed through database page sections

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-yellow-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {siteContent.about?.hero?.title || "About Shield Foundation"}
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {siteContent.about?.hero?.subtitle || "Our Story of Impact and Transformation"}
          </p>
          {siteContent.about?.hero?.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mt-4">
              {siteContent.about?.hero?.description}
            </p>
          )}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                {siteContent.about?.story?.title || "Our Story"}
              </h2>
              <div className="text-lg text-gray-600 mb-6 leading-relaxed">
                {siteContent.about?.story?.content || `Shield Foundation was founded by Mrs. Swati Ingole with a clear mission: "To add life to years – 
                equipping and empowering communities so that every individual, especially the elderly and vulnerable, 
                can live with dignity till the end of life irrespective of socio-economic status."`}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&h=400&fit=crop"
                alt="Shield Foundation Community Work"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-lg">
                <div className="text-2xl font-bold">
                  {siteContent.about?.story?.highlightBox?.text || "6+ Years"}
                </div>
                <div className="text-sm">
                  {siteContent.about?.story?.highlightBox?.subtext || "Serving Communities"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Foundation</h2>
            <p className="text-xl text-gray-600">The principles that guide our work</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Mission */}
            <Card className="h-full">
              <CardHeader>
                <Target className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl text-blue-600">
                  {siteContent.about?.mission?.title || "Mission"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {siteContent.about?.mission?.content || `To add life to years – equipping and empowering communities so that every individual, 
                  especially the elderly and vulnerable, can live with dignity till the end of life 
                  irrespective of socio-economic status.`}
                </p>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="h-full">
              <CardHeader>
                <Eye className="h-12 w-12 text-yellow-500 mb-4" />
                <CardTitle className="text-2xl text-yellow-600">
                  {siteContent.about?.vision?.title || "Vision"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {siteContent.about?.vision?.content || `A society where every individual has access to opportunities for skill development, 
                  meaningful employment, and comprehensive care that ensures dignity and well-being 
                  throughout their life journey.`}
                </p>
              </CardContent>
            </Card>

            {/* Values */}
            <Card className="h-full">
              <CardHeader>
                <Star className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle className="text-2xl text-blue-600">Values</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Compassion, Excellence, Integrity, Community Partnership, and Sustainable Impact 
                  drive everything we do, ensuring that our work creates lasting positive change 
                  in the communities we serve.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Core Values Detail */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6">
                    <IconComponent className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">Dedicated professionals committed to our mission</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-8">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <Badge className="mb-4 bg-yellow-400 text-black hover:bg-yellow-500">
                    {member.role}
                  </Badge>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Impact Summary */}
      <section className="py-20 bg-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-black mb-4">Our Impact Today</h2>
            <p className="text-xl text-black/80">Lives transformed, communities empowered</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-black mb-2">
                {impactStats.youthTrained?.toLocaleString() || 0}+
              </div>
              <div className="text-black/70">Youth Trained</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">
                {impactStats.youthPlaced?.toLocaleString() || 0}+
              </div>
              <div className="text-black/70">Youth Placed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">
                {impactStats.seniorsSupported?.toLocaleString() || 0}+
              </div>
              <div className="text-black/70">Seniors Supported</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-black mb-2">
                {impactStats.womenEmpowered?.toLocaleString() || 0}+
              </div>
              <div className="text-black/70">Women Empowered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Page Sections */}
      {pageSections.length > 0 && (
        <div>
          {pageSections.map((section, index) => {
            // Special handling for "Our Journey" section - Timeline Layout
            if (section.section === 'journey') {
              return (
                <section key={section.id} className="py-20 bg-gray-50">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      {section.content.text && (
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                          {section.content.text}
                        </p>
                      )}
                    </div>
                    
                    {/* Timeline Layout */}
                    {section.content.items && section.content.items.length > 0 && (
                      <div className="relative max-w-6xl mx-auto">
                        {/* Center timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-0.5 top-0 bottom-0 w-1 bg-blue-600 hidden md:block"></div>
                        
                        <div className="space-y-12">
                          {section.content.items.map((milestone, milestoneIndex) => (
                            <div key={milestoneIndex} className={`relative flex items-center ${milestoneIndex % 2 === 0 ? 'md:justify-start' : 'md:justify-end'}`}>
                              {/* Timeline dot */}
                              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-yellow-400 rounded-full border-4 border-white shadow-lg z-10 hidden md:block"></div>
                              
                              <div className={`w-full md:w-5/12 ${milestoneIndex % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                                <Card className={`hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                                  milestoneIndex % 2 === 0 
                                    ? 'md:ml-0' 
                                    : 'md:mr-0'
                                }`}>
                                  <CardContent className="p-6 relative">
                                    {/* Arrow pointing to timeline */}
                                    <div className={`absolute top-8 hidden md:block ${
                                      milestoneIndex % 2 === 0 
                                        ? 'right-0 transform translate-x-full' 
                                        : 'left-0 transform -translate-x-full'
                                    }`}>
                                      <div className={`w-0 h-0 ${
                                        milestoneIndex % 2 === 0
                                          ? 'border-l-[20px] border-l-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
                                          : 'border-r-[20px] border-r-white border-t-[10px] border-t-transparent border-b-[10px] border-b-transparent'
                                      }`}></div>
                                    </div>
                                    
                                    <div className="flex items-center mb-4">
                                      <Badge className="bg-blue-600 text-white text-sm px-3 py-1 mr-3">
                                        {milestone.title?.split(' - ')[0] || `Step ${milestoneIndex + 1}`}
                                      </Badge>
                                      <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                      {milestone.title?.split(' - ')[1] || milestone.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {/* Start and End markers */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 -top-4 w-4 h-4 bg-blue-600 rounded-full hidden md:block"></div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-4 w-4 h-4 bg-blue-600 rounded-full hidden md:block"></div>
                      </div>
                    )}
                  </div>
                </section>
              );
            }
            
            // Special handling for "Our Partners" section
            if (section.section === 'partners') {
              return (
                <section key={section.id} className="py-20">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                      <h2 className="text-4xl font-bold text-gray-900 mb-4">{section.title}</h2>
                      {section.content.text && (
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                          {section.content.text}
                        </p>
                      )}
                    </div>
                    
                    {section.content.items && section.content.items.length > 0 && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {section.content.items.map((partner, partnerIndex) => (
                          <Card key={partnerIndex} className="text-center border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                            <CardContent className="p-6">
                              <div className="mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                  <Building className="h-8 w-8 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                  {partner.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                  {partner.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </section>
              );
            }
            
            // Default layout for other sections
            return (
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
                      <div className="prose max-w-none text-lg text-gray-600 leading-relaxed text-center">
                        <p>{section.content.text}</p>
                      </div>
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
                        {section.content.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="bg-white p-6 rounded-lg shadow-md">
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
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Footer />
    </div>
  );
};

export default About;