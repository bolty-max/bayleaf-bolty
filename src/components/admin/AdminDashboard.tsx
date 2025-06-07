import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, ChefHat, Image, Settings, BarChart3 } from 'lucide-react';
import ReservationManager from './ReservationManager';
import MenuManager from './MenuManager';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reservations');

  const tabs = [
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'menu', label: 'Menu Items', icon: ChefHat },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'reservations':
        return <ReservationManager />;
      case 'menu':
        return <MenuManager />;
      case 'gallery':
        return <div className="p-6">Gallery management coming soon...</div>;
      case 'analytics':
        return <div className="p-6">Analytics dashboard coming soon...</div>;
      case 'settings':
        return <div className="p-6">Settings panel coming soon...</div>;
      default:
        return <ReservationManager />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Bay Leaf Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <div className="w-8 h-8 bg-spice-500 rounded-full flex items-center justify-center">
                <Users size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <motion.button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-spice-100 text-spice-700 border border-spice-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{tab.label}</span>
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;