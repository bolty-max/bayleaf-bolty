import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Users, Mail, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useReservations } from '../../hooks/useReservations';

const ReservationManager: React.FC = () => {
  const { reservations, loading, updateReservationStatus } = useReservations();
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');

  const filteredReservations = filter === 'all' 
    ? reservations 
    : reservations.filter(r => r.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'cancelled':
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertCircle size={16} className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleStatusUpdate = async (id: string, status: 'pending' | 'confirmed' | 'cancelled') => {
    await updateReservationStatus(id, status);
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
          Reservation Management
        </h2>
        <div className="flex space-x-2">
          {['all', 'pending', 'confirmed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                filter === status
                  ? 'bg-spice-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredReservations.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reservations found for the selected filter.
          </div>
        ) : (
          filteredReservations.map((reservation) => (
            <motion.div
              key={reservation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-3">
                    <h3 className="font-semibold text-gray-900">{reservation.name}</h3>
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                      {getStatusIcon(reservation.status)}
                      <span className="capitalize">{reservation.status}</span>
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>{new Date(reservation.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>{reservation.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users size={16} />
                      <span>{reservation.guests} guests</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail size={16} />
                      <span>{reservation.email}</span>
                    </div>
                  </div>

                  {reservation.phone && (
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                      <Phone size={16} />
                      <span>{reservation.phone}</span>
                    </div>
                  )}

                  {reservation.special_requests && (
                    <div className="mt-3 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">
                        <strong>Special Requests:</strong> {reservation.special_requests}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2 ml-4">
                  {reservation.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                        className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                  {reservation.status === 'cancelled' && (
                    <button
                      onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                      className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                    >
                      Reconfirm
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReservationManager;