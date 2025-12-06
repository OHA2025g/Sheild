import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Layout, 
  FileText, 
  Image as ImageIcon, 
  Link as LinkIcon,
  List,
  Type,
  Eye,
  Save,
  X
} from 'lucide-react';

const PageManagement = ({
  selectedPage,
  setSelectedPage,
  pageContent,
  showPageSectionForm,
  setShowPageSectionForm,
  editingPageSection,
  setEditingPageSection,
  pageSectionForm,
  setPageSectionForm,
  handleCreatePageSection,
  handleUpdatePageSection,
  handleDeletePageSection
}) => {
  const pages = [
    { id: 'about', name: 'About Us', icon: FileText },
    { id: 'programs', name: 'Programs', icon: Layout },
    { id: 'impact', name: 'Impact', icon: Badge }
  ];

  const resetSectionForm = () => {
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

  const handleEdit = (section) => {
    setPageSectionForm({
      page: section.page,
      section: section.section,
      title: section.title,
      content: section.content,
      order: section.order,
      is_active: section.is_active
    });
    setEditingPageSection(section);
    setShowPageSectionForm(true);
  };

  const handleContentChange = (field, value) => {
    setPageSectionForm(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [field]: value
      }
    }));
  };

  const handleAddItem = () => {
    const newItem = { title: '', description: '', order: pageContent[selectedPage]?.length || 0 };
    handleContentChange('items', [...(pageSectionForm.content.items || []), newItem]);
  };

  const handleUpdateItem = (index, field, value) => {
    const items = [...(pageSectionForm.content.items || [])];
    items[index] = { ...items[index], [field]: value };
    handleContentChange('items', items);
  };

  const handleRemoveItem = (index) => {
    const items = [...(pageSectionForm.content.items || [])];
    items.splice(index, 1);
    handleContentChange('items', items);
  };

  const getSectionTypeIcon = (content) => {
    if (content.image_url || content.images?.length > 0) return ImageIcon;
    if (content.links?.length > 0) return LinkIcon;
    if (content.items?.length > 0) return List;
    if (content.html) return Layout;
    return Type;
  };

  return (
    <div className="space-y-6">
      {/* Header & Page Selector */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Page Management</h2>
          <p className="text-gray-600">Create and manage detailed content sections for all pages</p>
        </div>
        <Button
          onClick={() => {
            resetSectionForm();
            setShowPageSectionForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {/* Page Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {pages.map((page) => {
          const IconComponent = page.icon;
          return (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page.id)}
              className={`flex-1 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedPage === page.id
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <IconComponent className="h-4 w-4 mr-2" />
              {page.name}
            </button>
          );
        })}
      </div>

      {/* Page Sections List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            {pages.find(p => p.id === selectedPage)?.name} Sections
          </h3>
          <Badge variant="outline">
            {pageContent[selectedPage]?.length || 0} sections
          </Badge>
        </div>

        <div className="grid gap-4">
          {(pageContent[selectedPage] || []).map((section, index) => {
            const IconComponent = getSectionTypeIcon(section.content);
            return (
              <Card key={section.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-semibold text-gray-900">{section.title}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>Section: {section.section}</span>
                            <span>•</span>
                            <span>Order: {section.order}</span>
                            <Badge 
                              variant={section.is_active ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {section.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        {section.content.text && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {section.content.text}
                          </p>
                        )}
                        
                        {section.content.image_url && (
                          <div className="mt-2">
                            <img 
                              src={section.content.image_url} 
                              alt="Content" 
                              className="h-16 w-24 object-cover rounded"
                            />
                          </div>
                        )}
                        
                        {section.content.items?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              {section.content.items.length} items configured
                            </p>
                          </div>
                        )}
                        
                        {section.content.links?.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500">
                              {section.content.links.length} links configured
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(section)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeletePageSection(section.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {(!pageContent[selectedPage] || pageContent[selectedPage].length === 0) && (
            <Card className="border-dashed border-gray-300">
              <CardContent className="p-8 text-center">
                <Layout className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No sections yet</h3>
                <p className="text-gray-600 mb-4">
                  Start building this page by adding your first content section
                </p>
                <Button
                  onClick={() => {
                    resetSectionForm();
                    setShowPageSectionForm(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Section
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section Form */}
      {showPageSectionForm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingPageSection ? 'Edit Section' : 'Add New Section'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSectionForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section">Section Identifier</Label>
                <Input
                  id="section"
                  value={pageSectionForm.section}
                  onChange={(e) => setPageSectionForm(prev => ({ ...prev, section: e.target.value }))}
                  placeholder="e.g., hero, mission, journey"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Unique identifier for this section (lowercase, no spaces)
                </p>
              </div>
              
              <div>
                <Label htmlFor="title">Section Title</Label>
                <Input
                  id="title"
                  value={pageSectionForm.title}
                  onChange={(e) => setPageSectionForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter section title"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={pageSectionForm.order}
                  onChange={(e) => setPageSectionForm(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={pageSectionForm.is_active}
                  onChange={(e) => setPageSectionForm(prev => ({ ...prev, is_active: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active (visible on site)</Label>
              </div>
            </div>

            {/* Content Types */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content</h3>
              
              {/* Text Content */}
              <div>
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  value={pageSectionForm.content.text || ''}
                  onChange={(e) => handleContentChange('text', e.target.value)}
                  placeholder="Enter text content..."
                  rows={4}
                />
              </div>

              {/* HTML Content */}
              <div>
                <Label htmlFor="html_content">HTML Content (Advanced)</Label>
                <Textarea
                  id="html_content"
                  value={pageSectionForm.content.html || ''}
                  onChange={(e) => handleContentChange('html', e.target.value)}
                  placeholder="<p>Enter HTML content...</p>"
                  rows={3}
                />
              </div>

              {/* Image URL */}
              <div>
                <Label htmlFor="image_url">Featured Image URL</Label>
                <Input
                  id="image_url"
                  value={pageSectionForm.content.image_url || ''}
                  onChange={(e) => handleContentChange('image_url', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Dynamic Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Dynamic Items (Lists, Features, etc.)</Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddItem}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Item
                  </Button>
                </div>
                
                {(pageSectionForm.content.items || []).map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Item {index + 1}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-2">
                      <Input
                        value={item.title || ''}
                        onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
                        placeholder="Item title"
                        className="text-sm"
                      />
                      <Input
                        value={item.description || ''}
                        onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                        placeholder="Item description"
                        className="text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button variant="outline" onClick={resetSectionForm}>
                Cancel
              </Button>
              <Button
                onClick={editingPageSection ? handleUpdatePageSection : handleCreatePageSection}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {editingPageSection ? 'Update Section' : 'Create Section'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Page Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Page Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {pages.map((page) => {
              const IconComponent = page.icon;
              const sections = pageContent[page.id] || [];
              const activeSections = sections.filter(s => s.is_active).length;
              
              return (
                <div 
                  key={page.id} 
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedPage === page.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedPage(page.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <Badge variant={activeSections > 0 ? "default" : "secondary"}>
                      {activeSections}/{sections.length}
                    </Badge>
                  </div>
                  <h4 className="font-semibold text-gray-900">{page.name}</h4>
                  <p className="text-sm text-gray-600">
                    {activeSections} active sections
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PageManagement;