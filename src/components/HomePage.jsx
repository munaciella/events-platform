import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let { data: myData, error } = await supabase
        .from('events')
        .select('*');
      if (error) console.log('Error:', error);
      else setData(myData);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 items-center justify-center min-h-screen py-2">
      <h1>Hero Section Here</h1>
      <ul>
        {data.map(item => (
          <li key={item.id}>{item.title} {item.description} {item.location} {item.start_time}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;