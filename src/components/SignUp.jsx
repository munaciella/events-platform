// /* eslint-disable react/prop-types */
// /* eslint-disable react-refresh/only-export-components */
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Input } from './ui/input';
// import { Button } from './ui/button';
// import Modal from './ui/Modal';
// import { SkeletonCard } from './ui/SkeletonCard';
// import { supabase } from '../../supabaseClient';
// import { useSupabaseAuth } from './AuthContext';

// const SignUp = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name, setName] = useState('');
//   const [businessCode, setBusinessCode] = useState(''); 
//   const [modalMessage, setModalMessage] = useState('');
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { setSession } = useSupabaseAuth();

//   const validateEmail = (email) => {
//     const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return re.test(email);
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     if (!validateEmail(email)) {
//       setModalMessage('Please enter a valid email address.');
//       setIsModalOpen(true);
//       setLoading(false);
//       return;
//     }

//     if (password.length < 8) {
//       setModalMessage('Password must be at least 8 characters long.');
//       setIsModalOpen(true);
//       setLoading(false);
//       return;
//     }

//     try {
//       const { data, error } = await supabase.auth.signUp({
//         email,
//         password,
//       });

//       if (error) {
//         throw error;
//       }

//       const user = data.user;

//       const role = businessCode === '2024' ? 'business' : 'user'; 

//       const { error: insertError } = await supabase.from('users').insert([
//         {
//           user_uuid: user.id,
//           email,
//           name,
//           role,
//           business_code: businessCode ? parseInt(businessCode, 10) : null
//         },
//       ]);

//       if (insertError) {
//         throw insertError;
//       }

//       setSession(data.session);

//       setModalMessage('Successfully signed up and logged in');
//       setIsModalOpen(true);

//       setTimeout(() => {
//         setIsModalOpen(false);
//         navigate('/');
//       }, 2500);
//     } catch (error) {
//       setModalMessage(`Error: ${error.message}`);
//       setIsModalOpen(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//   };

//   return (
//     <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
//       <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
//         Sign Up for EventSphere
//       </h1>

//       {loading && <SkeletonCard />}
//       {!loading && (
//         <>
//           <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
//             <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground dark:text-card-foreground">
//               Sign Up
//             </h2>
//             <form onSubmit={handleSignUp} className="space-y-4">
//               <Input
//                 type="text"
//                 placeholder="Name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//               />
//               <Input
//                 type="email"
//                 placeholder="Email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//               />
//               <Input
//                 type="password"
//                 placeholder="Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//               />
//               <Input
//                 type="text"
//                 placeholder="Business Code (if any)"
//                 value={businessCode}
//                 onChange={(e) => setBusinessCode(e.target.value)}
//                 className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
//               />
//               <Button
//                 type="submit"
//                 className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
//               >
//                 Sign up
//               </Button>
//             </form>
//           </div>
//           <Modal
//             isOpen={isModalOpen}
//             title="Authentication"
//             message={modalMessage}
//             onClose={handleCloseModal}
//           />
//         </>
//       )}
//     </section>
//   );
// };

// export default SignUp;

/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from './ui/input';
import { Button } from './ui/button';
import Modal from './ui/Modal';
import { SkeletonCard } from './ui/SkeletonCard';
import { supabase } from '../../supabaseClient';
import { useSupabaseAuth } from './AuthContext';
import { FaGoogle, FaFacebook } from 'react-icons/fa'; // Import social media icons

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [businessCode, setBusinessCode] = useState(''); 
  const [modalMessage, setModalMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useSupabaseAuth();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      setModalMessage('Please enter a valid email address.');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setModalMessage('Password must be at least 8 characters long.');
      setIsModalOpen(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      const user = data.user;

      const role = businessCode === '2024' ? 'business' : 'user'; 

      const { error: insertError } = await supabase.from('users').insert([
        {
          user_uuid: user.id,
          email,
          name,
          role,
          business_code: businessCode ? parseInt(businessCode, 10) : null
        },
      ]);

      if (insertError) {
        throw insertError;
      }

      setSession(data.session);

      setModalMessage('Successfully signed up and logged in');
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/');
      }, 2500);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialSignUp = async (provider) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider });

      if (error) {
        throw error;
      }

      const user = data.user;

      // Check if the user already exists in the users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('user_uuid', user.id)
        .single();

      if (!existingUser) {
        // Insert the new user into the users table
        const role = businessCode === '2024' ? 'business' : 'user';

        const { error: insertError } = await supabase.from('users').insert([
          {
            user_uuid: user.id,
            email: user.email,
            name: user.user_metadata.full_name || '',
            role,
            business_code: businessCode ? parseInt(businessCode, 10) : null,
          },
        ]);

        if (insertError) {
          throw insertError;
        }
      }

      setSession(data.session);

      setModalMessage('Successfully signed up and logged in');
      setIsModalOpen(true);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate('/');
      }, 2500);
    } catch (error) {
      setModalMessage(`Error: ${error.message}`);
      setIsModalOpen(true);
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="flex flex-col items-center p-4 max-w-3xl mx-auto bg-background mt-20 dark:bg-background">
      <h1 className="text-3xl font-bold mb-6 mt-14 text-center">
        Sign Up for EventSphere
      </h1>

      {loading && <SkeletonCard />}
      {!loading && (
        <>
          <div className="bg-card dark:bg-card rounded-lg shadow-md p-8 mt-8 w-full max-w-md border border-border dark:border-border">
            <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground dark:text-card-foreground">
              Sign Up
            </h2>
            <form onSubmit={handleSignUp} className="space-y-4">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Input
                type="text"
                placeholder="Business Code (if any)"
                value={businessCode}
                onChange={(e) => setBusinessCode(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-card dark:bg-input dark:border-border text-card-foreground"
              />
              <Button
                type="submit"
                className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 dark:bg-primary dark:text-primary-foreground"
              >
                Sign up
              </Button>
            </form>
            <div className="social-login-buttons flex justify-around mt-6">
              <Button onClick={() => handleSocialSignUp('google')} className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg">
                <FaGoogle className="mr-2" /> Sign Up with Google
              </Button>
              <Button onClick={() => handleSocialSignUp('facebook')} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg">
                <FaFacebook className="mr-2" /> Sign Up with Facebook
              </Button>
            </div>
          </div>
          <Modal
            isOpen={isModalOpen}
            title="Authentication"
            message={modalMessage}
            onClose={handleCloseModal}
          />
        </>
      )}
    </section>
  );
};

export default SignUp;