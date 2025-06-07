import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useMenuItems } from '../../hooks/useMenuItems';

const MenuManager: React.FC = () => {
  const { menuItems, loading, updateMenuItem, deleteMenuItem } = useMenuItems();
  const [filter, setFilter] = useState<'all' | 'starters' | 'mains' | 'desserts' | 'drinks'>('all');

  const filteredItems = filter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === filter);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    await updateMenuItem(id, { is_available: !currentStatus });
  };

  const toggleSpecial = async (id: string, currentStatus: boolean) => {
    await updateMenuItem(id, { is_special: !currentStatus });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-spice-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">
          Menu Management
        </h2>
        <div className="flex items-center space-x-4">
          <div className="flex space-x-2">
            {['all', 'starters', 'mains', 'desserts', 'drinks'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                  filter === category
                    ? 'bg-spice-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-spice-500 text-white rounded-lg hover:bg-spice-600 transition-colors">
            <Plus size={16} />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          >
            {item.image_url && (
              <div className="h-48 overflow-hidden">
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <span className="text-lg font-bold text-spice-600">€{item.price}</span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {item.description}
              </p>
              
              <div className="flex items-center space-x-2 mb-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.category === 'starters' ? 'bg-blue-100 text-blue-800' :
                  item.category === 'mains' ? 'bg-green-100 text-green-800' :
                  item.category === 'desserts' ? 'bg-pink-100 text-pink-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {item.category}
                </span>
                
                {item.is_vegetarian && (
                  <span className="px-2 py-1 bg-leaf-100 text-leaf-800 rounded-full text-xs font-medium">
                    Vegetarian
                  </span>
                )}
                
                {item.is_special && (
                  <span className="px-2 py-1 bg-chili-100 text-chili-800 rounded-full text-xs font-medium">
                    Special
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">Spice:</span>
                  {[...Array(3)].map((_, i) => (
                    <span
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < item.spice_level ? 'bg-chili-600' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAvailability(item.id, item.is_available)}
                    className={`p-1 rounded ${
                      item.is_available 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={item.is_available ? 'Available' : 'Unavailable'}
                  >
                    {item.is_available ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  
                  <button
                    onClick={() => toggleSpecial(item.id, item.is_special)}
                    className={`p-1 rounded ${
                      item.is_special 
                        ? 'text-chili-600 hover:bg-chili-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title="Toggle Special"
                  >
                    ⭐
                  </button>
                  
                  <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded">
                    <Edit size={16} />
                  </button>
                  
                  <button 
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MenuManager;