import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Sparkles, Loader2, CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

interface TextSummarizerProps {
  apiKey: string;
}

export const TextSummarizer: React.FC<TextSummarizerProps> = ({ apiKey }) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    console.log('[ParaSummarizer] Popup opened. Checking for selected text...');
    chrome.storage.local.get('parasummarizer_selected_text', (result) => {
      if (chrome.runtime.lastError) {
        console.error('[ParaSummarizer] Error fetching text:', chrome.runtime.lastError.message);
        return;
      }
      
      const selectedText = result.parasummarizer_selected_text;
      if (selectedText && typeof selectedText === 'string') {
        console.log(`[ParaSummarizer] Found text in storage (Length: ${selectedText.length}). Applying to input.`);
        setInputText(selectedText);
      } else {
        console.log('[ParaSummarizer] No text found in storage.');
      }
    });
  }, []);

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast.error("No text provided", {
        description: "Please enter or select some text to summarize.",
      });
      return;
    }

    setIsLoading(true);
    setSummary('');

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are a professional text summarizer. Create a concise, accurate summary that captures the key points and main ideas of the given text.'
            },
            {
              role: 'user',
              content: `Please summarize the following text:\n\n${inputText}`
            }
          ],
          max_tokens: 250,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedSummary = data.choices[0].message.content;
      
      setSummary(generatedSummary);

      // Clear the used text from storage now that summary is successful
      chrome.storage.local.remove('parasummarizer_selected_text', () => {
        console.log('[ParaSummarizer] Cleared used text from storage.');
      });
      
      toast.success("Summary generated!", {
        description: "Your text has been successfully summarized.",
      });
    } catch (error) {
      toast.error("Error generating summary", {
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy", {
        description: "Could not copy summary to clipboard.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex-1 flex flex-col space-y-2">
        <label htmlFor="input-text" className="text-sm font-medium text-slate-300">
          Input Text
        </label>
        <Textarea
          id="input-text"
          placeholder="Text to summarize will appear here when you select it on a page, or you can paste it directly."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 resize-none bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          maxLength={4000}
        />
        <p className="text-xs text-slate-500 text-right pr-1">
          {inputText.length} / 4000
        </p>
      </div>

      <Button
        onClick={generateSummary}
        disabled={isLoading || !inputText.trim()}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generating...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Generate Summary</span>
          </>
        )}
      </Button>

      {summary && !isLoading && (
        <div className="flex-1 flex flex-col space-y-2 pt-2">
          <label className="text-sm font-medium text-slate-300">Summary</label>
          <div className="relative flex-1">
            <Textarea
              readOnly
              value={summary}
              className="w-full h-full resize-none bg-slate-800 border-slate-700 text-slate-100 text-sm p-3 rounded-lg"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-1.5 rounded-md bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              aria-label="Copy summary"
            >
              {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {!inputText && !summary && !isLoading && (
         <div className="text-center text-slate-500 p-4 border-2 border-dashed border-slate-700 rounded-lg">
           <Info className="w-6 h-6 mx-auto mb-2" />
           <p className="text-sm">Activate the extension by clicking the floating icon on any webpage, then select text to begin.</p>
         </div>
      )}
    </div>
  );
};
