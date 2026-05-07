import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, Mail, Lock, User, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigate(from, { replace: true });
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match");
        return;
      }
      const success = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (success) {
        setIsLogin(true);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-28 lg:pt-32">
        <nav className="flex text-sm text-gray-500 gap-2 mb-12">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-[#D7282F] font-medium">{isLogin ? 'Sign-in' : 'Register'}</span>
        </nav>
      </div>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col items-center">
        <div className="max-w-md w-full text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-gray-800 mb-2">
            {isLogin ? 'Sign in' : 'Register'}
          </h1>
          <div className="w-16 h-1 bg-[#F2EDE7] mx-auto mb-12 relative overflow-hidden">
             <div className="absolute inset-0 bg-[#D7282F]/40 translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>
          </div>

          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-1">
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="space-y-1">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-200 rounded-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-300"
                placeholder="Email"
              />
            </div>

            <div className="space-y-1">
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-4 border border-gray-200 rounded-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-300"
                placeholder="Password"
              />
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" size="sm" className="text-xs text-[#D7282F] hover:underline font-medium">
                  Forgot your password?
                </Link>
              </div>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border border-gray-200 rounded-sm focus:border-gray-400 outline-none transition-all placeholder:text-gray-300"
                  placeholder="Confirm Password"
                />
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 bg-[#51823F] text-white font-bold rounded-sm hover:bg-[#457036] transition-all text-lg"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-gray-500 text-sm mb-4">
              {isLogin ? "New to EliteSeating?" : "Already have an account?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-gray-900 font-bold hover:text-[#D7282F] transition-colors"
            >
              {isLogin ? "Register now" : "Return to Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
