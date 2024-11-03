import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Tour } from '../types';
import toast from 'react-hot-toast';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTours();
    
    // Subscribe to changes
    const channel = supabase
      .channel('tours')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tours' },
        (payload) => {
          console.log('Change received!', payload);
          fetchTours();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select(`
          *,
          guide:tour_guides(*),
          clients:tour_clients(*)
        `)
        .order('date', { ascending: true });

      if (error) throw error;
      setTours(data || []);
    } catch (error) {
      toast.error('Error loading tours');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateClientStatus = async (clientId: string, status: 'checked-in' | 'no-show') => {
    try {
      const { error } = await supabase
        .from('tour_clients')
        .update({ check_in_status: status })
        .eq('id', clientId);

      if (error) throw error;
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Error updating status');
      console.error('Error:', error);
    }
  };

  const assignGuide = async (tourId: string, guideId: string) => {
    try {
      const { error } = await supabase
        .from('tours')
        .update({ guide_id: guideId })
        .eq('id', tourId);

      if (error) throw error;
      toast.success('Guide assigned successfully');
    } catch (error) {
      toast.error('Error assigning guide');
      console.error('Error:', error);
    }
  };

  return {
    tours,
    loading,
    updateClientStatus,
    assignGuide
  };
}