// import { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { supabase } from '../../supabaseClient';
// import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
// import { Button } from './ui/button';
// import { SkeletonCard } from './ui/SkeletonCard';
// import { useSupabaseAuth } from './AuthContext';
// import { Input } from './ui/input';
// import Modal from './ui/Modal';

// const PaymentPage = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const navigate = useNavigate();
//   const { session, userDetails } = useSupabaseAuth();
//   const { event_id } = useParams();
//   const [event, setEvent] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [amount, setAmount] = useState('');
//   const [fullName, setFullName] = useState('');
//   const [address, setAddress] = useState('');
//   const [modalMessage, setModalMessage] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const fetchEvent = async () => {
//       setLoading(true);
//       const { data: myEvent, error } = await supabase
//         .from('events')
//         .select('*')
//         .eq('event_id', event_id)
//         .single();
//       if (error) {
//         console.error('Error:', error);
//         setError('Failed to fetch event. Please try again later.');
//       } else {
//         setEvent(myEvent);
//         setError(null);
//       }
//       setLoading(false);
//     };

//     fetchEvent();
//   }, [event_id]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) {
//       return;
//     }

//     const user = userDetails;
//     const cardElement = elements.getElement(CardElement);
//     const { error, paymentMethod } = await stripe.createPaymentMethod({
//       type: 'card',
//       card: cardElement,
//       billing_details: {
//         name: fullName,
//         address: {
//           line1: address,
//         },
//       },
//     });

//     if (error) {
//       console.error('Error creating payment method:', error);
//       setModalMessage('Failed to process payment. Please try again later.');
//       setIsModalOpen(true);
//       return;
//     }

//     const { id: paymentMethodId } = paymentMethod;
//     try {
//       const { data, error } = await supabase
//         .from('registrations')
//         .insert({
//           event_id: event.event_id,
//           user_id: user.user_id,
//           payment_amount: amount || event.price,
//           payment_method_id: paymentMethodId,
//         })
//         .select()
//         .single();

//       console.log('Insert response data:', data);

//       if (error || !data || !data.registration_id) {
//         console.error(
//           'Error registering for event:',
//           error ? error.message : 'No registration ID returned'
//         );
//         setModalMessage('Failed to register for event. Please try again later.');
//         setIsModalOpen(true);
//       } else {
//         setModalMessage(`Payment confirmed! Amount: £${amount || event.price}, Payment ID: ${data.registration_id}`);
//         setIsModalOpen(true);
//         setTimeout(() => {
//           navigate(`/confirmation/${event.event_id}/${data.registration_id}`);
//         }, 3000);
//       }
//     } catch (error) {
//       console.error('Error processing payment:', error);
//       setModalMessage('Failed to process payment. Please try again later.');
//       setIsModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
//       <h1 className="text-3xl font-bold mb-6 mt-14">Event Payment</h1>

//       {loading && <SkeletonCard />}
//       {error && <p className="text-red-500">{error}</p>}

//       {!loading && !error && event && (
//         <div className="w-full bg-card dark:bg-card rounded-lg overflow-hidden shadow-lg mt-8 border border-border dark:border-border dark:bg-background-dark">
//           <div className="flex flex-col items-center p-4">
//             <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
//             <p className="text-lg mb-2">Price: £{event.price}</p>
//             <form onSubmit={handleSubmit} className="w-full">
//               <div className="mb-4">
//                 <label htmlFor="amount" className="block text-sm font-medium">
//                   Donation Amount
//                 </label>
//                 <Input
//                   type="number"
//                   id="amount"
//                   className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="fullName" className="block text-sm font-medium">
//                   Full Name
//                 </label>
//                 <Input
//                   type="text"
//                   id="fullName"
//                   className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                 />
//               </div>
//               <div className="mb-4">
//                 <label htmlFor="address" className="block text-sm font-medium">
//                   Address
//                 </label>
//                 <Input
//                   type="text"
//                   id="address"
//                   className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                 />
//               </div>
//               <div className="w-full p-2 border border-gray-300 rounded-lg mb-4 dark:bg-gray-900">
//                 <CardElement className="dark:text-white dark:bg-white" />
//               </div>
//               <Button
//                 className="w-full px-4 py-2 dark:bg-foreground-dark dark:text-white"
//                 type="submit"
//                 disabled={!stripe || !elements || loading}
//               >
//                 Pay
//               </Button>
//             </form>
//           </div>
//         </div>
//       )}

//       <Modal
//         isOpen={isModalOpen}
//         title="Payment Status"
//         message={modalMessage}
//         onClose={handleCloseModal}
//       />
//     </section>
//   );
// };

// export default PaymentPage;


import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Button } from './ui/button';
import { SkeletonCard } from './ui/SkeletonCard';
import { useSupabaseAuth } from './AuthContext';
import { Input } from './ui/input';
import Modal from './ui/Modal';

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { session, userDetails } = useSupabaseAuth();
  const { event_id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amount, setAmount] = useState('');
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const validateName = (name) => {
    return /^[A-Za-z\s]+$/.test(name);
  };

  const validateAddress = (address) => {
    return /\d+\s+[\w\s]+,\s*[\w\s]+,\s*\w+\s*\d+/.test(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    const validatedAmount = parseFloat(amount) >= 1 ? parseFloat(amount).toFixed(2) : null;
    const priceToPay = event.price > 0 ? event.price : validatedAmount;

    if (!priceToPay || priceToPay < 1) {
      setModalMessage('The amount must be at least £1.00.');
      setIsModalOpen(true);
      return;
    }

    if (!fullName || !validateName(fullName)) {
      setModalMessage('Please enter a valid name containing only letters.');
      setIsModalOpen(true);
      return;
    }

    if (!address || !validateAddress(address)) {
      setModalMessage('Please enter a valid address including street, city, and postcode.');
      setIsModalOpen(true);
      return;
    }

    const user = userDetails;
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: fullName,
        address: {
          line1: address,
        },
      },
    });

    if (error) {
      console.error('Error creating payment method:', error);
      setModalMessage('Failed to process payment. Please try again later.');
      setIsModalOpen(true);
      return;
    }

    const { id: paymentMethodId } = paymentMethod;
    try {
      const { data, error } = await supabase
        .from('registrations')
        .insert({
          event_id: event.event_id,
          user_id: user.user_id,
          payment_amount: priceToPay,
          payment_method_id: paymentMethodId,
        })
        .select()
        .single();

      if (error || !data || !data.registration_id) {
        console.error(
          'Error registering for event:',
          error ? error.message : 'No registration ID returned'
        );
        setModalMessage('Failed to register for event. Please try again later.');
        setIsModalOpen(true);
      } else {
        setModalMessage(`Payment confirmed! Amount: £${priceToPay}, Payment ID: ${data.registration_id}`);
        setIsModalOpen(true);
        setTimeout(() => {
          navigate(`/confirmation/${event.event_id}/${data.registration_id}`);
        }, 3000);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setModalMessage('Failed to process payment. Please try again later.');
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14">Event Payment</h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && event && (
        <div className="w-full bg-card dark:bg-card rounded-lg overflow-hidden shadow-lg mt-8 border border-border dark:border-border dark:bg-background-dark">
          <div className="flex flex-col items-center p-4">
            <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
            <p className="text-lg mb-2">Price: £{event.price}</p>
            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-4">
                <label htmlFor="amount" className="block text-sm font-medium">
                  Donation Amount
                </label>
                <Input
                  type="number"
                  id="amount"
                  className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="1.00"
                  step="0.01"
                  onBlur={(e) => setAmount(e.target.value)} // Validate on blur
                />
              </div>
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium">
                  Full Name
                </label>
                <Input
                  type="text"
                  id="fullName"
                  className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={(e) => {
                    if (!validateName(e.target.value)) {
                      setModalMessage('Name must contain only letters and spaces.');
                      setIsModalOpen(true);
                    }
                  }}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium">
                  Address
                </label>
                <Input
                  type="text"
                  id="address"
                  className="w-full p-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onBlur={(e) => {
                    if (!validateAddress(e.target.value)) {
                      setModalMessage('Please enter a valid address.');
                      setIsModalOpen(true);
                    }
                  }}
                />
              </div>
              <div className="w-full p-2 border border-gray-300 rounded-lg mb-4 dark:bg-gray-900">
                <CardElement className="dark:text-white dark:bg-white" />
              </div>
              <Button
                className="w-full px-4 py-2 dark:bg-foreground-dark dark:text-white"
                type="submit"
                disabled={!stripe || !elements || loading}
              >
                Pay
              </Button>
            </form>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        title="Payment Status"
        message={modalMessage}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default PaymentPage;