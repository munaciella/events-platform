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
    <section className="flex flex-col items-center p-4">
      <h1>Hero Section Here</h1>
      <div className='grid grid-cols-1 justify-items-center m-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-6'>
        {data.map(item => (
          <div key={item.id} >
              <div className="w-full rounded-lg overflow-hidden shadow-lg">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover"/>
              </div>
              <div className="flex flex-col">
                <span>{item.title} {item.description} {item.location} {item.start_time}</span>
            </div>
          </div>
        ))}
        </div>
    </section>
  );
};

export default Home;