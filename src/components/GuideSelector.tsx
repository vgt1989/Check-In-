import React from 'react';
import { UserCheck } from 'lucide-react';
import { Tour, TourGuide } from '../types';

interface GuideSelectorProps {
  tour: Tour;
  guides: TourGuide[];
  onAssignGuide: (tourId: string, guideId: string) => void;
}

export function GuideSelector({ tour, guides, onAssignGuide }: GuideSelectorProps) {
  const availableGuides = guides.filter(guide => guide.availability);

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-grow">
        <select
          className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={tour.guide?.id || ''}
          onChange={(e) => onAssignGuide(tour.id, e.target.value)}
        >
          <option value="">Select a guide...</option>
          {availableGuides.map((guide) => (
            <option key={guide.id} value={guide.id}>
              {guide.name}
            </option>
          ))}
        </select>
      </div>
      {tour.guide && (
        <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
          <UserCheck className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">Assigned</span>
        </div>
      )}
    </div>
  );
}