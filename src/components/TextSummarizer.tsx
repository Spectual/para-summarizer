
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Sparkles, Loader2, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TextSummarizerProps {
  apiKey: string;
  onSummaryGenerated: (originalText: string, summary: string) => void;
}

export const TextSummarizer: React.FC<TextSummarizerProps> = ({ 
  apiKey, 
  onSummaryGenerated 
}) => {
  const [inputText, setInputText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const generateSummary = async () => {
    if (!inputText.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter some text to summarize",
        variant: "destructive",
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
              content: 'You are a professional text summarizer. Create concise, accurate summaries that capture the key points and main ideas of the given text. Keep the summary clear and well-structured.'
            },
            {
              role: 'user',
              content: `Please summarize the following text:\n\n${inputText}`
            }
          ],
          max_tokens: 500,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const generatedSummary = data.choices[0].message.content;
      
      setSummary(generatedSummary);
      onSummaryGenerated(inputText, generatedSummary);
      
      toast({
        title: "Summary generated!",
        description: "Your text has been successfully summarized",
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Error generating summary",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      toast({
        title: "Copied to clipboard!",
        description: "Summary has been copied to your clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Unable to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="w-5 h-5" />
            Input Text
          </CardTitle>
          <CardDescription className="text-slate-300">
            Paste or type the text you want to summarize
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter the text you want to summarize here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-32 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 resize-none"
            maxLength={4000}
          />
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">
              {inputText.length}/4000 characters
            </span>
            <Button
              onClick={generateSummary}
              disabled={isLoading || !inputText.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Summary
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      {(summary || isLoading) && (
        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Sparkles className="w-5 h-5" />
              Summary
            </CardTitle>
            <CardDescription className="text-slate-300">
              AI-generated summary of your text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
                  <p className="text-slate-300">Generating your summary...</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600">
                  <p className="text-slate-100 leading-relaxed whitespace-pre-wrap">
                    {summary}
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    {isCopied ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Summary
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
