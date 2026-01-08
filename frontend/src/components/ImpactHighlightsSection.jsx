import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { TrendingUp, Loader2 } from 'lucide-react';
import { getImpactHighlights } from '../api';

const ImpactHighlightsSection = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const response = await getImpactHighlights();
      setHighlights(response.highlights || []);
    } catch (error) {
      console.error('Failed to load impact highlights:', error);
      setHighlights([]);
    } finally {
      setLoading(false);
    }
  };

  const getColorClasses = (color) => {
    const colorMap = {
      blue: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        icon: 'text-blue-600'
      },
      green: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'text-green-600'
      },
      yellow: {
        bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: 'text-yellow-600'
      },
      purple: {
        bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
        text: 'text-purple-700',
        border: 'border-purple-200',
        icon: 'text-purple-600'
      },
      red: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'text-red-600'
      },
      orange: {
        bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
        text: 'text-orange-700',
        border: 'border-orange-200',
        icon: 'text-orange-600'
      }
    };
    return colorMap[color] || colorMap.blue;
  };

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading highlights...</p>
          </div>
        </div>
      </section>
    );
  }

  if (highlights.length === 0) {
    return null; // Don't show section if no highlights
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Impact Highlights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See the difference we're making in our community
          </p>
        </div>

        {/* Highlights Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {highlights.map((highlight) => {
            const colors = getColorClasses(highlight.color || 'blue');
            return (
              <Card
                key={highlight.id}
                className={`${colors.border} border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <CardContent className={`${colors.bg} p-6 text-center h-full flex flex-col justify-between`}>
                  {/* Icon */}
                  {highlight.icon && (
                    <div className={`text-4xl mb-3 ${colors.icon}`}>
                      {highlight.icon}
                    </div>
                  )}
                  
                  {/* Value */}
                  <div className={`text-4xl font-bold ${colors.text} mb-2`}>
                    {highlight.value}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-lg font-semibold ${colors.text} mb-2`}>
                    {highlight.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {highlight.description}
                  </p>
                  
                  {/* Category Badge */}
                  {highlight.category && (
                    <div className="mt-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.text} bg-white/50`}>
                        {highlight.category}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactHighlightsSection;

