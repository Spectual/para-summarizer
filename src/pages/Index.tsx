
import React, { useState, useEffect } from 'react';
import { ApiKeySetup } from '@/components/ApiKeySetup';
import { TextSummarizer } from '@/components/TextSummarizer';
import { SummaryHistory } from '@/components/SummaryHistory';
import { Settings, BookOpen, Sparkles } from 'lucide-react';

const Index = () => {
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'summarizer' | 'history' | 'settings'>('summarizer');
  const [summaries, setSummaries] = useState<Array<{id: string, text: string, summary: string, timestamp: Date}>>([]);

  useEffect(() => {
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem('parasummarizer_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load summaries from localStorage
    const savedSummaries = localStorage.getItem('parasummarizer_summaries');
    if (savedSummaries) {
      setSummaries(JSON.parse(savedSummaries).map((s: any) => ({
        ...s,
        timestamp: new Date(s.timestamp)
      })));
    }
  }, []);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    localStorage.setItem('parasummarizer_api_key', key);
  };

  const handleSummaryGenerated = (originalText: string, summary: string) => {
    const newSummary = {
      id: Date.now().toString(),
      text: originalText,
      summary: summary,
      timestamp: new Date()
    };
    const updatedSummaries = [newSummary, ...summaries];
    setSummaries(updatedSummaries);
    localStorage.setItem('parasummarizer_summaries', JSON.stringify(updatedSummaries));
  };

  const clearHistory = () => {
    setSummaries([]);
    localStorage.removeItem('parasummarizer_summaries');
  };

  if (!apiKey) {
    return <ApiKeySetup onSave={handleApiKeySave} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ParaSummarizer
            </h1>
          </div>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            AI-powered text summarization tool for quick content understanding
          </p>
        </header>

        {/* Navigation */}
        <nav className="flex justify-center mb-8">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-2 border border-slate-700">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('summarizer')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'summarizer' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Summarizer
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'history' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                History ({summaries.length})
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'settings' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'summarizer' && (
            <TextSummarizer 
              apiKey={apiKey} 
              onSummaryGenerated={handleSummaryGenerated}
            />
          )}
          {activeTab === 'history' && (
            <SummaryHistory 
              summaries={summaries}
              onClearHistory={clearHistory}
            />
          )}
          {activeTab === 'settings' && (
            <ApiKeySetup 
              onSave={handleApiKeySave} 
              initialValue={apiKey}
              isUpdate={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
