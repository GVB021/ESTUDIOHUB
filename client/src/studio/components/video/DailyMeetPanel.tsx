import { useState } from "react";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Settings } from "lucide-react";

interface DailyMeetPanelProps {
  sessionId: string;
}

export function DailyMeetPanel({ sessionId }: DailyMeetPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  // This is a placeholder for the real Daily.co integration
  // In a real scenario, this would load the Daily iframe or use their hooks
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-5 h-12 w-12 rounded-full flex items-center justify-center shadow-lg z-[90] bg-primary text-primary-foreground hover:scale-110 transition-all"
        title="Entrar na chamada de vídeo"
      >
        <Video className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 w-72 h-96 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-[100] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
      <div className="p-3 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 backdrop-blur">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Chamada de Vídeo</span>
        <button onClick={() => setIsVisible(false)} className="text-zinc-500 hover:text-white transition-colors">
          <PhoneOff className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 bg-black flex items-center justify-center relative group">
        <div className="text-zinc-700 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
            <VideoOff className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase font-bold tracking-tighter">Aguardando conexão...</span>
        </div>

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isMuted ? "bg-red-500 text-white" : "bg-zinc-800/80 text-white hover:bg-zinc-700"
            }`}
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
              isVideoOff ? "bg-red-500 text-white" : "bg-zinc-800/80 text-white hover:bg-zinc-700"
            }`}
          >
            {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
          </button>
          <button className="w-8 h-8 rounded-lg bg-zinc-800/80 text-white hover:bg-zinc-700 flex items-center justify-center transition-all">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-3 grid grid-cols-2 gap-2">
        <div className="aspect-video bg-zinc-800 rounded-lg border border-zinc-700/50 flex items-center justify-center">
          <span className="text-[8px] text-zinc-500 font-bold uppercase">Você</span>
        </div>
        <div className="aspect-video bg-zinc-800 rounded-lg border border-zinc-700/50 flex items-center justify-center">
          <span className="text-[8px] text-zinc-500 font-bold uppercase">Diretor</span>
        </div>
      </div>
    </div>
  );
}
