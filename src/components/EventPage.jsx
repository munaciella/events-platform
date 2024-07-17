import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';
import { Button } from './ui/button';
import { useSupabaseAuth } from './AuthContext';

const EventPage = () => {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session, userDetails, storeIntendedURL } = useSupabaseAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data: myEvent, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', event_id)
        .single();
      if (error) {
        console.log('Error:', error);
        setError('Failed to fetch event. Please try again later.');
      } else {
        setEvent(myEvent);
        setError(null);
    }
      setLoading(false);
    };

    fetchEvent();
  }, [event_id]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  const handleRegisterClick = async () => {
    
    if (!session) {
        storeIntendedURL(window.location.pathname);
      navigate('/login');
      return;
    }

    const user = userDetails;

    if (event.price > 0) {
      const { data, error } = await supabase
        .from('registrations')
        .insert({ event_id: event.event_id, user_id: user.user_id })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating registration:', error.message);
        setError('Failed to create registration. Please try again later.');
        return;
      }
      
      navigate(`/payment/${event_id}/${data.registration_id}`);
    } else if (event.price === 0 && event.pay_as_you_like === true) {
      try {
        const { data, error } = await supabase
          .from('registrations')
          .insert({ event_id: event.event_id, user_id: user.user_id })
          .select()
          .single();
        if (error) {
          console.error('Error registering for event:', error.message);
          setError('Failed to register for event. Please try again later.');
        } else {
          navigate(`/confirmation/${event_id}/${data.registration_id}`);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setError('Failed to register for event. Please try again later.');
      }
    }
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && event && (
        <div className="w-full rounded-lg overflow-hidden shadow-lg mt-8">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full object-cover h-96"
          />
          <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-lg mb-2">{event.description}</p>
            <p className="text-md mb-2">{event.location}</p>
            <p className="text-sm text-muted-foreground mb-2">
              {formatDate(event.start_time)}
            </p>
            <p className="text-sm text-muted-foreground mb-2">
              {formatDate(event.end_time)}
            </p>
            <Button
              className="px-4 py-2 dark:bg-foreground-dark"
              onClick={handleRegisterClick}
            >
              Register for Event
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventPage;
