import React from 'react';
import { Bus, Users, Clock, MapPin, UserCheck } from 'lucide-react';
import { Tour } from '../types';
import { GuideSelector } from './GuideSelector';

interface TourCardProps {
  tour: Tour;
  onClick: (tour: Tour) => void;
  isAdmin?: boolean;
  guides?: any[];
  onAssignGuide?: (tourId: string, guideId: string) => void;
}

export function TourCard({ tour, onClick, isAdmin, guides, onAssignGuide }: TourCardProps) {
  const checkedInCount = tour.clients.filter(
    (client) => client.checkInStatus === 'checked-in'
  ).length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border border-gray-100">
      <div 
        onClick={() => onClick(tour)}
        className="cursor-pointer"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{tour.name}</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {new Date(tour.date).toLocaleDateString()}
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Bus className="w-5 h-5 mr-2" />
            <span>Bus #{tour.busNumber}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Clock className="w-5 h-5 mr-2" />
            <span>{tour.startTime} - {tour.endTime}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{tour.meetingPoint}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <Users className="w-5 h-5 mr-2" />
            <span>{checkedInCount}/{tour.clients.length} Checked In</span>
          </div>

          {tour.guide && !isAdmin && (
            <div className="flex items-center text-gray-600">
              <UserCheck className="w-5 h-5 mr-2" />
              <span>Guide: {tour.guide.name}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{
                width: `${(checkedInCount / tour.clients.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {isAdmin && guides && onAssignGuide && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <GuideSelector
            tour={tour}
            guides={guides}
            onAssignGuide={onAssignGuide}
          />
        </div>
      )}
    </div>
  );
}