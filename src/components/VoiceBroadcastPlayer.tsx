import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Mic, Radio, Play, Square, Sparkles } from 'lucide-react';
import { Dialect, DIALECT_ANNOUNCEMENTS, speakFloodAlert, stopFloodVoice } from '../utils/voiceAlert';

interface VoiceBroadcastPlayerProps {
  language: 'en' | 'hi';
}

export const VoiceBroadcastPlayer: React.FC<VoiceBroadcastPlayerProps> = ({ language }) => {
  const [selectedDialect, setSelectedDialect] = useState<Dialect>('hi');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const isHi = language === 'hi';

  useEffect(() => {
    return () => {
      stopFloodVoice();
    };
  }, []);

  const handlePlay = (dialect: Dialect) => {
    if (isPlaying && selectedDialect === dialect) {
      stopFloodVoice();
      setIsPlaying(false);
      return;
    }

    setSelectedDialect(dialect);
    setIsPlaying(true);

    const started = speakFloodAlert(
      dialect,
      undefined,
      () => setIsPlaying(true),
      () => setIsPlaying(false)
    );

    if (!started) {
      setIsPlaying(false);
    }
  };

  const currentSnippet = DIALECT_ANNOUNCEMENTS[selectedDialect];

  return (
    <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-800/80 rounded-xl p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-600 text-white rounded-lg shadow animate-pulse">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {isHi ? 'आवाज में बाढ़ चेतावनी (क्षेत्रीय बोलियां)' : 'Emergency Audio Announcements (Regional Dialects)'}
              </h3>
              <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-800">
                LOUDSPEAKER DESK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isHi 
                ? 'ग्रामीण व दियारा निवासियों हेतु 1-क्लिक आवाज प्रसारण (हिन्दी, भोजपुरी, मैथिली)' 
                : '1-click voice loudspeaker warnings for rural communities in local dialects'}
            </p>
          </div>
        </div>

        {/* Dialect selector buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['hi', 'bhojpuri', 'maithili', 'en'] as Dialect[]).map(d => {
            const isSelected = selectedDialect === d;
            const snippet = DIALECT_ANNOUNCEMENTS[d];
            return (
              <button
                key={d}
                type="button"
                onClick={() => handlePlay(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected && isPlaying
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950 animate-pulse'
                    : isSelected
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {isSelected && isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <Play className="w-3 h-3" />}
                <span>{snippet.dialectName.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Playing state visualizer & transcript */}
      <div className="mt-3.5 pt-1">
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 shrink-0 mt-0.5">
              <Mic className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-300 uppercase tracking-wide">
                  {currentSnippet.title}
                </span>
                {isPlaying && (
                  <span className="flex items-center gap-1 text-[11px] text-red-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    {isHi ? 'ऑडियो चल रहा है...' : 'Broadcasting Voice...'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed italic">
                "{currentSnippet.announcementText}"
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            {isPlaying ? (
              <button
                type="button"
                onClick={stopFloodVoice}
                className="flex items-center gap-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>{isHi ? 'रोकें (Stop)' : 'Stop Audio'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handlePlay(selectedDialect)}
                className="flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors shadow"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>{isHi ? 'उद्घोषणा सुनें' : 'Play Announcement'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
