import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Calendar, MapPin, Gift, GlassWater, Utensils, PartyPopper, Camera, Settings, X, Wand2, Image as ImageIcon, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

const FadeInUp = ({ children, delay = 0, className = "" }: { children: React.ReactNode, delay?: number, className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.8, delay, ease: "easeOut" }}
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
    <div className="flex justify-center gap-3 sm:gap-4">
      {[
        { label: 'Días', value: timeLeft.days },
        { label: 'Horas', value: timeLeft.hours },
        { label: 'Min', value: timeLeft.minutes },
        { label: 'Seg', value: timeLeft.seconds },
      ].map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-pink-100 mb-2">
            <span className="text-2xl font-serif text-pink-600">{item.value}</span>
          </div>
          <span className="text-[10px] sm:text-xs uppercase tracking-wider text-pink-500 font-medium">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Customization State
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [musicUrl, setMusicUrl] = useState("https://fwjdikkenbolqnyadgyq.supabase.co/storage/v1/object/sign/nv/YTDown.com_YouTube_Camilo-Evaluna-Montaner-Indigo-Official-_Media_DriCCFRQlj8_009_128k.mp3?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNTU1MzE4Ny1lNWQ2LTQyN2ItYjQzZi1kZjVlZWE4MzAwZGEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJudi9ZVERvd24uY29tX1lvdVR1YmVfQ2FtaWxvLUV2YWx1bmEtTW9udGFuZXItSW5kaWdvLU9mZmljaWFsLV9NZWRpYV9EcmlDQ0ZSUWxqOF8wMDlfMTI4ay5tcDMiLCJpYXQiOjE3NzU5NTQ4NDEsImV4cCI6MTgwNzQ5MDg0MX0.yUPybZvhvBsz8xIfOmlrvBTXhI9VeD7m4O1cc6CFo9E");
  const [parentsImg, setParentsImg] = useState("https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400");
  const [ultrasoundImg, setUltrasoundImg] = useState("https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=400");

  // AI Generation State
  const [musicPrompt, setMusicPrompt] = useState("Una canción de cuna muy dulce y tierna para una bebé niña, melodía suave con cajita de música, arpa y campanitas mágicas");
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [imagePrompt, setImagePrompt] = useState("Una ilustración en acuarela muy tierna de unos zapatitos de bebé niña color rosa pastel");
  const [imageTarget, setImageTarget] = useState<"parents" | "ultrasound">("parents");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  useEffect(() => {
    window.aistudio?.hasSelectedApiKey().then(setHasKey);
  }, []);

  const handleSelectKey = async () => {
    await window.aistudio?.openSelectKey();
    setHasKey(true);
  };

  const generateMusic = async () => {
    setIsGeneratingMusic(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContentStream({
        model: "lyria-3-clip-preview",
        contents: musicPrompt,
      });

      let audioBase64 = "";
      let mimeType = "audio/wav";

      for await (const chunk of response) {
        const parts = chunk.candidates?.[0]?.content?.parts;
        if (!parts) continue;
        for (const part of parts) {
          if (part.inlineData?.data) {
            if (!audioBase64 && part.inlineData.mimeType) {
              mimeType = part.inlineData.mimeType;
            }
            audioBase64 += part.inlineData.data;
          }
        }
      }

      if (audioBase64) {
        const binary = atob(audioBase64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([bytes], { type: mimeType });
        const audioUrl = URL.createObjectURL(blob);
        setMusicUrl(audioUrl);
        // Auto-play the new music
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play().catch(e => console.log("Audio play failed:", e));
          setIsPlaying(true);
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        setHasKey(false);
        alert("Please select your API key again.");
      } else {
        alert("Error generating music: " + error.message);
      }
    }
    setIsGeneratingMusic(false);
  };

  const generateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: imagePrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: "1K"
          }
        }
      });
      
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          const imageUrl = `data:image/jpeg;base64,${base64EncodeString}`;
          if (imageTarget === 'parents') setParentsImg(imageUrl);
          if (imageTarget === 'ultrasound') setUltrasoundImg(imageUrl);
        }
      }
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("Requested entity was not found") || error.message?.includes("API key")) {
        setHasKey(false);
        alert("Please select your API key again.");
      } else {
        alert("Error generating image: " + error.message);
      }
    }
    setIsGeneratingImage(false);
  };

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
    <div className="max-w-md mx-auto min-h-screen shadow-2xl overflow-hidden bg-pink-50 relative font-sans text-pink-900 selection:bg-pink-200">
      
      {/* Hidden Audio Element */}
      <audio ref={audioRef} loop src={musicUrl} />

      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-pink-100/80 to-pink-50 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-full h-64 bg-pink-200 rounded-b-full opacity-40 blur-3xl -translate-y-1/4"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-200 rounded-t-full opacity-40 blur-3xl translate-y-1/4 translate-x-1/4"></div>
        
        <FadeInUp className="relative z-10">
          <h2 className="font-serif italic text-2xl sm:text-3xl text-pink-600 mb-2">Baby Shower</h2>
        </FadeInUp>
        
        <FadeInUp delay={0.2} className="relative z-10">
          <h1 className="font-script text-7xl sm:text-8xl text-pink-800 mb-12 drop-shadow-sm py-2">Madisson</h1>
        </FadeInUp>
        
        <FadeInUp delay={0.4} className="relative z-10">
          <button 
            onClick={toggleMusic}
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg shadow-pink-200/50 text-pink-600 font-medium transition-all active:scale-95 hover:bg-white"
          >
            <Music size={20} className={isPlaying ? "animate-pulse text-pink-500" : ""} />
            {isPlaying ? "Pausar Música" : "Reproducir Música"}
          </button>
        </FadeInUp>
      </section>

      {/* 2. Introducción y Fotos */}
      <section className="py-20 px-6 relative bg-pink-50">
        <FadeInUp>
          <div className="text-center mb-16">
            <p className="text-lg leading-relaxed text-pink-800/80 font-light">
              Estamos muy felices de compartir este momento tan especial con ustedes. ¡La familia crece y queremos celebrarlo juntos!
            </p>
          </div>
        </FadeInUp>

        <div className="relative h-80 w-full max-w-[280px] mx-auto">
          <FadeInUp delay={0.2}>
            <div className="absolute top-0 left-0 w-48 h-56 bg-white/95 backdrop-blur-sm p-3 shadow-[0_15px_40px_-10px_rgba(236,72,153,0.25)] rounded-xl rotate-[-6deg] z-10 transition-all hover:-translate-y-3 hover:rotate-0 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(236,72,153,0.45)] duration-300 border border-pink-50">
              <div className="relative w-full h-full bg-pink-100 overflow-hidden rounded-md">
                <img 
                  src={parentsImg} 
                  alt="Padres" 
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-pink-300/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </FadeInUp>
          <FadeInUp delay={0.4}>
            <div className="absolute top-12 right-0 w-48 h-56 bg-white/95 backdrop-blur-sm p-3 shadow-[0_15px_40px_-10px_rgba(236,72,153,0.25)] rounded-xl rotate-[8deg] z-20 transition-all hover:-translate-y-3 hover:rotate-0 hover:z-30 hover:shadow-[0_25px_50px_-12px_rgba(236,72,153,0.45)] duration-300 border border-pink-50">
              <div className="relative w-full h-full bg-pink-200 overflow-hidden flex items-center justify-center rounded-md">
                <img 
                  src={ultrasoundImg} 
                  alt="Ultrasonido" 
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/watercolor.png')] opacity-50 mix-blend-multiply pointer-events-none"></div>
                <div className="absolute inset-0 bg-pink-300/10 mix-blend-overlay pointer-events-none"></div>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* 3. Contador Regresivo */}
      <section className="py-16 px-6 bg-white/60 backdrop-blur-sm relative">
        <div className="absolute inset-0 bg-[radial-gradient(#fbcfe8_1px,transparent_1px)] [background-size:16px_16px] opacity-30"></div>
        <FadeInUp className="relative z-10">
          <h3 className="font-serif text-3xl text-center text-pink-700 mb-8">¿Cuánto falta?</h3>
          <Countdown />
        </FadeInUp>
      </section>

      {/* 4. Agenda y Ubicación */}
      <section className="py-20 px-6 text-center bg-pink-50">
        <FadeInUp>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-500 mb-6 shadow-inner">
            <Calendar size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl text-pink-800 mb-2">Sábado 13 de Junio</h3>
          <p className="text-xl text-pink-600 mb-8 font-light">12:00 PM</p>
          
          <button className="w-full max-w-xs mx-auto bg-pink-500 text-white py-3.5 rounded-full shadow-lg shadow-pink-200 mb-16 font-medium transition-transform active:scale-95">
            Agendar en Calendario
          </button>
        </FadeInUp>

        <FadeInUp delay={0.2}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 text-pink-500 mb-6 shadow-inner">
            <MapPin size={32} strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-2xl text-pink-800 mb-3">Rancho Fernández</h3>
          <p className="text-pink-700/80 mb-8 px-4 font-light leading-relaxed">
            C. Varela, Provincia de Alajuela, San Ramón, 20207
          </p>

          <div className="flex flex-col gap-4 max-w-xs mx-auto">
            <a 
              href="https://maps.app.goo.gl/mt4jkaaG7d6GVuQV8"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-white text-pink-600 border border-pink-200 py-3.5 rounded-full shadow-sm font-medium transition-colors hover:bg-pink-50 active:scale-95 block text-center"
            >
              Ver Ubicación en Mapa
            </a>
          </div>
        </FadeInUp>
      </section>

      {/* 5. Itinerario */}
      <section className="py-20 px-8 bg-pink-100/40">
        <FadeInUp>
          <h3 className="font-serif text-3xl text-center text-pink-800 mb-14">Itinerario</h3>
          
          <div className="relative border-l-2 border-pink-200 ml-4 sm:ml-8 space-y-12">
            {[
              { time: '12:00 PM', title: 'Recepción', icon: <GlassWater size={18} /> },
              { time: '1:00 PM', title: 'Almuerzo', icon: <Utensils size={18} /> },
              { time: '2:30 PM', title: 'Juegos y Actividades', icon: <PartyPopper size={18} /> },
              { time: '4:00 PM', title: 'Pastel y Fotos', icon: <Camera size={18} /> },
            ].map((item, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-[17px] top-0 w-8 h-8 bg-white border-2 border-pink-300 rounded-full flex items-center justify-center text-pink-500 shadow-sm">
                  {item.icon}
                </div>
                <h4 className="font-serif text-xl text-pink-800 mb-1">{item.title}</h4>
                <p className="text-pink-600/80 font-light">{item.time}</p>
              </div>
            ))}
          </div>
        </FadeInUp>
      </section>

      {/* 6. Confirmación de Asistencia */}
      <section className="py-24 px-6 text-center relative overflow-hidden bg-pink-50">
        <div className="absolute bottom-0 left-0 w-full h-64 bg-pink-200 rounded-t-full opacity-40 blur-3xl translate-y-1/2"></div>
        
        <FadeInUp className="relative z-10">
          <h3 className="font-serif text-3xl text-pink-800 mb-4">Confirmación de asistencia</h3>
          <p className="text-pink-700/80 mb-10 max-w-xs mx-auto font-light leading-relaxed">
            Por favor, confírmanos tu asistencia antes del 1 de Junio para contemplarte.
          </p>
          
          <a 
            href="https://wa.me/1234567890?text=Hola,%20confirmo%20mi%20asistencia%20al%20baby%20shower%20de%20Madisson!"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block w-full max-w-xs mx-auto bg-[#25D366] text-white py-4 rounded-full shadow-lg shadow-green-200/50 font-medium text-lg transition-transform active:scale-95 hover:bg-[#20bd5a]"
          >
            Confirmar por WhatsApp
          </a>
        </FadeInUp>
      </section>
    </div>
  );
}
