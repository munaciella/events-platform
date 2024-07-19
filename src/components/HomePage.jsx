import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let { data: myData, error } = await supabase.from('events').select('*');
      if (error) {
        console.log('Error:', error);
        setError('Failed to fetch data. Please try again later.');
      } else {
        setData(myData);
        setError(null);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  const handleEventClick = (event_id) => {
    navigate(`/event/${event_id}`);
  };

  return (
    <section className="flex flex-col items-center p-4 mt-20">
      <h1 className="text-3xl font-bold mb-6 mt-14">Hero Section Here</h1>

      {loading && (
        <div className="grid grid-cols-1 justify-items-center m-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-16 mt-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 justify-items-center m-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-16 mt-6">
        {!loading &&
          !error &&
          data.map((item) => (
            <div
              key={item.id}
              className="w-full rounded-lg overflow-hidden shadow-lg mt-8 cursor-pointer"
              onClick={() => handleEventClick(item.event_id)}
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-full object-cover h-96"
              />
              <div className="flex flex-col items-center p-4">
                <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
                <p className="text-lg mb-2">{item.description}</p>
                <p className="text-md mb-2">{item.location}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {formatDate(item.start_time)}
                </p>
                  <p className="text-sm text-muted-foreground">£{item.price}</p>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
};

export default Home;
