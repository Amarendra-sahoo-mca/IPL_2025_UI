import  { useState, useEffect, CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CustomCSSProperties extends CSSProperties {
    // Add any custom properties if needed
    transition?: string; // Optional if you want to define specific transitions
  }
  function getComplementaryColor(hex:string) { 
    hex = hex.replace(/^#/, ''); const r = (255 - parseInt(hex.substring(0, 2), 16)).toString(16).padStart(2, '0'); const g = (255 - parseInt(hex.substring(2, 4), 16)).toString(16).padStart(2, '0'); const b = (255 - parseInt(hex.substring(4, 6), 16)).toString(16).padStart(2, '0');
    
     return `#${r}${g}${b}`.toUpperCase(); 
}

const sampleCards = [
  {
    id: 1,
    title: "Chennai Super Kings",
    image: "/api/placeholder/400/250",
    bgc:'#ff0',
    category: "Action"
  },
  {
    id: 10,
    title: "Delhi Capitals",
    image: "/api/placeholder/400/250",
    bgc:'#EF4123',  
    category: "Drama"
  },
  {
    id: 2,
    title: "Gujarat Titans",
    image: "/api/placeholder/400/250",
    bgc:'#0d6efd',  
    category: "Drama"
  },
  {
    id: 3,
    title: "Kolkata Knight Riders",
    image: "/api/placeholder/400/250",
    bgc:'#ffc107',
    category: "Comedy"
  },
  {
    id: 4,
    title: "Lucknow Super Giants",
    image: "/api/placeholder/400/250",
    bgc:'#0d6e22',
    category: "Thriller"
  },
  {
    id: 5,
    title: "Mumbai Indians",
    image: "/api/placeholder/400/250",
    bgc:'#0d6efd',
    category: "Sci-Fi"
  },
  {
    id: 6,
    title: "Punjab Kings",
    image: "/api/placeholder/400/250",
    bgc:'#fa1111',
    category: "Sci-Fi"
  },
  {
    id: 7,
    title: "Royal Challengers Bengaluru",
    image: "/api/placeholder/400/250",
    bgc:'#000000',
    category: "Sci-Fi"
  },
  {
    id: 8,
    title: "Rajasthan Royals",
    image: "/api/placeholder/400/250",
    bgc:'#0011ff',
    category: "Sci-Fi"
  },
  {
    id: 9,
    title: "Sunrisers Hyderabad",
    image: "/api/placeholder/400/250",
    bgc:'#ff9900',
    category: "Sci-Fi"
  }
];

const SmoothOverlapSlider = ({ 
  cards = sampleCards, 
  title = "Teams",
  autoPlayInterval = 5000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('');

  const handleNext = () => {
    setDirection('right');
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(handleNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Helper function to get card at specific position relative to current index
  const getCardAtOffset = (offset: number) => {
    const index = (currentIndex + offset + cards.length) % cards.length;
    return cards[index];
  };

  // Determine card classes and styles based on position
  const getCardStyles = (offset: number) => {
    if (offset === 0) {
      return {
        transform: 'scale(1.2)',
        zIndex: 20,
        opacity: 1,
        position: 'relative'
      };
    }
    
    if (offset === -1) {
      return {
        transform: 'translateX(-50%) scale(0.8)',
        zIndex: 10,
        opacity: 0.6,
        position: 'absolute',
        left: 0
      };
    }
    
    if (offset === 1) {
      return {
        transform: 'translateX(50%) scale(0.8)',
        zIndex: 10,
        opacity: 0.6,
        position: 'absolute',
        right: 0
      };
    }
    
    return {
      opacity: 0,
      display: 'none'
    };
  };

  return (
    <div className="w-screen py-8 bg-[#ff0707] relative overflow-hidden">
      <div className="container mx-auto px-4 relative">
        <h2 className="text-white text-xl font-bold mb-6">{title}</h2>
        
        {/* Navigation Buttons */}
        <button 
          onClick={handlePrev} 
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 rounded-full p-2 hover:bg-black/70"
        >
          <ChevronLeft color="white" size={24} />
        </button>
        
        <button 
          onClick={handleNext} 
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/50 rounded-full p-2 hover:bg-black/70"
        >
          <ChevronRight color="white" size={24} />
        </button>

        {/* Slider Container */}
        <div className="flex items-center justify-center w-screen relative h-96  ">
          {/* Render cards with dynamic positioning */}
          {[...Array(3)].map((_, i) => {
            const card = getCardAtOffset(i - 1);
            const cardStyles = getCardStyles(i - 1);
            // const colour = getComplementaryColor(card.bgc)
            // console.log("colour",colour, 'bgc',card.bgc );
            
            return (
              <div 
                key={card.id}
                className="absolute w-full flex justify-center transition-all duration-500 ease-in-out " style={{
                    ...cardStyles,
                    transition: 'all 500ms ease-in-out'
                  } as CustomCSSProperties} 
              >
               
                <div className="w-2/5 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: card.bgc}}>
                  <img 
                    src={card.image} 
                    alt={card.title} 
                    className="w-96 h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-white font-bold text-lg" style={{ color: '#000000'}}>
                      {card.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {card.category}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default SmoothOverlapSlider