import React, { useState, useEffect } from 'react';
import { resourceService, analyticsService, createTrackableButton } from '../utils/resourceService';

const ResourceManager = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  useEffect(() => {
    loadResources();
  }, [selectedCategory, featuredOnly]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const category = selectedCategory === 'all' ? null : selectedCategory;
      const featured = featuredOnly ? true : null;
      const data = await resourceService.getResources(category, featured);
      setResources(data);
    } catch (error) {
      console.error('Failed to load resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resource) => {
    try {
      await resourceService.downloadResource(resource.id, {
        resource_title: resource.title,
        resource_category: resource.category
      });
      
      // Refresh the resource to get updated download count
      setTimeout(loadResources, 1000);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCategoryChange = createTrackableButton(
    'resource-category-filter',
    'filter',
    (event) => setSelectedCategory(event.target.value),
    { filter_type: 'category' }
  );

  const handleFeaturedToggle = createTrackableButton(
    'resource-featured-filter',
    'filter',
    () => setFeaturedOnly(!featuredOnly),
    { filter_type: 'featured' }
  );

  const categories = ['all', 'case-studies', 'whitepapers', 'guides', 'presentations'];

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Loading resources...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Resource Library</h2>
      
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={handleFeaturedToggle}
              className="mr-2"
            />
            Featured only
          </label>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map(resource => (
          <div key={resource.id} className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-semibold">{resource.title}</h3>
              {resource.featured && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Featured
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-4">{resource.description}</p>
            
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm text-gray-500 capitalize">
                {resource.category.replace('-', ' ')}
              </span>
              <span className="text-sm text-gray-500">
                {resource.download_count} downloads
              </span>
            </div>
            
            {resource.metadata && Object.keys(resource.metadata).length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Details:</h4>
                <div className="text-sm text-gray-600">
                  {Object.entries(resource.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key.replace('_', ' ')}:</span>
                      <span>{Array.isArray(value) ? value.join(', ') : value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <button
              onClick={() => handleDownload(resource)}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Download {resource.type.toUpperCase()}
            </button>
          </div>
        ))}
      </div>

      {resources.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No resources found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ResourceManager;