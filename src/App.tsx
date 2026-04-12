import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Music, Calendar, MapPin, Gift, GlassWater, Utensils, PartyPopper, Camera, Heart, Sparkles, ChevronRight, Map, Star } from 'lucide-react';
import { CalendarButton } from './components/CalendarButton';

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.4, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
  </motion.div>
);

const Sparkle = ({ className, delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0, 1, 0],
      rotate: [0, 90, 180]
    }}
    transition={{ 
      duration: 3, 
      repeat: Infinity, 
      delay,
      ease: "easeInOut" 
    }}
    className={`absolute text-brand-muted/40 ${className}`}
  >
    <Star size={12} fill="currentColor" />
  </motion.div>
);

const Countdown = () => {
  const targetDate = new Date('2026-06-13T12:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-6 sm:gap-10">
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl font-serif-display text-brand-deep mb-1">{String(item.value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-rose/60 font-bold">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 150]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  const musicUrl = "https://fwjdikkenbolqnyadgyq.supabase.co/storage/v1/object/sign/nv/YTDown.com_YouTube_Camilo-Evaluna-Montaner-Indigo-Official-_Media_DriCCFRQlj8_009_128k.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNTU1MzE4Ny1lNWQ2LTQyN2ItYjQzZi1kZjVlZWE4MzAwZGEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJudi9ZVERvd24uY29tX1lvdVR1YmVfQ2FtaWxvLUV2YWx1bmEtTW9udGFuZXItSW5kaWdvLU9mZmljaWFsLV9NZWRpYV9EcmlDQ0ZSUWxqOF8wMDlfMTI4ay5tcDMiLCJpYXQiOjE3NzU5NTQ4NDEsImV4cCI6MTgwNzQ5MDg0MX0.yUPybZvhvBsz8xIfOmlrvBTXhI9VeD7m4O1cc6CFo9E";

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      if (audioRef.current && audioRef.current.currentTime === 0) {
        audioRef.current.currentTime = 23;
      }
      audioRef.current?.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-brand-bg relative selection:bg-brand-muted selection:text-brand-dark overflow-x-hidden">
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop src={musicUrl} />

      {/* 1. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-8 overflow-hidden">
        <motion.div 
          style={{ y: heroY, opacity: opacityHero }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
            alt="Fine art baby shower"
            className="w-full h-full object-cover opacity-30 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/0 via-brand-bg/40 to-brand-bg"></div>
        </motion.div>

        <div className="absolute inset-0 pointer-events-none">
          <Sparkle className="top-1/4 left-1/4" delay={0} />
          <Sparkle className="top-1/3 right-1/4" delay={1} />
          <Sparkle className="bottom-1/4 left-1/3" delay={2} />
          <Sparkle className="top-1/2 right-1/3" delay={1.5} />
        </div>

        <FadeInUp className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="inline-block"
          >
            <span className="text-[10px] uppercase tracking-[0.5em] text-brand-rose font-bold block mb-4">Bienvenida al mundo de</span>
            <h1 className="font-script text-8xl sm:text-9xl text-brand-deep leading-none py-6 drop-shadow-sm">Madisson</h1>
          </motion.div>
          
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-8 bg-brand-muted"></div>
            <h2 className="font-serif-display italic text-2xl text-brand-dark/70 tracking-wide">Baby Shower</h2>
            <div className="h-px w-8 bg-brand-muted"></div>
          </div>
        </FadeInUp>

        <FadeInUp delay={0.8} className="absolute bottom-16 left-0 right-0 z-10 flex justify-center">
          <button 
            onClick={toggleMusic}
            className="group flex items-center gap-4 bg-white/60 backdrop-blur-lg border border-white/80 px-10 py-5 rounded-full shadow-xl shadow-brand-rose/10 text-brand-rose font-bold transition-all hover:bg-white/80 active:scale-95"
          >
            <div className="relative">
              <Music size={20} className={isPlaying ? "animate-pulse text-brand-deep" : ""} />
              {isPlaying && (
                <motion.div 
                  layoutId="music-glow"
                  className="absolute inset-0 bg-brand-rose/30 blur-xl rounded-full"
                />
              )}
            </div>
            <span className="text-[10px] uppercase tracking-[0.3em]">{isPlaying ? "Pausar Melodía" : "Escuchar Melodía"}</span>
          </button>
        </FadeInUp>
      </section>

      {/* 2. Welcome Message */}
      <section className="py-40 px-12 relative bg-white/20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-brand-muted to-transparent"></div>
        <FadeInUp className="text-center space-y-10">
          <div className="relative inline-block">
            <Heart className="text-brand-muted animate-float" size={32} strokeWidth={1} />
            <div className="absolute -top-2 -right-2">
              <Sparkles className="text-brand-soft animate-sparkle" size={16} />
            </div>
          </div>
          <p className="font-serif-body text-3xl leading-relaxed text-brand-dark/90 italic font-light px-2">
            "Antes de conocerte, ya te amábamos. Antes de que nacieras, ya eras nuestro sueño más dulce."
          </p>
          <p className="text-brand-rose/70 font-sans text-sm tracking-widest uppercase font-medium">Con amor, tus papás</p>
        </FadeInUp>
      </section>

      {/* 3. Editorial Collage: Esperándote con amor */}
      <section className="py-32 px-6 bg-brand-soft/20 relative overflow-hidden">
        <FadeInUp className="text-center mb-20">
          <h3 className="font-serif-display text-4xl text-brand-dark mb-4">Esperándote con amor</h3>
          <div className="h-px w-16 bg-brand-muted mx-auto"></div>
        </FadeInUp>

        <div className="relative h-[700px] w-full max-w-sm mx-auto">
          {/* Main Maternity Image */}
          <FadeInUp delay={0.2} className="absolute top-0 left-4 w-64 h-80 z-20">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-brand-rose/20 border-4 border-white rotate-[-3deg]">
              <img 
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=600"
                alt="Maternidad"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </FadeInUp>

          {/* Baby Details 1 */}
          <FadeInUp delay={0.4} className="absolute top-40 right-4 w-48 h-64 z-10">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl shadow-brand-rose/10 border-4 border-white rotate-[5deg]">
              <img 
                src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600"
                alt="Detalles bebé"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </FadeInUp>

          {/* Baby Details 2 */}
          <FadeInUp delay={0.6} className="absolute bottom-20 left-8 w-56 h-72 z-30">
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-brand-rose/20 border-4 border-white rotate-[-2deg]">
              <img 
                src="https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=600"
                alt="Zapatitos"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </FadeInUp>

          {/* Decorative Textures */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
            <div className="absolute top-1/4 right-0 w-32 h-32 bg-brand-muted/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 left-0 w-40 h-40 bg-brand-soft/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </section>

      {/* 4. Countdown Section */}
      <section className="py-24 px-8 bg-brand-cream relative">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="dots-new" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#A85E82" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots-new)" />
          </svg>
        </div>
        <FadeInUp className="relative z-10 text-center">
          <h3 className="text-[10px] uppercase tracking-[0.4em] text-brand-rose mb-12 font-black">Faltan solo</h3>
          <Countdown />
          <p className="mt-12 text-brand-dark/40 text-[10px] uppercase tracking-widest">Para nuestro gran encuentro</p>
        </FadeInUp>
      </section>

      {/* 5. Event Details */}
      <section className="py-32 px-8 space-y-40">
        {/* Date */}
        <FadeInUp className="text-center">
          <div className="mb-12 inline-block relative">
            <div className="absolute inset-0 bg-brand-soft blur-3xl opacity-60 rounded-full scale-150"></div>
            <div className="relative w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner border border-brand-soft">
              <Calendar className="text-brand-rose" size={32} strokeWidth={1} />
            </div>
          </div>
          <h3 className="font-serif-display text-4xl text-brand-dark mb-4">Sábado 13 de Junio</h3>
          <p className="text-brand-rose tracking-[0.3em] font-bold text-sm mb-12">12:00 PM</p>
          <CalendarButton />
        </FadeInUp>

        {/* Location */}
        <FadeInUp className="relative px-2">
          <div className="bg-white p-1.5 rounded-[3rem] shadow-2xl shadow-brand-deep/10 overflow-hidden border border-brand-soft">
            <div className="aspect-[4/5] relative overflow-hidden rounded-[2.8rem]">
              <img 
                src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800"
                alt="Rancho Fernández"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent"></div>
              <div className="absolute bottom-12 left-10 right-10 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-6 h-px bg-brand-muted"></div>
                  <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Ubicación</span>
                </div>
                <h4 className="font-serif-display text-4xl mb-3">Rancho Fernández</h4>
                <p className="text-xs opacity-80 font-light leading-relaxed tracking-wide">
                  C. Varela, Provincia de Alajuela, San Ramón, 20207
                </p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <a 
              href="https://maps.app.goo.gl/mt4jkaaG7d6GVuQV8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 bg-brand-dark text-brand-cream px-12 py-6 rounded-full shadow-2xl shadow-brand-dark/30 transition-all hover:translate-y-[-4px] active:scale-95"
            >
              <Map size={20} strokeWidth={1.5} />
              <span className="text-[10px] uppercase tracking-[0.3em] font-black">Ver cómo llegar</span>
            </a>
          </div>
        </FadeInUp>
      </section>

      {/* 6. Itinerary */}
      <section className="py-32 px-10 bg-brand-soft/10 relative">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_var(--color-brand-muted)_0%,_transparent_50%)] opacity-20"></div>
        <FadeInUp className="text-center mb-24 relative z-10">
          <Sparkles className="mx-auto text-brand-rose mb-6 animate-sparkle" size={28} strokeWidth={1} />
          <h3 className="font-serif-display text-4xl text-brand-dark">Nuestro Itinerario</h3>
          <p className="text-[10px] uppercase tracking-[0.4em] text-brand-rose/60 mt-4 font-bold">Momentos mágicos</p>
        </FadeInUp>
        
        <div className="space-y-20 relative z-10">
          <div className="absolute left-[23px] top-4 bottom-4 w-px bg-gradient-to-b from-brand-muted via-brand-rose to-brand-muted opacity-30"></div>
          {[
            { time: '12:00 PM', title: 'Recepción', icon: <GlassWater size={18} /> },
            { time: '01:00 PM', title: 'Almuerzo', icon: <Utensils size={18} /> },
            { time: '02:30 PM', title: 'Juegos y Risas', icon: <PartyPopper size={18} /> },
            { time: '04:00 PM', title: 'Pastel y Fotos', icon: <Camera size={18} /> },
          ].map((item, i) => (
            <FadeInUp key={i} delay={i * 0.1} className="relative flex items-start gap-10">
              <div className="w-12 h-12 rounded-full bg-white border-2 border-brand-soft flex items-center justify-center text-brand-rose shrink-0 z-10 shadow-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div className="pt-1.5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-rose font-black mb-2 block">{item.time}</span>
                <h4 className="font-serif-display text-2xl text-brand-dark">{item.title}</h4>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* 7. RSVP */}
      <section className="py-48 px-10 text-center relative overflow-hidden bg-brand-cream">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-brand-soft)_0%,_transparent_80%)] opacity-40"></div>
        
        <FadeInUp className="relative z-10 space-y-12">
          <div className="space-y-6">
            <h3 className="font-serif-display text-5xl text-brand-dark leading-tight">¿Nos acompañas?</h3>
            <p className="text-brand-dark/60 font-light leading-relaxed max-w-xs mx-auto text-lg italic">
              "Tu presencia es el mejor regalo para nuestra pequeña Madisson."
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-brand-rose font-bold">Confirma antes del 1 de Junio</p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <a 
              href="https://wa.me/50671757171?text=Hola%2C%20confirmo%20mi%20asistencia%20al%20Baby%20Shower%20de%20Madisson%20%F0%9F%92%96%0Ami%20nombre%20es%3A%0AAsistiremos%3A%0AMensaje%20adicional%3A"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-5 bg-brand-rose text-white px-14 py-7 rounded-full shadow-2xl shadow-brand-rose/40 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 group"
            >
              Confirmar Asistencia
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-[9px] uppercase tracking-[0.2em] text-brand-rose/60 font-bold italic">
              Puedes confirmarnos tu nombre y cuántas personas asistirán
            </p>
          </div>
        </FadeInUp>
      </section>

      {/* 8. Footer */}
      <footer className="py-32 px-12 text-center relative bg-brand-bg">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-brand-muted/30"></div>
        <FadeInUp className="space-y-10">
          <div className="font-script text-7xl sm:text-8xl text-brand-rose/80">Madisson</div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.6em] text-brand-dark/40 font-bold">Con amor, te esperamos</p>
            <p className="text-[9px] uppercase tracking-[0.3em] text-brand-rose/30">2026 • Baby Shower</p>
          </div>
          <div className="pt-16">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Heart className="mx-auto text-brand-muted fill-brand-muted/20" size={20} />
            </motion.div>
          </div>
        </FadeInUp>
      </footer>
    </div>
  );
}
