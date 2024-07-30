import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Skeleton } from './ui/skeleton';
import Modal from './ui/Modal';
import { supabase } from '../../supabaseClient';
import { useSupabaseAuth } from './AuthContext';

const CreateEvent = () => {
  const { session, setSession, userDetails, setUserDetails } = useSupabaseAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('0.00'); 
  const [payAsYouLike, setPayAsYouLike] = useState(true);
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
    const urlPattern = new RegExp('https?://.+');
    const pricePattern = /^\d+(\.\d{1,2})?$/;
    const coordinatePattern = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    const lettersOnlyPattern = /^[a-zA-Z\s]+$/;

    if (!title || !description || !location || !startTime || !endTime || !city || !imageUrl || !locationPoint) {
      setModalMessage('All fields must be filled.');
      setIsModalOpen(true);
      return false;
    }
    if (!lettersOnlyPattern.test(location) || !lettersOnlyPattern.test(city)) {
      setModalMessage('Location and City must contain only letters.');
      setIsModalOpen(true);
      return false;
    }
    if (!/[a-zA-Z]/.test(title) || /^[0-9]+$/.test(title)) {
      setModalMessage('Title must contain letters and cannot be only numbers.');
      setIsModalOpen(true);
      return false;
    }
    if (!pricePattern.test(price)) {
      setModalMessage('Price must be a valid number in format £0.00.');
      setIsModalOpen(true);
      return false;
    }
    if (price === "0.00" && !payAsYouLike) {
      setModalMessage('Please select "Pay as you like" if price is 0.00.');
      setIsModalOpen(true);
      return false;
    }
    if (!urlPattern.test(imageUrl)) {
      setModalMessage('Image URL must be a valid URL.');
      setIsModalOpen(true);
      return false;
    }
    if (!coordinatePattern.test(locationPoint)) {
      setModalMessage('Location Point must be valid coordinates.');
      setIsModalOpen(true);
      return false;
    }
    return true;
  };

  const handleBlur = (setter, value, pattern, fieldName) => {
    if (!pattern.test(value)) {
      setModalMessage(`${fieldName} is invalid.`);
      setIsModalOpen(true);
    }
    setter(value.replace(/[^a-zA-Z0-9\s]/g, '').replace(/^(.)/, (c) => c.toUpperCase()));
  };

  const handleLocationBlur = (value) => {
    if (!/^[a-zA-Z\s,]+$/.test(value)) {
      setModalMessage('Location must contain only letters.');
      setIsModalOpen(true);
    }
    setLocation(value.replace(/[^a-zA-Z\s,]/g, '').replace(/^(.)/, (c) => c.toUpperCase()));
  };

  const handleCityBlur = (value) => {
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      setModalMessage('City must contain only letters.');
      setIsModalOpen(true);
    }
    setCity(value.replace(/[^a-zA-Z\s]/g, '').replace(/^(.)/, (c) => c.toUpperCase()));
  };

  const handlePriceChange = (value) => {
    const newValue = value.replace(/[^0-9.]/g, '');
    setPrice(newValue);
    if (newValue === "0.00") {
      setPayAsYouLike(true);
    }
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

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Create Event
      </h1>
      <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
        <form onSubmit={handleCreateEvent} className="space-y-4 w-full">
          <Input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={(e) => handleBlur(setTitle, e.target.value, /[a-zA-Z]/, 'Title')}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={(e) => handleBlur(setDescription, e.target.value, /[a-zA-Z]/, 'Description')}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <Input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={(e) => handleLocationBlur(e.target.value)}
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
            placeholder="Price (£0.00)"
            value={price}
            onChange={(e) => handlePriceChange(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <div className="flex items-center justify-center space-x-2">
            <input
              type="checkbox"
              checked={payAsYouLike}
              onChange={() => setPayAsYouLike(!payAsYouLike)}
              className={`rounded border-gray-300 dark:border-gray-600 ${payAsYouLike ? 'bg-orange-500' : ''}`}
            />
            <label className="text-card-foreground dark:text-card-foreground">
              Pay as you like
            </label>
          </div>
          <Input
            type="text"
            placeholder="Image URL (e.g. https://img.com/img.jpg)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <Input
            type="text"
            placeholder="Location Coordinates (e.g., 37.7749, -122.4194)"
            value={locationPoint}
            onChange={(e) => setLocationPoint(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <Input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onBlur={(e) => handleCityBlur(e.target.value)}
            className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
          />
          <Button
            type="submit"
            className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
          >
            Create Event
          </Button>
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

