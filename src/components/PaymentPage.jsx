import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { SkeletonCard } from './ui/SkeletonCard';
import { useSupabaseAuth } from './AuthContext';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { session, userDetails } = useSupabaseAuth();
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      const { data: myEvent, error } = await supabase
        .from('events')
        .select('*')
        .eq('event_id', event_id)
        .single();
      if (error) {
        console.error('Error:', error);
        setError('Failed to fetch event. Please try again later.');
      } else {
        setEvent(myEvent);
        setError(null);
      }
      setLoading(false);
    };

    fetchEvent();
  }, [event_id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const user = userDetails;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      console.error('Error creating payment method:', error);
      setError('Failed to process payment. Please try again later.');
      return;
    }

    const { id: paymentMethodId } = paymentMethod;
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.event_id,
          user_id: user.user_id,
          payment_amount: event.price,
          payment_method_id: paymentMethodId,
        })
        .select()
        .single();

      //       if (error) {
      //         console.error('Error registering for event:', error.message);
      //         setError('Failed to register for event. Please try again later.');
      //       } else {
      //         navigate(`/confirmation/${event.event_id}/${data.registration_id}`);
      //       }
      //     } catch (error) {
      //       console.error('Error processing payment:', error);
      //       setError('Failed to process payment. Please try again later.');
      //     }
      //   };

      console.log('Insert response data:', data);

      if (error || !data || !data.registration_id) {
        console.error(
          'Error registering for event:',
          error ? error.message : 'No registration ID returned'
        );
        setError('Failed to register for event. Please try again later.');
      } else {
        navigate(`/confirmation/${event.event_id}/${data.registration_id}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Failed to process payment. Please try again later.');
    }
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Event Payment</h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && event && (
        <div className="w-full rounded-lg overflow-hidden shadow-lg mt-8">
          <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-lg mb-2">Price: £{event.price}</p>
            <form onSubmit={handleSubmit} className="w-full">
              <CardElement className="w-full p-2 border border-gray-300 rounded-md mb-4" />
              <Button
                className="w-full px-4 py-2 dark:bg-foreground-dark"
                type="submit"
                disabled={!stripe || !elements || loading}
              >
                Pay
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default PaymentPage;
