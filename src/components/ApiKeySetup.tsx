
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Key, Lock, AlertCircle } from 'lucide-react';

interface ApiKeySetupProps {
  onSave: (apiKey: string) => void;
  initialValue?: string;
  isUpdate?: boolean;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  onSave, 
  initialValue = '', 
  isUpdate = false 
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <Key className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            {isUpdate ? 'Update API Key' : 'Setup Required'}
          </CardTitle>
          <CardDescription className="text-slate-300">
            {isUpdate 
              ? 'Update your OpenAI API key to continue using ParaSummarizer'
              : 'Enter your OpenAI API key to start using ParaSummarizer'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium text-slate-200">
                OpenAI API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={isVisible ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsVisible(!isVisible)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Lock className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-2.5"
              disabled={!apiKey.trim()}
            >
              {isUpdate ? 'Update API Key' : 'Save & Continue'}
            </Button>
          </form>

          <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-300">
                <p className="font-medium mb-1">Your API key is secure</p>
                <p>
                  Your API key is stored locally in your browser and never shared with our servers. 
                  Get your API key from{' '}
                  <a 
                    href="https://platform.openai.com/api-keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
