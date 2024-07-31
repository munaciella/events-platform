/* eslint-disable react/prop-types */
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button'; 
import { SkeletonCard } from './ui/SkeletonCard';

const ErrorPage = ({ title, message }) => {
  const navigate = useNavigate();

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-6 mt-14">Error</h1>

      {title ? (
        <p className="text-lg text-red-500 mb-4">{title}</p>
      ) : (
        <SkeletonCard />
      )}
      
      {message ? (
        <p className="text-lg text-red-500 mb-4">{message}</p>
      ) : (
        <SkeletonCard />
      )}

      <Button
        className="px-4 py-2 bg-primary text-white rounded-md dark:bg-foreground-dark"
        onClick={() => navigate('/')}
      >
        Go to Home
      </Button>
    </section>
  );
};

export default ErrorPage;
