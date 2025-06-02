import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

// Add custom animation for zooming effect
const customStyles = `
@keyframes zoomInOut {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(0.8); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-zoom {
  animation: zoomInOut 2.5s ease-in-out infinite;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Custom responsive button styles */
.hero-button {
  min-height: 48px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

@media (min-width: 640px) {
  .hero-button {
    width: auto;
    max-width: none;
    margin: 0;
  }
}

.cta-button {
  min-height: 48px;
  padding: 12px 32px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 8px;
  display: allow;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
}

@media (min-width: 600px) {
  .cta-button {
    width: auto;
    max-width: none;
  }
}

/* Footer link improvements */
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

@media (min-width: 768px) {
  .footer-links {
    flex-direction: row;
    gap: 24px;
  }
}

.footer-link {
  padding: 8px 16px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  min-width: 100px;
  text-align: center;
}

.footer-link:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #60a5fa;
}
`;

const LandingPage = () => {
  const [arrowPosition, setArrowPosition] = useState(0);
  
  // Effect for arrow animation
  useEffect(() => {
    const interval = setInterval(() => {
      setArrowPosition(prev => prev === 0 ? 5 : 0);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <style>{customStyles}</style>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-100 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="w-full md:w-1/2 text-center md:text-left">
             <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight">
  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Build The Life You Want</span> <span className="text-pink-600"> One Rupee at a Time</span>
</h1>

              <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-lg mx-auto md:mx-0">
                Easily track your income, expenses, and savings with our intuitive Expensia.
                Visualize your spending habits and make informed decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start">
                <Button 
                  size="lg" 
                  className="hero-button bg-gradient-to-r from-red-600 to-blue-700 hover:from-blue-700 hover:to-red-700 text-white animate-zoom" 
                  asChild
                >
                  <Link to="/register" className="flex items-center justify-center gap-2">
                    Get Started
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      className="transition-transform duration-300"
                      style={{ transform: `translateX(${arrowPosition}px)` }}
                    >
                      <path d="M5 12h14"></path>
                      <path d="m12 5 7 7-7 7"></path>
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-sm md:max-w-lg mx-auto">
                <img 
                  src="/financial-literacy-workshop-teens-fun-3d-scene-with-financial-advisor-teaching-budgeting-s_980716-151020.avif" 
                  alt="Finance Tracking" 
                  className="w-full h-auto rounded-full shadow-2xl hover:shadow-blue-500/10 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

   {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25px 25px, #667eea 2px, transparent 0)',
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16 stagger-animation">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-medium mb-4">
               Powerful Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Everything You Need To
              <span className="text-gradient block text-purple-700">Master Your Money</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover intelligent tools designed to simplify your financial journey and help you achieve your goals faster than ever before.
            </p>
          </div>
          
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Feature Card 1 */}
  <div className="feature-card p-8 rounded-3xl border-2 border-gray-200 hover:border-purple-300 stagger-animation group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl">
    <div className="feature-icon w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
        <path d="M12 2v20M2 12h20M4.2 19.8A9.9 9.9 0 0 1 2 12a9.9 9.9 0 0 1 2.2-7.8M19.8 4.2A9.9 9.9 0 0 1 22 12a9.9 9.9 0 0 1-2.2 7.8"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-purple-700 group-hover:text-purple-800 transition-colors duration-300">Smart Transaction Tracking</h3>
    <p className="text-gray-600 text-lg leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
      Easily add income and expenses with detailed categorization to keep track of where your money goes.
    </p>
    <div className="flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
      
      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        
      </svg>
    </div>
  </div>
  
  {/* Feature Card 2 */}
  <div className="feature-card p-8 rounded-3xl border-2 border-gray-200 hover:border-blue-300 stagger-animation group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl">
    <div className="feature-icon w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
        <path d="M3 3v18h18"></path>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-blue-700 group-hover:text-blue-800 transition-colors duration-300">Predictive Analytics</h3>
    <p className="text-gray-600 text-lg leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
      Beautiful charts and graphs help you understand your spending habits and financial trends at a glance.
    </p>
    <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
     
      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        
      </svg>
    </div>
  </div>
  
  {/* Feature Card 3 */}
  <div className="feature-card p-8 rounded-3xl border-2 border-gray-200 hover:border-orange-300 stagger-animation group transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 ease-out shadow-lg hover:shadow-2xl">
    <div className="feature-icon w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mb-6 relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
      <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="M9 12l2 2 4-4"></path>
      </svg>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-orange-700 group-hover:text-orange-800 transition-colors duration-300">Real-time Updates</h3>
    <p className="text-gray-600 text-lg leading-relaxed mb-6 group-hover:text-gray-700 transition-colors duration-300">
      See your financial data update instantly as you add new transactions, with immediate recalculation of totals.
    </p>
    <div className="flex items-center text-orange-600 font-semibold group-hover:text-orange-600 transition-colors duration-300">
      
      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">

      </svg>
    </div>
  </div>
</div>


          
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-black py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto stagger-animation">
            <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
               Keep Your Money Tracked
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Ready To Transform Your
              <span className="block text-yellow-300 glow-text">Financial Future?</span>
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed max-w-3xl mx-auto">
             "Just launched! Take control of your finances with our all-new platform — free and easy to use."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-center justify-center mb-12">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold px-10 py-5 text-xl rounded-2xl min-w-[280px] shadow-2xl transform hover:scale-105 transition-all duration-300 border-2 border-blue-400/50 hover:border-blue-300"
                asChild
              >
                <Link to="/register" className="flex items-center justify-center gap-3">
                  🚀 Start Free Trial
                  <svg className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-gradient mb-2">Expensia</h3>
              <p className="text-gray-400 text-lg">Your partner in smarter money decisions.</p>
              <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                <span className="px-3 py-1 bg-green-600 text-white text-xs rounded-full">🔒 Secure</span>
                <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">🚀 Fast</span>
                <span className="px-3 py-1 bg-orange-600 text-white text-xs rounded-full">🎯 Smart</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                to="/login" 
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-300 hover-lift font-medium"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 rounded-xl transition-all duration-300 hover-lift font-medium"
              >
                Register
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Expensia. All rights reserved. Made with ❤ for your financial success.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;