import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const {login_user} = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    // using login_user function from UserContext
    login_user(email, password);
    console.log('Logging in with:', email, password);
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Login </h1>

            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs">
                  <input required
                    type="email"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input required
                    type="password"
                    className="w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="mt-5 tracking-wide font-semibold bg-sky-500 text-gray-100 w-full py-4 rounded-lg hover:bg-sky-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                  >
                    <span className="ml-3">Login</span>
                  </button>
                </div>
              </form>
              <p className="mt-6 text-xs text-gray-600 text-center">
                Don't have an account?{' '}
                <a href="/register" className="border-b border-gray-500 border-dotted">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-sky-100 text-center hidden lg:flex">
  <div className="m-12 xl:m-16 w-full flex items-center justify-center">
    <img
      src="/Law firm-cuate.svg"
      alt="Legal case illustration"
      className="object-contain w-full h-full max-h-[500px]"
    />
  </div>
</div>

        </div>
      </div>
    
  );
};

export default Login;