import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

const HeroSection = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/signup');
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between mt-16 md:mt-24 px-4 md:px-24">
      <div className="w-full md:w-1/2 order-2 md:order-1">
        <div className="flex flex-col justify-center text-left dark:text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Discover Events Near You</h1>
          <p className="text-lg md:text-2xl mb-6">Join like-minded people and explore events happening around you.</p>
          <Button onClick={handleGetStarted} className="w-40 py-2 text-lg bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
            Get Started
          </Button>
        </div>
      </div>
      <div className="w-full md:w-1/2 order-1 md:order-2 mb-8 md:mb-0">
        <div className="flex justify-center md:justify-end">
          <img
            src="assets/VectorIllustration.png"
            alt="Events"
            className="w-full max-w-md md:max-w-lg lg:max-w-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;