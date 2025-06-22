import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [role, setRole] = useState('client'); // default role

  const { register_user } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      toast.error("Passwords do not match!");
      return;
    } else if (password.length < 4) {
      toast.error("Password must be at least 8 characters long and contain both letters and numbers!");
      return;
    } else {
      register_user(username, email, password, role);
      setEmail('');
      setPassword('');
      setRepeatPassword('');
      setUsername('');
      setRole('client');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>

            <div className="w-full flex-1 mt-8">
              <form onSubmit={handleSubmit}>
                <div className="mx-auto max-w-xs space-y-5">
                  <input
                    type="text"
                    className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <input
                    type="email"
                    className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <input
                    type="password"
                    className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                  />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  >
                    <option value="client">Client</option>
                    <option value="lawyer">Lawyer</option>
                    <option value="admin">Admin</option>
                    
                  </select>
                  <button
                    type="submit"
                    className="tracking-wide font-semibold bg-sky-500 text-white w-full py-4 rounded-lg hover:bg-sky-700 transition-all duration-300 ease-in-out"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
              <p className="mt-6 text-xs text-gray-600 text-center">
                Already have an account?{' '}
                <a href="/login" className="border-b border-gray-500 border-dotted">
                  Login here
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

export default Register;
