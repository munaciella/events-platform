import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Modal from './ui/Modal';
import { supabase } from '../../supabaseClient';
import { useSupabaseAuth } from './AuthContext';

const CreateEvent = () => {
  const { session, setSession, userDetails, setUserDetails } =
    useSupabaseAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [payAsYouLike, setPayAsYouLike] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [locationPoint, setLocationPoint] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUserBusiness, setIsUserBusiness] = useState(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (session && session.user) {
        const { data, error } = await supabase
          .from('users')
          .select('role, user_id')
          .eq('user_uuid', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          setLoading(false);
          return;
        }

        setSession((prevSession) => ({
          ...prevSession,
          user: { ...prevSession.user, role: data.role },
        }));

        if (data.role === 'business') {
          setIsUserBusiness(true);
        }

        setUserDetails({ ...userDetails, userId: data.user_id });
      }
      setLoading(false);
    };

    checkUserRole();
  }, [session, userDetails, setUserDetails, setSession]);

  const validateFields = () => {
    if (
      !title ||
      !description ||
      !location ||
      !startTime ||
      !endTime ||
      !city ||
      !imageUrl ||
      !locationPoint
    ) {
      setModalMessage('All fields must be filled.');
      setIsModalOpen(true);
      return false;
    }
    if (!/^\d+(\.\d{1,2})?$/.test(price)) {
      setModalMessage('Price must be a valid number (e.g., 0.00).');
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateFields()) {
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('events').insert([
        {
          title,
          description,
          location,
          start_time: startTime,
          end_time: endTime,
          price,
          pay_as_you_like: payAsYouLike,
          created_by: userDetails.user_id,
          image_url: imageUrl,
          location_point: locationPoint,
          city,
        },
      ]);

      if (error) {
        throw error;
      }

      setModalMessage('Event created successfully!');
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/');
      }, 2500);
    } catch (error) {
      setModalMessage(`Error creating event: ${error.message}`);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton count={8} height={40} />
      </div>
    );
  }

  if (!isUserBusiness) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-center text-red-500 text-xl">
          Access Denied. Only business users can create events.
        </p>
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Create Event
      </h1>
      <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
        <form onSubmit={handleCreateEvent} className="space-y-4 w-full">
          {loading ? (
            <Skeleton count={8} height={40} />
          ) : (
            <>
              <Input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="datetime-local"
                placeholder="Start Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="datetime-local"
                placeholder="End Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <div className="flex items-center justify-center space-x-2">
                <input
                  type="checkbox"
                  checked={payAsYouLike}
                  onChange={() => setPayAsYouLike(!payAsYouLike)}
                  className={`rounded border-gray-300 dark:border-gray-600 ${
                    payAsYouLike ? 'bg-orange-500' : ''
                  }`}
                />
                <label className="text-card-foreground dark:text-card-foreground">
                  Pay as you like
                </label>
              </div>
              <Input
                type="text"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Location Point (Coordinates)"
                value={locationPoint}
                onChange={(e) => setLocationPoint(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
              >
                Create Event
              </Button>
            </>
          )}
        </form>
      </div>
      <Modal
        isOpen={isModalOpen}
        title="Event Status"
        message={modalMessage}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default CreateEvent;
