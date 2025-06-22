import React, { useState, useEffect } from 'react';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { TextSummarizer } from '@/components/TextSummarizer';
import { Settings, X } from 'lucide-react';
import { Toaster as Sonner } from "@/components/ui/sonner"

const ChromeExtensionApp = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    chrome.storage.sync.get(['parasummarizer_api_key'], (result) => {
      const savedApiKey = result.parasummarizer_api_key;
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setShowSettings(true); // Force settings view if no API key
      }
      setIsLoading(false);
    });
  }, []);
  
  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    chrome.storage.sync.set({ parasummarizer_api_key: key }, () => {
      setShowSettings(false); // Hide settings after saving
    });
  };

  if (isLoading) {
    return (
      <div className="w-96 h-[480px] bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="w-96 h-[480px] bg-slate-900 text-white font-sans flex flex-col antialiased">
      <header className="flex items-center justify-between p-3 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <img src="/icons/icon48.png" alt="ParaSummarizer Logo" className="w-7 h-7" />
          <h1 className="text-lg font-bold text-slate-100">ParaSummarizer</h1>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          aria-label={showSettings ? "Close Settings" : "Open Settings"}
        >
          {showSettings ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {showSettings || !apiKey ? (
          <ApiKeySetup 
            onSave={handleApiKeySave} 
            initialValue={apiKey}
          />
        ) : (
          <TextSummarizer apiKey={apiKey} />
        )}
      </main>

      <footer className="text-center p-2 border-t border-slate-700/50">
        <p className="text-xs text-slate-500">
          Powered by AI
        </p>
      </footer>
      <Sonner position="top-center" richColors />
    </div>
  );
};

export default ChromeExtensionApp; 