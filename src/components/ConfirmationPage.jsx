/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';
import { Button } from './ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import Modal from './ui/Modal';

const Confirmation = () => {
  const { event_id, registration_id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventAndRegistration = async () => {
      setLoading(true);
      try {
        const { data: myEvent, error: eventError } = await supabase
          .from('events')
          .select('*')
          .eq('event_id', event_id)
          .single();

        if (eventError) {
          throw new Error('Failed to fetch event.');
        }

        const { data: myRegistration, error: registrationError } = await supabase
          .from('registrations')
          .select('*')
          .eq('registration_id', registration_id)
          .single();

        if (registrationError) {
          throw new Error('Failed to fetch registration.');
        }

        setEvent(myEvent);
        setRegistration(myRegistration);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
      setLoading(false);
    };

    fetchEventAndRegistration();
  }, [event_id, registration_id]);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  const getMapUrl = (locationPoint) => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const [latitude, longitude] = locationPoint.split(',').map(coord => coord.trim());
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`;
  };

  const handleAddToCalendar = async (response) => {
    const token = response.access_token;
    const eventDetails = {
      summary: event.title,
      description: event.description,
      start: {
        dateTime: new Date(event.start_time).toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: new Date(event.end_time).toISOString(),
        timeZone: 'UTC',
      },
      location: event.location,
    };

    try {
      const res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventDetails),
      });

      if (res.ok) {
        setIsModalOpen(true);
      } else {
        console.error('Error adding event to Google Calendar:', await res.text());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const login = useGoogleLogin({
    onSuccess: handleAddToCalendar,
    onError: (error) => console.error('Login Error:', error),
    scope: 'https://www.googleapis.com/auth/calendar.events',
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirectUri: `${supabaseUrl}/auth/v1/callback`
  });

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 mt-14">Event Confirmation</h1>
      <span className="text-2xl font-bold mb-2">You are going to</span>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && event && registration && (
        <div className="w-full rounded-lg overflow-hidden shadow-lg mt-8 p-2 border border-border dark:border-border dark:bg-background-dark">
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full object-cover h-96 rounded-lg"
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
            <p className="text-lg font-semibold mb-4">
              Registration ID: {registration.registration_id}
            </p>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
              <Button
                className="px-4 py-2 dark:bg-foreground-dark"
                onClick={login}
              >
                Add to Calendar
              </Button>
              <Button
                className="px-4 py-2 dark:bg-foreground-dark"
                onClick={() => setShowMap(!showMap)}
              >
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>
              {event.price === 0 && (
                <Button
                  className="px-4 py-2 dark:bg-foreground-dark"
                  onClick={() =>
                    navigate(
                      `/payment/${event_id}/${registration.registration_id}`
                    )
                  }
                >
                  Donate for Event
                </Button>
              )}
            </div>
            {showMap && (
              <iframe
                width="100%"
                height="400"
                style={{ border: 0, marginTop: '1rem' }}
                src={getMapUrl(event.location_point)}
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>
      )}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Event Added to Calendar"
        message="The event has been successfully added to your Google Calendar."
      />
    </section>
  );
};

export default Confirmation;