import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Music, Calendar, MapPin, Gift, GlassWater, Utensils, PartyPopper, Camera, Heart, Sparkles, ChevronRight, Map } from 'lucide-react';

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 1.2, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
    className={className}
  >
    {children}
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
          <span className="text-4xl sm:text-5xl font-serif-display text-brand-rose mb-1">{String(item.value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-deep/50 font-medium">{item.label}</span>
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
    <div className="max-w-md mx-auto min-h-screen bg-brand-bg relative selection:bg-brand-muted selection:text-brand-deep overflow-x-hidden">
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop src={musicUrl} />

      {/* 1. Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-8 overflow-hidden">
        <motion.div 
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img 
            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800"
            alt="Fine art baby shower"
            className="w-full h-full object-cover opacity-20 scale-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg/0 via-brand-bg/40 to-brand-bg"></div>
        </motion.div>

        <FadeInUp className="relative z-10 space-y-6">
          <span className="text-[11px] uppercase tracking-[0.4em] text-brand-rose font-semibold block mb-2">Celebrando la vida de</span>
          <h1 className="font-script text-8xl sm:text-9xl text-brand-rose leading-none py-4">Madisson</h1>
          <div className="h-px w-12 bg-brand-dusty mx-auto mb-6"></div>
          <h2 className="font-serif-display italic text-3xl text-brand-deep/80">Baby Shower</h2>
        </FadeInUp>

        <FadeInUp delay={0.6} className="absolute bottom-12 left-0 right-0 z-10 flex justify-center">
          <button 
            onClick={toggleMusic}
            className="group flex items-center gap-3 bg-white/40 backdrop-blur-md border border-white/60 px-8 py-4 rounded-full shadow-sm text-brand-rose font-medium transition-all hover:bg-white/60 active:scale-95"
          >
            <div className="relative">
              <Music size={18} className={isPlaying ? "animate-pulse" : ""} />
              {isPlaying && (
                <motion.div 
                  layoutId="music-glow"
                  className="absolute inset-0 bg-brand-rose/20 blur-md rounded-full"
                />
              )}
            </div>
            <span className="text-xs uppercase tracking-[0.2em]">{isPlaying ? "Pausar Melodía" : "Escuchar Melodía"}</span>
          </button>
        </FadeInUp>
      </section>

      {/* 2. Welcome Message */}
      <section className="py-32 px-10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-brand-dusty to-transparent opacity-40"></div>
        <FadeInUp className="text-center space-y-8">
          <Heart className="mx-auto text-brand-muted" size={24} strokeWidth={1} />
          <p className="font-serif-body text-2xl leading-relaxed text-brand-deep/90 italic font-light">
            "Un pequeño milagro está por llegar para llenar nuestros días de luz y ternura. Queremos compartir con ustedes la alegría de esperar a nuestra pequeña Madisson."
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-1 h-1 rounded-full bg-brand-muted"></div>
            ))}
          </div>
        </FadeInUp>
      </section>

      {/* 3. Countdown Section */}
      <section className="py-24 px-8 bg-brand-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#7A4B5D" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
        <FadeInUp className="relative z-10 text-center">
          <h3 className="text-[10px] uppercase tracking-[0.3em] text-brand-dusty mb-12 font-bold">La dulce espera termina en</h3>
          <Countdown />
        </FadeInUp>
      </section>

      {/* 4. Event Details */}
      <section className="py-32 px-8 space-y-32">
        {/* Date */}
        <FadeInUp className="text-center">
          <div className="mb-10 inline-block relative">
            <div className="absolute inset-0 bg-brand-soft blur-2xl opacity-40 rounded-full"></div>
            <Calendar className="relative text-brand-rose mx-auto" size={32} strokeWidth={1} />
          </div>
          <h3 className="font-serif-display text-4xl text-brand-deep mb-4">Sábado 13 de Junio</h3>
          <p className="text-brand-rose tracking-[0.2em] font-medium mb-10">DOCE DEL MEDIODÍA</p>
          <button className="px-10 py-4 border border-brand-muted text-brand-rose rounded-full text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-brand-soft transition-colors active:scale-95">
            Guardar en Calendario
          </button>
        </FadeInUp>

        {/* Location */}
        <FadeInUp className="relative">
          <div className="bg-white p-1 rounded-[2.5rem] shadow-xl shadow-brand-deep/5 overflow-hidden">
            <div className="aspect-[4/5] relative overflow-hidden rounded-[2.2rem]">
              <img 
                src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&q=80&w=800"
                alt="Rancho Fernández"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-10 left-10 right-10 text-white">
                <div className="flex items-center gap-2 mb-2 opacity-80">
                  <MapPin size={14} />
                  <span className="text-[10px] uppercase tracking-widest">Ubicación</span>
                </div>
                <h4 className="font-serif-display text-3xl mb-2">Rancho Fernández</h4>
                <p className="text-xs opacity-70 font-light leading-relaxed">
                  C. Varela, Provincia de Alajuela, San Ramón, 20207
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <a 
              href="https://maps.app.goo.gl/mt4jkaaG7d6GVuQV8"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-brand-deep text-brand-cream px-10 py-5 rounded-full shadow-lg shadow-brand-deep/20 transition-all hover:translate-y-[-2px] active:scale-95"
            >
              <Map size={18} strokeWidth={1.5} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold">Ver cómo llegar</span>
            </a>
          </div>
        </FadeInUp>
      </section>

      {/* 5. Itinerary */}
      <section className="py-32 px-10 bg-brand-soft/30">
        <FadeInUp className="text-center mb-20">
          <Sparkles className="mx-auto text-brand-muted mb-6" size={24} strokeWidth={1} />
          <h3 className="font-serif-display text-4xl text-brand-deep">Nuestro Itinerario</h3>
        </FadeInUp>
        
        <div className="space-y-16 relative">
          <div className="absolute left-[19px] top-2 bottom-2 w-px bg-brand-muted/40"></div>
          {[
            { time: '12:00 PM', title: 'Recepción', icon: <GlassWater size={16} /> },
            { time: '01:00 PM', title: 'Almuerzo', icon: <Utensils size={16} /> },
            { time: '02:30 PM', title: 'Juegos y Risas', icon: <PartyPopper size={16} /> },
            { time: '04:00 PM', title: 'Pastel y Fotos', icon: <Camera size={16} /> },
          ].map((item, i) => (
            <FadeInUp key={i} delay={i * 0.1} className="relative flex items-start gap-8">
              <div className="w-10 h-10 rounded-full bg-white border border-brand-muted flex items-center justify-center text-brand-rose shrink-0 z-10 shadow-sm">
                {item.icon}
              </div>
              <div className="pt-1">
                <span className="text-[10px] uppercase tracking-widest text-brand-rose font-bold mb-1 block">{item.time}</span>
                <h4 className="font-serif-display text-xl text-brand-deep">{item.title}</h4>
              </div>
            </FadeInUp>
          ))}
        </div>
      </section>

      {/* 6. RSVP */}
      <section className="py-40 px-10 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--color-brand-soft)_0%,_transparent_70%)] opacity-30"></div>
        
        <FadeInUp className="relative z-10 space-y-10">
          <div className="space-y-4">
            <h3 className="font-serif-display text-4xl text-brand-deep">¿Nos acompañas?</h3>
            <p className="text-brand-deep/60 font-light leading-relaxed max-w-xs mx-auto">
              Tu presencia es el mejor regalo para Madisson. Por favor, confírmanos antes del 1 de Junio.
            </p>
          </div>
          
          <a 
            href="https://wa.me/1234567890?text=Hola,%20confirmo%20mi%20asistencia%20al%20baby%20shower%20de%20Madisson!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 bg-brand-rose text-white px-12 py-6 rounded-full shadow-2xl shadow-brand-rose/30 font-bold text-[11px] uppercase tracking-[0.3em] transition-all hover:scale-105 active:scale-95"
          >
            Confirmar Asistencia
            <ChevronRight size={16} />
          </a>
        </FadeInUp>
      </section>

      {/* 7. Footer */}
      <footer className="py-24 px-10 text-center border-t border-brand-muted/20">
        <FadeInUp className="space-y-8">
          <div className="font-script text-6xl text-brand-dusty">Madisson</div>
          <p className="text-[10px] uppercase tracking-[0.5em] text-brand-deep/40">Con amor, te esperamos</p>
          <div className="pt-12">
            <Heart className="mx-auto text-brand-soft fill-brand-soft" size={16} />
          </div>
        </FadeInUp>
      </footer>
    </div>
  );
}
