import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <section className="flex items-center justify-between mt-24 px-8">
      <div className="flex flex-col justify-center h-full text-left dark:text-white max-w-md md:pr-36 pr-16">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Events Near You</h1>
        <p className="text-lg md:text-2xl mb-8">Join like-minded people and explore events happening around you.</p>
        <Button onClick={handleGetStarted} className="py-3 px-6 text-lg bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
          Get Started
        </Button>
      </div>
      <div className="h-full w-1/2 flex justify-end items-center pl-36">
        <img src="assets/jr-korpa-jD1huE0iPk0-unsplash.jpg" alt="Events" className="object-cover w-96 h-80 rounded-lg shadow-lg" />
      </div>
    </section>
  );
};

export default HeroSection;