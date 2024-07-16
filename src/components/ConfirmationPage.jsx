/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { Button } from './ui/button';

const Confirmation = () => {
  const { event_id, registration_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', event_id)
        .single();
      if (error) {
        console.error('Error fetching event:', error.message);
      } else {
        setEvent(data);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [event_id]);

  if (loading) return <p>Loading...</p>;

  if (!event) return <p>Event not found</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background">
      <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 w-full max-w-2xl border border-border dark:border-border">
        <h2 className="text-2xl font-bold mb-4 text-center text-card-foreground dark:text-card-foreground">
          Registration Confirmation
        </h2>
        <p className="mb-4 text-card-foreground dark:text-card-foreground">
          You have successfully registered for the event: <strong>{event.name}</strong>
        </p>
        <p className="mb-4 text-card-foreground dark:text-card-foreground">
          Registration ID: <strong>{registration_id}</strong>
        </p>
        <p className="mb-4 text-card-foreground dark:text-card-foreground">
          {event.description}
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground">
            Add to Calendar
          </Button>
          <Button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 dark:bg-secondary dark:text-secondary-foreground">
            Show Map
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;