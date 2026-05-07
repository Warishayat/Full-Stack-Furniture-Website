import { Sparkles, Award, MapPin, Users, Globe, Zap, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="container mx-auto px-6 lg:px-12 pt-32 lg:pt-40">
        <nav className="flex text-xs text-gray-400 gap-2 items-center mb-8">
          <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 font-medium">About Us</span>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2601&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 brightness-50"
            alt="EliteSeating Workshop"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Our Heritage</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-black text-white mb-8 leading-tight tracking-tighter">
            Defining <span className="italic text-white/90">British</span> <br/> Mastery
          </h1>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-32 bg-[#F2EDE7]/30">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2">
               <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-[1px] bg-[#D7282F]"></div>
                  <span className="text-[10px] font-black text-[#D7282F] uppercase tracking-widest">Since 2010</span>
               </div>
              <h2 className="text-4xl lg:text-6xl font-serif font-black text-gray-900 mb-10 leading-[1.1] tracking-tighter">
                Crafted in London, <br/>
                <span className="text-[#D7282F] italic">Curated</span> for Life.
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                Founded in the heart of London, EliteSeating Ltd. began with a singular mission: to restore the artistry of traditional British upholstery for the modern era. We believe furniture shouldn't just be functional—it should be an architectural statement.
              </p>
              <p className="text-lg text-gray-600 mb-12 leading-relaxed">
                Our design philosophy merges heritage craftsmanship with contemporary silhouettes. Every piece is built by hand in our dedicated workshops, using ethically sourced materials and time-honored techniques that have defined British luxury for centuries.
              </p>
              
              <div className="grid grid-cols-2 gap-8 pt-6">
                 <div className="space-y-2">
                    <h4 className="text-3xl font-serif font-black text-gray-900">15yr</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Frame Guarantee</p>
                 </div>
                 <div className="space-y-2">
                    <h4 className="text-3xl font-serif font-black text-gray-900">100%</h4>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hand-Finished</p>
                 </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-2xl shadow-gray-200">
                  <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="EliteSeating Craftsmanship" />
               </div>
               <div className="absolute -bottom-10 -right-10 bg-[#D7282F] p-12 text-white max-w-[280px] shadow-2xl">
                  <Heart className="w-8 h-8 mb-6" />
                  <p className="text-3xl font-serif font-bold italic mb-2 leading-none">Heritage</p>
                  <p className="text-[10px] text-white/80 font-black uppercase tracking-widest leading-relaxed">Built with passion and precision in the United Kingdom.</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-24 max-w-2xl mx-auto">
             <span className="text-[#D7282F] uppercase tracking-[0.4em] text-[10px] font-black mb-6 block">Our Pillars</span>
             <h2 className="text-5xl lg:text-6xl font-serif font-black text-gray-900 tracking-tighter">The Elite Standards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
            <div className="group">
               <div className="w-16 h-16 bg-[#F2EDE7] flex items-center justify-center mb-8 group-hover:bg-[#D7282F] group-hover:text-white transition-all duration-500">
                  <ShieldCheck className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Durability</h3>
               <p className="text-gray-500 text-sm leading-relaxed font-medium">Kiln-dried hardwood frames and heavy-duty springs designed to withstand generations of use.</p>
            </div>
            <div className="group">
               <div className="w-16 h-16 bg-[#F2EDE7] flex items-center justify-center mb-8 group-hover:bg-[#D7282F] group-hover:text-white transition-all duration-500">
                  <Award className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Artisan Finishing</h3>
               <p className="text-gray-500 text-sm leading-relaxed font-medium">Every button, seam, and stitch is overseen by master upholsterers with decades of experience.</p>
            </div>
            <div className="group">
               <div className="w-16 h-16 bg-[#F2EDE7] flex items-center justify-center mb-8 group-hover:bg-[#D7282F] group-hover:text-white transition-all duration-500">
                  <Globe className="w-8 h-8" />
               </div>
               <h3 className="text-2xl font-serif font-black text-gray-900 mb-4 tracking-tight">Ethical Sourcing</h3>
               <p className="text-gray-500 text-sm leading-relaxed font-medium">We partner with local UK suppliers to minimize our carbon footprint and support local trade.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-gray-900 text-white relative overflow-hidden">
         <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
            <h2 className="text-5xl lg:text-7xl font-serif font-black mb-12 tracking-tighter">Your sanctuary awaits.</h2>
            <Link to="/products" className="inline-flex items-center px-16 py-6 bg-[#D7282F] text-white font-black rounded-sm hover:bg-white hover:text-gray-900 transition-all shadow-2xl text-[10px] uppercase tracking-[0.3em]">
               Explore The Collection <ArrowRight className="w-4 h-4 ml-4" />
            </Link>
         </div>
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-[#D7282F]/10 rounded-full blur-[100px]" />
      </section>
    </div>
  );
};

export default About;

