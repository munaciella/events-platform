import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { SkeletonCard } from './ui/SkeletonCard';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const results = location.state?.searchResults || [];
    if (results.length === 0) {
      setError('No events found');
    } else {
      setSearchResults(results);
    }
    setLoading(false);
  }, [location.state]);

  const handleEventClick = (eventId) => {
    navigate(`/event/${eventId}`);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 mt-14">Search Results</h1>

      {loading && <SkeletonCard />}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ul className="w-full space-y-4">
          {searchResults.map((event) => (
            <li
              key={event.id}
              className="cursor-pointer"
              onClick={() => handleEventClick(event.event_id)}
            >
              <div className="w-full rounded-lg overflow-hidden shadow-lg mt-8 border p-2 dark:bg-background-dark dark:text-foreground-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition duration-200">
                <img
                  src={event.image_url}
                  alt={event.title}
                  className="w-full object-cover h-96 mb-2 rounded-lg"
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
                  <p className="text-lg font-bold text-primary dark:text-primary-dark">
                    £ {event.price}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default SearchResults;