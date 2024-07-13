import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';
import { Button } from './ui/button';

const EventPage = () => {
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true); 
      let { data: eventData, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', event_id)
        .single();
      if (error) {
        console.log('Error:', error);
        setError('Failed to fetch event data. Please try again later.');
      } else {
        setEvent(eventData);
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
    const user = supabase.auth.user();
    if (!user) {
      navigate('/login');
    } else if (event.price > 0) {
      navigate('/payment');
    } else if (event.pay_as_you_like) {
      navigate('/registration');
    } else {
        const { error } = await supabase
        .from('registrations')
        .insert([{ event_id: event.id, user_id: user.id }]);
      if (error) {
        console.error('Error registering for free:', error.message);
        setError('Failed to register. Please try again later.');
      } else {
        navigate(`/confirmation/${event.id}`);
      }
    }
  };

  return (
    <section className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-6">Event Details</h1>

      {loading && <SkeletonCard />} 
      {error && <p className="text-red-500">{error}</p>} 

      {!loading && !error && event && (
        <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg mt-8">
          <img src={event.image_url} alt={event.title} className="w-full object-cover h-96" />
          <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-lg mb-2">{event.description}</p>
            <p className="text-md mb-2">{event.location}</p>
            <p className="text-sm text-muted-foreground mb-2">{formatDate(event.start_time)}</p>
            <p className="text-sm text-muted-foreground mb-2">{formatDate(event.end_time)}</p>
            <Button 
              onClick={handleRegisterClick} 
              className="px-4 py-2 dark:bg-foreground-dark"
            >
              {event.price > 0 ? `Register for £${event.price}` : 'Register for Free'}
            </Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventPage;