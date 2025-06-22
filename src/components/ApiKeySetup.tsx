import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Key, Lock, AlertCircle, Info } from 'lucide-react';

interface ApiKeySetupProps {
  onSave: (apiKey: string) => void;
  initialValue?: string;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onSave, 
  initialValue = '', 
}) => {
  const [apiKey, setApiKey] = useState(initialValue);
  const [isVisible, setIsVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey.trim()) {
      onSave(apiKey.trim());
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6 p-2">
      <div className="text-center">
        <Key className="w-10 h-10 text-blue-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-100">
          OpenAI API Key
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          {initialValue ? 'Update your API key or enter a new one.' : 'An API key is required to use ParaSummarizer.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="apiKey" className="text-sm font-medium text-slate-300">
            Your API Key
          </label>
          <div className="relative">
            <Input
              id="apiKey"
              type={isVisible ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 pr-10 text-sm p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setIsVisible(!isVisible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              aria-label="Toggle API key visibility"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50"
          disabled={!apiKey.trim() || apiKey === initialValue}
        >
          {initialValue ? 'Update Key' : 'Save & Start'}
        </Button>
      </form>

      <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-slate-400 space-y-1">
            <p>Your API key is stored securely in your browser's local storage and is only used to communicate with the OpenAI API.</p>
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline"
            >
              Get your API key from the OpenAI Platform
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
