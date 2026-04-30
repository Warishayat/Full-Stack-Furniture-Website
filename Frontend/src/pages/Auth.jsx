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
    <div className="min-h-screen flex items-stretch bg-white">
      {/* Visual Side */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-950 relative overflow-hidden items-center justify-center p-20 pt-32 lg:pt-24">
         <div className="absolute inset-0">
            <img 
               src="https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2000&auto=format&fit=crop" 
               className="w-full h-full object-cover opacity-30 scale-110 animate-subtle-zoom"
               alt="Luxury Furniture"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-950 via-primary-950/80 to-accent/20" />
         </div>
         
         <div className="relative z-10 max-w-md text-center">
            <div className="w-20 h-20 bg-accent rounded-3xl rotate-12 flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-accent/20">
               <Sparkles className="w-10 h-10 text-white -rotate-12" />
            </div>
            <h2 className="text-5xl font-serif font-bold text-white mb-6 leading-tight">Join the <br/> <span className="text-accent italic">Elite Curation</span></h2>
            <h3 className="text-primary-300 text-lg leading-relaxed">Unlock exclusive access to our handcrafted masterpieces and bespoke interior services.</h3>
            
            <div className="mt-12 space-y-6 text-left">
               {[
                 'Early access to limited editions',
                 'Complimentary white-glove delivery',
                 'Direct consultation with master designers'
               ].map((text, i) => (
                 <div key={i} className="flex items-center gap-4 text-white/80">
                    <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center">
                       <CheckCircle className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-sm font-medium tracking-wide">{text}</span>
                 </div>
               ))}
            </div>
         </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-20 bg-secondary/30 pt-32 lg:pt-24">
        <div className="max-w-md w-full animate-fade-in-up mt-8 lg:mt-12">
          <div className="mb-12">
            <Link to="/" className="flex items-center gap-3 mb-10 lg:hidden">
               <div className="w-8 h-8 bg-accent rotate-45 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white -rotate-45" />
               </div>
               <h1 className="text-xl font-serif font-bold text-primary-950 tracking-widest">COMFORT.</h1>
            </Link>
            <h2 className="text-4xl font-serif font-bold text-primary-950 mb-3">
              {isLogin ? 'Welcome Back' : 'Begin Your Journey'}
            </h2>
            <p className="text-primary-400 font-medium tracking-wide">
              {isLogin 
                ? 'Sign in to manage your luxury curation.' 
                : 'Register to start your exceptional home experience.'}
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-primary-100 rounded-[1.5rem] focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                  placeholder="Your Full Name"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 group-focus-within:text-accent transition-colors" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-5 bg-white border border-primary-100 rounded-[1.5rem] focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 group-focus-within:text-accent transition-colors" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-14 pr-6 py-5 bg-white border border-primary-100 rounded-[1.5rem] focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                placeholder="Password"
              />
            </div>

            {!isLogin && (
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-300 group-focus-within:text-accent transition-colors" />
                <input
                  type="password"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-14 pr-6 py-5 bg-white border border-primary-100 rounded-[1.5rem] focus:ring-4 focus:ring-accent/10 focus:border-accent outline-none transition-all text-sm font-medium"
                  placeholder="Confirm Password"
                />
              </div>
            )}

            <button
              type="submit"
              className="group w-full py-5 px-6 bg-primary-950 text-white rounded-full hover:bg-accent font-bold transition-all shadow-2xl shadow-primary-900/20 flex items-center justify-center gap-3"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-primary-400 text-sm font-medium mb-4">
              {isLogin ? "New to COMFORT?" : "Already a member?"}
            </p>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-950 hover:text-accent font-bold text-sm underline decoration-accent/30 underline-offset-8 transition-all"
            >
              {isLogin ? "Apply for an Account" : "Return to Sign In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
