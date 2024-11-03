import React, { useState } from 'react';
import { CircleUserRound, LogOut, Plus } from 'lucide-react';
import { TourCard } from './components/TourCard';
import { ClientList } from './components/ClientList';
import { LoginForm } from './components/auth/LoginForm';
import { CreateTourForm } from './components/tours/CreateTourForm';
import { AddClientForm } from './components/clients/AddClientForm';
import { Modal } from './components/Modal';
import { useAuth } from './contexts/AuthContext';
import { useTours } from './hooks/useTours';
import { Tour } from './types';

function App() {
  const { user, signOut } = useAuth();
  const { tours, loading, updateClientStatus, assignGuide } = useTours();
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [showCreateTour, setShowCreateTour] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);

  if (!user) {
    return <LoginForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Tour Guide Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <CircleUserRound className="w-5 h-5 mr-2" />
                <span>{user.email}</span>
              </div>
              <button 
                onClick={() => signOut()}
                className="text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTour ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTour.name} - Client List
              </h2>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowAddClient(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Client
                </button>
                <button
                  onClick={() => setSelectedTour(null)}
                  className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Back to Tours
                </button>
              </div>
            </div>
            <ClientList
              clients={selectedTour.clients}
              isAdmin={true}
              onStatusChange={updateClientStatus}
            />
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Your Tours</h2>
              <button
                onClick={() => setShowCreateTour(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Tour
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <TourCard
                  key={tour.id}
                  tour={tour}
                  onClick={setSelectedTour}
                  isAdmin={true}
                  onAssignGuide={assignGuide}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <Modal isOpen={showCreateTour} onClose={() => setShowCreateTour(false)}>
        <CreateTourForm onClose={() => setShowCreateTour(false)} />
      </Modal>

      <Modal isOpen={showAddClient} onClose={() => setShowAddClient(false)}>
        {selectedTour && (
          <AddClientForm
            tourId={selectedTour.id}
            onClose={() => setShowAddClient(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default App;