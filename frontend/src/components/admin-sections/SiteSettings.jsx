import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Settings as SettingsIcon, Palette, Image as ImageIcon, Type, Save, RotateCcw, Link as LinkIcon } from 'lucide-react';

const SiteSettings = ({
  siteSettings,
  tempSiteSettings,
  setTempSiteSettings,
  showSiteSettingsForm,
  setShowSiteSettingsForm,
  handleUpdateSiteSettings,
  handleResetSiteSettings
}) => {
  const resetForm = () => {
    setTempSiteSettings(siteSettings);
    setShowSiteSettingsForm(false);
  };

  const handleColorChange = (colorType, value) => {
    setTempSiteSettings(prev => ({
      ...prev,
      [colorType]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Site Settings & Branding</h2>
          <p className="text-gray-600">Manage your site's branding, logo, and visual identity</p>
        </div>
        <Button
          onClick={() => setShowSiteSettingsForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <SettingsIcon className="h-4 w-4 mr-2" />
          Edit Settings
        </Button>
      </div>

      {/* Current Settings Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Logo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ImageIcon className="h-5 w-5 mr-2" />
              Logo & Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Title</Label>
              <div className="mt-1 text-lg font-semibold text-gray-900">
                {siteSettings.site_title || 'Shield Foundation'}
              </div>
            </div>
            
            <div>
              <Label>Site Description</Label>
              <div className="mt-1 text-gray-600">
                {siteSettings.site_description || 'Adding Life to Years'}
              </div>
            </div>

            <div>
              <Label>Logo</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                {siteSettings.logo_url ? (
                  <img
                    src={siteSettings.logo_url}
                    alt="Site Logo"
                    className="h-16 mx-auto object-contain"
                  />
                ) : (
                  <div className="text-gray-500">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No logo uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Favicon</Label>
              <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                {siteSettings.favicon_url ? (
                  <img
                    src={siteSettings.favicon_url}
                    alt="Favicon"
                    className="h-8 w-8 mx-auto object-contain"
                  />
                ) : (
                  <div className="text-gray-500">
                    <ImageIcon className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs">No favicon uploaded</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label>Social Media Links</Label>
              <div className="mt-2 space-y-2">
                {[
                  { key: 'facebook_url', name: 'Facebook', icon: '📘' },
                  { key: 'instagram_url', name: 'Instagram', icon: '📷' },
                  { key: 'youtube_url', name: 'YouTube', icon: '📺' },
                  { key: 'twitter_url', name: 'Twitter', icon: '🐦' },
                  { key: 'linkedin_url', name: 'LinkedIn', icon: '💼' }
                ].map(({ key, name, icon }) => (
                  <div key={key} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="flex items-center text-sm">
                      <span className="mr-2">{icon}</span>
                      {name}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      siteSettings[key] ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {siteSettings[key] ? 'Configured' : 'Not Set'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scheme */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="h-5 w-5 mr-2" />
              Color Scheme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <Label className="block text-xs mb-2">Primary</Label>
                <div
                  className="h-16 w-full rounded-lg border shadow-sm"
                  style={{ backgroundColor: siteSettings.primary_color }}
                ></div>
                <div className="text-xs text-gray-600 mt-1">
                  {siteSettings.primary_color}
                </div>
              </div>
              
              <div className="text-center">
                <Label className="block text-xs mb-2">Secondary</Label>
                <div
                  className="h-16 w-full rounded-lg border shadow-sm"
                  style={{ backgroundColor: siteSettings.secondary_color }}
                ></div>
                <div className="text-xs text-gray-600 mt-1">
                  {siteSettings.secondary_color}
                </div>
              </div>
              
              <div className="text-center">
                <Label className="block text-xs mb-2">Accent</Label>
                <div
                  className="h-16 w-full rounded-lg border shadow-sm"
                  style={{ backgroundColor: siteSettings.accent_color }}
                ></div>
                <div className="text-xs text-gray-600 mt-1">
                  {siteSettings.accent_color}
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Color Preview</h4>
              <div className="space-y-2">
                <div 
                  className="h-8 rounded flex items-center px-3 text-white font-medium"
                  style={{ backgroundColor: siteSettings.primary_color }}
                >
                  Primary Color
                </div>
                <div 
                  className="h-8 rounded flex items-center px-3 text-black font-medium"
                  style={{ backgroundColor: siteSettings.secondary_color }}
                >
                  Secondary Color
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Form */}
      {showSiteSettingsForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Edit Site Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Type className="h-4 w-4 mr-2" />
                Basic Information
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_title">Site Title</Label>
                  <Input
                    id="site_title"
                    value={tempSiteSettings.site_title}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, site_title: e.target.value }))}
                    placeholder="Enter site title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="site_description">Site Description</Label>
                  <Input
                    id="site_description"
                    value={tempSiteSettings.site_description}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, site_description: e.target.value }))}
                    placeholder="Enter site description"
                  />
                </div>
              </div>
            </div>

            {/* Logo & Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                Logo & Images
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    value={tempSiteSettings.logo_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 200x60px, transparent background
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="favicon_url">Favicon URL</Label>
                  <Input
                    id="favicon_url"
                    value={tempSiteSettings.favicon_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, favicon_url: e.target.value }))}
                    placeholder="https://example.com/favicon.ico"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Recommended: 32x32px or 16x16px, .ico format
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <LinkIcon className="h-4 w-4 mr-2" />
                Social Media Links
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="facebook_url">Facebook URL</Label>
                  <Input
                    id="facebook_url"
                    value={tempSiteSettings.facebook_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, facebook_url: e.target.value }))}
                    placeholder="https://www.facebook.com/shieldfoundation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram_url">Instagram URL</Label>
                  <Input
                    id="instagram_url"
                    value={tempSiteSettings.instagram_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, instagram_url: e.target.value }))}
                    placeholder="https://www.instagram.com/shieldfoundation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="youtube_url">YouTube URL</Label>
                  <Input
                    id="youtube_url"
                    value={tempSiteSettings.youtube_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, youtube_url: e.target.value }))}
                    placeholder="https://www.youtube.com/c/shieldfoundation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="twitter_url">Twitter URL</Label>
                  <Input
                    id="twitter_url"
                    value={tempSiteSettings.twitter_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, twitter_url: e.target.value }))}
                    placeholder="https://twitter.com/shieldfoundation"
                  />
                </div>
                
                <div>
                  <Label htmlFor="linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="linkedin_url"
                    value={tempSiteSettings.linkedin_url || ''}
                    onChange={(e) => setTempSiteSettings(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    placeholder="https://www.linkedin.com/company/shieldfoundation"
                  />
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-1">Social Media Guidelines</h4>
                <p className="text-blue-700 text-sm">
                  Enter complete URLs for your social media profiles. Only configured links will be displayed in the website footer. 
                  Leave fields empty to hide specific social media icons.
                </p>
              </div>
            </div>

            {/* Color Scheme */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Palette className="h-4 w-4 mr-2" />
                Color Scheme
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="primary_color">Primary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={tempSiteSettings.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tempSiteSettings.primary_color}
                      onChange={(e) => handleColorChange('primary_color', e.target.value)}
                      placeholder="#2563eb"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary_color">Secondary Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={tempSiteSettings.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tempSiteSettings.secondary_color}
                      onChange={(e) => handleColorChange('secondary_color', e.target.value)}
                      placeholder="#eab308"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="accent_color">Accent Color</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="accent_color"
                      type="color"
                      value={tempSiteSettings.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      className="w-16 h-10"
                    />
                    <Input
                      value={tempSiteSettings.accent_color}
                      onChange={(e) => handleColorChange('accent_color', e.target.value)}
                      placeholder="#ffffff"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Preview</h3>
              <div className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4 mb-4">
                  {tempSiteSettings.logo_url && (
                    <img
                      src={tempSiteSettings.logo_url}
                      alt="Logo Preview"
                      className="h-8 object-contain"
                    />
                  )}
                  <div>
                    <h4 className="font-bold text-lg">{tempSiteSettings.site_title}</h4>
                    <p className="text-gray-600">{tempSiteSettings.site_description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button
                    style={{ backgroundColor: tempSiteSettings.primary_color }}
                    className="text-white"
                  >
                    Primary Button
                  </Button>
                  <Button
                    style={{ 
                      backgroundColor: tempSiteSettings.secondary_color,
                      color: tempSiteSettings.secondary_color === '#eab308' ? '#000' : '#fff'
                    }}
                  >
                    Secondary Button
                  </Button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={resetForm}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleUpdateSiteSettings}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions & Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-1">Logo Guidelines</h4>
              <p className="text-blue-700">
                For best results, use a transparent PNG logo with dimensions around 200x60px. 
                The logo will be automatically resized to fit the header.
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-1">Color Scheme</h4>
              <p className="text-green-700">
                The primary color is used for main elements like buttons and headers. 
                Secondary color is used for accents and highlights. Choose colors that provide good contrast.
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-900 mb-1">Image Hosting</h4>
              <p className="text-yellow-700">
                Host your images on reliable services like Imgur, Cloudinary, or your own CDN. 
                Make sure URLs are publicly accessible and use HTTPS.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SiteSettings;