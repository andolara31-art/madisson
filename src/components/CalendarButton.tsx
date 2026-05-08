import React from 'react';
import { Calendar } from 'lucide-react';

interface EventData {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO format
  endTime: string;   // ISO format
}

const EVENT_INFO: EventData = {
  title: "Baby Shower de Madison",
  description: "Acompáñanos a celebrar la llegada de Madison. Será un momento muy especial lleno de amor, familia y alegría.",
  location: "Rancho Fernández, C. Varela, Provincia de Alajuela, San Ramón, 20207",
  startTime: "2026-06-13T12:00:00-06:00", // Costa Rica is UTC-6
  endTime: "2026-06-13T16:00:00-06:00",
};

export const CalendarButton: React.FC = () => {
  const formatDateToICS = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toISOString().replace(/-|:|\.\d+/g, '');
  };

  const generateICS = () => {
    const start = formatDateToICS(EVENT_INFO.startTime);
    const end = formatDateToICS(EVENT_INFO.endTime);
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Baby Shower//Madison//ES",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${EVENT_INFO.title}`,
      `DESCRIPTION:${EVENT_INFO.description}`,
      `LOCATION:${EVENT_INFO.location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\n");

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'BabyShowerMadison.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openGoogleCalendar = () => {
    const start = formatDateToICS(EVENT_INFO.startTime);
    const end = formatDateToICS(EVENT_INFO.endTime);
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(EVENT_INFO.title)}&details=${encodeURIComponent(EVENT_INFO.description)}&location=${encodeURIComponent(EVENT_INFO.location)}&dates=${start}/${end}`;
    window.open(url, '_blank');
  };

  const handleCalendarAction = () => {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Detect iOS
    if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
      generateICS();
    } 
    // Detect Android
    else if (/android/i.test(userAgent)) {
      openGoogleCalendar();
    } 
    // Fallback
    else {
      generateICS();
    }
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <button 
        onClick={handleCalendarAction}
        className="group flex items-center gap-3 px-12 py-5 bg-white border border-brand-muted text-brand-deep rounded-full text-[10px] uppercase tracking-[0.3em] font-black shadow-md shadow-brand-deep/5 hover:shadow-lg hover:shadow-brand-deep/10 hover:bg-brand-mint/60 transition-all active:scale-95 cursor-pointer"
      >
        <Calendar size={14} className="group-hover:scale-110 transition-transform" />
        Guardar en mi calendario
      </button>
      
      <button 
        onClick={generateICS}
        className="text-[9px] uppercase tracking-[0.2em] text-brand-deep/50 hover:text-brand-deep transition-colors underline underline-offset-4 font-bold max-w-[200px] leading-relaxed"
      >
        Si no se abrió tu calendario, toca aquí para descargar la invitación
      </button>
    </div>
  );
};
