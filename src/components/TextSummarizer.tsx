import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toaster as SonnerToaster, toast as sonnerToast } from "sonner";
import { Settings, Copy, Sparkles, Loader2, CheckCircle, Info, X } from "lucide-react";
import { ApiKeySetup } from "./ApiKeySetup";

export function TextSummarizer() {
  const [apiKey, setApiKey] = useState<string>('');
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [showApiSetup, setShowApiSetup] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Check for API Key
    chrome.storage.sync.get(['parasummarizer_api_key'], (result) => {
      const savedApiKey = result.parasummarizer_api_key;
      if (savedApiKey) {
        setApiKey(savedApiKey);
      } else {
        setShowApiSetup(true);
      }
      setIsLoading(false);
    });

    // Get selected text
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab && activeTab.id) {
        chrome.scripting.executeScript(
          {
            target: { tabId: activeTab.id },
            func: () => window.getSelection()?.toString(),
          },
          (injectionResults) => {
            if (chrome.runtime.lastError) {
              console.error("Scripting error:", chrome.runtime.lastError.message);
              return;
            }
            if (injectionResults && injectionResults[0] && injectionResults[0].result) {
              setText(injectionResults[0].result);
            }
          }
        );
      }
    });
  }, []);

  const handleSummarize = () => {
    if (!text) {
       sonnerToast.error("No text provided to summarize.");
      return;
    }
    setIsSummarizing(true);
    setSummary("");
    chrome.runtime.sendMessage(
      { type: "summarize", text, apiKey },
      (response) => {
        setIsSummarizing(false);
        if (response.error) {
          sonnerToast.error("Summarization failed: " + response.error);
        } else {
          setSummary(response.summary);
          sonnerToast.success("Summary generated successfully!");
        }
      }
    );
  };
  
  const copyToClipboard = async () => {
    if (!summary) return;
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      sonnerToast.success("Copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      sonnerToast.error("Failed to copy to clipboard.");
    }
  };

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    chrome.storage.sync.set({ parasummarizer_api_key: key }, () => {
      setShowApiSetup(false);
      sonnerToast.success("API Key saved!");
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between p-3 border-b border-slate-700/50 flex-shrink-0">
        <div className="flex items-center gap-2">
          <img src="/icons/icon48.png" alt="ParaSummarizer Logo" className="w-7 h-7" />
          <h1 className="text-lg font-bold text-slate-100">ParaSummarizer</h1>
        </div>
        <button
          onClick={() => setShowApiSetup(!showApiSetup)}
          className="p-2 rounded-md text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
          aria-label={showApiSetup ? "Close Settings" : "Open Settings"}
        >
          {showApiSetup ? <X className="w-5 h-5" /> : <Settings className="w-5 h-5" />}
        </button>
      </header>

      <main className="flex-1 p-4 overflow-y-auto">
        {showApiSetup || !apiKey ? (
            <ApiKeySetup onSave={handleApiKeySave} initialValue={apiKey} />
        ) : (
          <div className="flex flex-col h-full gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="input-text" className="text-sm font-medium text-slate-400">
                Original Text
              </label>
              <Textarea
                id="input-text"
                placeholder="Select text on a page, or paste it here."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 resize-none bg-slate-800 border-slate-700 text-slate-100 placeholder:text-slate-500 text-sm p-3 rounded-lg"
                maxLength={4000}
              />
               <p className="text-xs text-slate-500 text-right pr-1">
                {text.length} / 4000
              </p>
            </div>
             <Button
              onClick={handleSummarize}
              disabled={isSummarizing || !text.trim()}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2"
            >
              {isSummarizing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
              <span>{isSummarizing ? "Summarizing..." : "Summarize"}</span>
            </Button>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-center">
                <label htmlFor="summary-text" className="text-sm font-medium text-slate-400">
                  Summary
                </label>
                {summary && (
                  <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                    {isCopied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                )}
              </div>
              <div className="relative flex-1">
                <Textarea
                  id="summary-text"
                  placeholder="Your summary will appear here..."
                  value={summary}
                  readOnly
                  className="w-full h-full resize-none bg-slate-800 border-slate-700 text-slate-100"
                />
                 {isSummarizing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 rounded-lg">
                    <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="text-center p-2 border-t border-slate-700/50 flex-shrink-0">
        <p className="text-xs text-slate-500">
          Powered by AI
        </p>
      </footer>
    </>
  );
}
