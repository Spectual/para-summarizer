import React from 'react';
import { TextSummarizer } from '@/components/TextSummarizer';
import { Toaster as SonnerToaster } from 'sonner';

const ChromeExtensionApp = () => {
  return (
    <div className="w-96 h-[480px] bg-slate-900 text-white font-sans flex flex-col antialiased">
      <TextSummarizer />
      <SonnerToaster position="top-center" richColors />
    </div>
  );
};

export default ChromeExtensionApp;