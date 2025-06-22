
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Trash2, Search, Calendar, CheckCircle, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Summary {
  id: string;
  text: string;
  summary: string;
  timestamp: Date;
}

interface SummaryHistoryProps {
  summaries: Summary[];
  onClearHistory: () => void;
}

export const SummaryHistory: React.FC<SummaryHistoryProps> = ({ 
  summaries, 
  onClearHistory 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const { toast } = useToast();

  const filteredSummaries = summaries.filter(summary =>
    summary.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    summary.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (summaries.length === 0) {
    return (
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="py-16">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No summaries yet</h3>
            <p className="text-slate-400">
              Start by generating your first summary in the Summarizer tab
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Clear */}
      <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-white">Summary History</CardTitle>
              <CardDescription className="text-slate-300">
                {summaries.length} summaries saved
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="Search summaries..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 w-64"
                />
              </div>
              <Button
                onClick={onClearHistory}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summaries List */}
      <div className="space-y-4">
        {filteredSummaries.length === 0 ? (
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
            <CardContent className="py-8">
              <div className="text-center">
                <Search className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No summaries match your search</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredSummaries.map((summary) => (
            <Card key={summary.id} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {formatDate(summary.timestamp)}
                  </div>

                  {/* Original Text */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Original Text:</h4>
                    <div className="bg-slate-700/30 rounded-lg p-3 border border-slate-600">
                      <p className="text-slate-200 text-sm leading-relaxed">
                        {truncateText(summary.text, 200)}
                      </p>
                    </div>
                  </div>

                  {/* Summary */}
                  <div>
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Summary:</h4>
                    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg p-3 border border-blue-800/30">
                      <p className="text-slate-100 text-sm leading-relaxed">
                        {summary.summary}
                      </p>
                    </div>
                  </div>

                  {/* Copy Button */}
                  <div className="flex justify-end">
                    <Button
                      onClick={() => copyToClipboard(summary.summary, summary.id)}
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      {copiedId === summary.id ? (
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
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
