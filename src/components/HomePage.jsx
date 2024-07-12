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
    <div className="p-2">
      <h1>Hero Section Here</h1>
      <ul>
        {data.map(item => (
          <div key={item.id}>
            <img src={item.image_url} alt={item.title} />
            <li>{item.title} {item.description} {item.location} {item.start_time}</li>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Home;