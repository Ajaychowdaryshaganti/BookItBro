import React from 'react';

const ComingSoonPage = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`
              absolute animate-float
              w-24 h-24 opacity-10
              rounded-full
              bg-[#FF8C37]
              ${i % 2 === 0 ? 'animate-float-slow' : 'animate-float-fast'}
            `}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              transform: `scale(${1 + Math.random()})`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p">
        {/* Logo Container */}
        <div className="mb-12 w-full max-w-2xl px-8 animate-fadeIn">
          <img 
            src="/logo.png" 
            alt="BookItBro Logo" 
            className="w-full h-auto"
          />
        </div>

        {/* Main Content */}
        <div className="text-center animate-slideUp">
          <h1 className="text-[#1A1B4B] text-4xl md:text-4xl font-bold mb-4">
            Stay Tuned!
          </h1>
          <p className="text-[#65868B] text-xl md:text-2xl mb-8">
            Something Big Is Coming
          </p>

          {/* Animated Loading Indicator */}
          <div className="flex justify-center">
            <div className="w-16 h-16 border-4 border-[#FF8C37] border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-[#65868B] animate-fadeIn">
          <p className="text-lg">JUST BOOK IT...!</p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;