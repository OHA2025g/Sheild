import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { api } from '../../api';
import { useToast } from '../../hooks/use-toast';

const ImpactHighlights = () => {
  const { toast } = useToast();
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHighlight, setEditingHighlight] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    value: '',
    category: '',
    icon: '',
    color: 'blue',
    order: 0,
    is_active: true
  });

  // Color options for highlights
  const colorOptions = [
    { value: 'blue', label: 'Blue', class: 'bg-blue-100 text-blue-700 border-blue-300' },
    { value: 'green', label: 'Green', class: 'bg-green-100 text-green-700 border-green-300' },
    { value: 'yellow', label: 'Yellow', class: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
    { value: 'purple', label: 'Purple', class: 'bg-purple-100 text-purple-700 border-purple-300' },
    { value: 'red', label: 'Red', class: 'bg-red-100 text-red-700 border-red-300' },
    { value: 'orange', label: 'Orange', class: 'bg-orange-100 text-orange-700 border-orange-300' }
  ];

  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getAllImpactHighlights();
      setHighlights(response.highlights || []);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load impact highlights',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      value: '',
      category: '',
      icon: '',
      color: 'blue',
      order: 0,
      is_active: true
    });
    setEditingHighlight(null);
    setShowForm(false);
  };

  const handleEdit = (highlight) => {
    setFormData({
      title: highlight.title,
      description: highlight.description,
      value: highlight.value,
      category: highlight.category,
      icon: highlight.icon || '',
      color: highlight.color || 'blue',
      order: highlight.order || 0,
      is_active: highlight.is_active !== false
    });
    setEditingHighlight(highlight);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingHighlight) {
        await api.admin.updateImpactHighlight(editingHighlight.id, formData);
        toast({
          title: 'Success',
          description: 'Impact highlight updated successfully!'
        });
      } else {
        await api.admin.addImpactHighlight(formData);
        toast({
          title: 'Success',
          description: 'Impact highlight created successfully!'
        });
      }
      
      loadHighlights();
      resetForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to save impact highlight',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (highlightId) => {
    if (!window.confirm('Are you sure you want to delete this impact highlight?')) {
      return;
    }

    try {
      await api.admin.deleteImpactHighlight(highlightId);
      toast({
        title: 'Success',
        description: 'Impact highlight deleted successfully!'
      });
      loadHighlights();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete impact highlight',
        variant: 'destructive'
      });
    }
  };

  const getColorClass = (color) => {
    const colorOption = colorOptions.find(opt => opt.value === color);
    return colorOption ? colorOption.class : colorOptions[0].class;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading impact highlights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Sparkles className="h-7 w-7 mr-2 text-blue-600" />
            Impact Highlights
          </h2>
          <p className="text-gray-600">Showcase key achievements and impact metrics on your website</p>
        </div>
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Highlight
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center justify-between">
              <span>{editingHighlight ? 'Edit' : 'Create'} Impact Highlight</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetForm}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Youth Empowered"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">Value/Metric *</Label>
                  <Input
                    id="value"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder="e.g., 5,000+"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this achievement..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Youth, Seniors, Women"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="icon">Icon (Optional)</Label>
                  <Input
                    id="icon"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Icon name or emoji"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="color">Color Theme</Label>
                  <select
                    id="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="is_active">Active (visible on website)</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  {editingHighlight ? 'Update' : 'Create'} Highlight
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Highlights List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {highlights.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Impact Highlights Yet</h3>
            <p className="text-gray-600 mb-4">Create your first highlight to showcase your impact!</p>
            <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add First Highlight
            </Button>
          </div>
        ) : (
          highlights.map((highlight) => (
            <Card key={highlight.id} className={`border-2 ${highlight.is_active ? '' : 'opacity-60'}`}>
              <CardHeader className={getColorClass(highlight.color || 'blue')}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    {highlight.icon && (
                      <div className="text-2xl mb-2">{highlight.icon}</div>
                    )}
                    <CardTitle className="text-xl">{highlight.title}</CardTitle>
                    <div className="text-3xl font-bold mt-2">{highlight.value}</div>
                  </div>
                  <div className="flex gap-1">
                    {highlight.is_active ? (
                      <Eye className="h-4 w-4 text-green-600" />
                    ) : (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-gray-600 mb-3">{highlight.description}</p>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="outline" className="text-xs">
                    {highlight.category}
                  </Badge>
                  <span className="text-xs text-gray-500">Order: {highlight.order}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(highlight)}
                    className="flex-1"
                  >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(highlight.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ImpactHighlights;

