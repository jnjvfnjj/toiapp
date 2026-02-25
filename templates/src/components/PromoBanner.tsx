import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  description: string;
  color: string;
  emoji: string;
  action?: () => void;
}

interface PromoBannerProps {
  onBannerClick?: (id: number) => void;
}

export function PromoBanner({ onBannerClick }: PromoBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners: Banner[] = [
    {
      id: 1,
      title: 'Скидка 20% на первое мероприятие',
      description: 'Создайте свой первый той с выгодой',
      color: 'from-primary to-[#3B6EA5]',
      emoji: '🎊'
    },
    {
      id: 2,
      title: 'Новые площадки в Бишкеке',
      description: 'Более 50 проверенных локаций',
      color: 'from-accent to-[#B88A16]',
      emoji: '🏛️'
    },
    {
      id: 3,
      title: 'Планируйте заранее',
      description: 'Бронируйте площадки за 3 месяца',
      color: 'from-[#3B6EA5] to-[#1FB6B4]',
      emoji: '📅'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-3xl shadow-lg">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {banners.map((banner) => (
            <div
              key={banner.id}
              onClick={() => onBannerClick?.(banner.id)}
              className="min-w-full cursor-pointer"
            >
              <div className={`bg-gradient-to-r ${banner.color} p-6 relative overflow-hidden`}>
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white -translate-y-8 translate-x-8"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-white translate-y-8 -translate-x-8"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex items-center gap-4">
                  <div className="text-6xl">{banner.emoji}</div>
                  <div className="flex-1">
                    <h3 className="text-white mb-1">{banner.title}</h3>
                    <p className="text-white/90">{banner.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronLeft className="w-6 h-6 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
      >
        <ChevronRight className="w-6 h-6 text-primary" />
      </button>

      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? 'w-8 h-2 bg-primary'
                : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
