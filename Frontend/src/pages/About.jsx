import { Sparkles, Award, MapPin, Users, Globe, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center bg-primary-950 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2601&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 brightness-50"
            alt="Office"
          />
        </div>
        <div className="container mx-auto px-6 lg:px-20 relative z-10 pt-24 lg:pt-32">
          <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block animate-fade-in">Our Heritage</span>
          <h1 className="text-6xl lg:text-8xl font-serif font-bold text-white mb-8 animate-fade-in-up">
            Defining <span className="italic text-shine">British</span> <br/> Luxury
          </h1>
        </div>
      </section>

      {/* Origin Story */}
      <section className="py-32 bg-secondary/30">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="flex flex-col lg:flex-row gap-24 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl lg:text-5xl font-serif font-bold text-primary-950 mb-10 leading-tight">
                Established in London, <br/>
                <span className="text-accent italic">Inspired</span> by the World.
              </h2>
              <p className="text-lg text-primary-500 mb-8 leading-relaxed">
                Founded in 2010 in the heart of London, COMFORT began with a simple yet ambitious vision: to create furniture that doesn't just fill a space, but tells a story. We believe that a home is a sanctuary, and every piece within it should be a masterpiece of craftsmanship and comfort.
              </p>
              <p className="text-lg text-primary-500 mb-12 leading-relaxed">
                Our design philosophy is rooted in the "New British Modernism" — a blend of traditional artisan techniques with cutting-edge sustainable materials. Every sofa, chair, and table is an investment in quality that lasts for generations.
              </p>
              <div className="flex items-center gap-4 p-8 bg-white rounded-3xl shadow-xl shadow-primary-900/5 border border-primary-50">
                 <MapPin className="w-8 h-8 text-accent shrink-0" />
                 <div>
                    <h4 className="font-bold text-primary-950 uppercase tracking-widest text-xs">Flagship Showroom</h4>
                    <p className="text-primary-400 text-sm">123 Luxury Avenue, Mayfair, London, United Kingdom</p>
                 </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
                  <img src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover" alt="Showroom" />
               </div>
               <div className="absolute -bottom-10 -left-10 bg-primary-950 p-10 rounded-[2.5rem] shadow-2xl text-white max-w-[250px]">
                  <p className="text-4xl font-serif font-bold mb-2">14+</p>
                  <p className="text-[10px] text-primary-400 font-bold uppercase tracking-widest">Years of Excellence in British Design</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="container mx-auto px-6 lg:px-20">
          <div className="text-center mb-24">
             <span className="text-accent uppercase tracking-[0.4em] text-[10px] font-bold mb-6 block">Our Values</span>
             <h2 className="text-5xl font-serif font-bold text-primary-950">The Pillars of COMFORT</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="text-center p-10 bg-primary-50/30 rounded-[3rem] border border-primary-50 hover:border-accent transition-all duration-500">
               <Zap className="w-12 h-12 text-accent mx-auto mb-8" />
               <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4">Innovation</h3>
               <p className="text-primary-500 text-sm leading-relaxed">We use the latest sustainable materials and ergonomic designs to redefine modern living.</p>
            </div>
            <div className="text-center p-10 bg-primary-50/30 rounded-[3rem] border border-primary-50 hover:border-accent transition-all duration-500">
               <Award className="w-12 h-12 text-accent mx-auto mb-8" />
               <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4">Craftsmanship</h3>
               <p className="text-primary-500 text-sm leading-relaxed">Each piece is hand-finished by master artisans with decades of experience in fine furniture.</p>
            </div>
            <div className="text-center p-10 bg-primary-50/30 rounded-[3rem] border border-primary-50 hover:border-accent transition-all duration-500">
               <Globe className="w-12 h-12 text-accent mx-auto mb-8" />
               <h3 className="text-2xl font-serif font-bold text-primary-950 mb-4">Sustainability</h3>
               <p className="text-primary-500 text-sm leading-relaxed">100% Carbon Neutral operations and ethically sourced European timbers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary-950 text-white relative overflow-hidden">
         <div className="container mx-auto px-6 lg:px-20 text-center relative z-10">
            <h2 className="text-4xl lg:text-6xl font-serif font-bold mb-10">Ready to transform your home?</h2>
            <Link to="/products" className="inline-flex items-center px-12 py-6 bg-accent text-white font-bold rounded-full hover:bg-white hover:text-primary-950 transition-all shadow-2xl shadow-accent/20 uppercase tracking-widest text-xs">
               Explore the Collection <ArrowRight className="w-4 h-4 ml-3" />
            </Link>
         </div>
         <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      </section>
    </div>
  );
};

export default About;
