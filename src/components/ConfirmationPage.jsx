/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { supabase } from '../../supabaseClient';
// import { Button } from './ui/button';

// const Confirmation = () => {
//   const { event_id, registration_id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       const { data, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('event_id', event_id)
//         .single();
//       if (error) {
//         console.error('Error fetching event:', error.message);
//       } else {
//         setEvent(data);
//       }
//       setLoading(false);
//     };

//     fetchEvent();
//   }, [event_id]);

//   if (loading) return <p>Loading...</p>;

//   if (!event) return <p>Event not found</p>;

//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-background dark:bg-background">
//       <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 w-full max-w-2xl border border-border dark:border-border">
//         <h2 className="text-2xl font-bold mb-4 text-center text-card-foreground dark:text-card-foreground">
//           Registration Confirmation
//         </h2>
//         <p className="mb-4 text-card-foreground dark:text-card-foreground">
//           You have successfully registered for the event: <strong>{event.name}</strong>
//         </p>
//         <p className="mb-4 text-card-foreground dark:text-card-foreground">
//           Registration ID: <strong>{registration_id}</strong>
//         </p>
//         <p className="mb-4 text-card-foreground dark:text-card-foreground">
//           {event.description}
//         </p>
//         <div className="flex justify-center space-x-4 mt-4">
//           <Button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground">
//             Add to Calendar
//           </Button>
//           <Button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 dark:bg-secondary dark:text-secondary-foreground">
//             Show Map
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Confirmation;

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';
import { Button } from './ui/button';

const Confirmation = () => {
  const { event_id, registration_id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [registration, setRegistration] = useState(null);

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

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6">Event Confirmation</h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && event && registration && (
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
            <p className="text-lg font-semibold mb-4">
              Registration ID: {registration.registration_id}
            </p>
            <div className="flex space-x-4">
            <Button
              className="px-4 py-2 dark:bg-foreground-dark"
              onClick={() => {
              }}
            >
              Add to Calendar
            </Button>
            <Button
              className="px-4 py-2 dark:bg-foreground-dark"
              onClick={() => {
              }}
            >
              Show Map
            </Button>
            <Button
                className="px-4 py-2 dark:bg-foreground-dark"
                onClick={() => navigate('/payment')}
              >
                Donate for Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Confirmation;