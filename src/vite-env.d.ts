/// <reference types="vite/client" />

// Chrome Extension API types
declare global {
  interface Window {
    chrome: {
      storage: {
        sync: {
          get: (keys: string[], callback: (result: any) => void) => void;
          set: (items: any, callback?: () => void) => void;
          remove: (keys: string[], callback?: () => void) => void;
        };
        local: {
          get: (keys: string[], callback: (result: any) => void) => void;
          set: (items: any, callback?: () => void) => void;
          remove: (keys: string[], callback?: () => void) => void;
        };
        onChanged: {
          addListener: (callback: (changes: any) => void) => void;
          removeListener: (callback: (changes: any) => void) => void;
        };
      };
      runtime: {
        sendMessage: (message: any, callback?: (response: any) => void) => void;
        onMessage: {
          addListener: (callback: (request: any, sender: any, sendResponse: any) => void) => void;
        };
      };
    };
  }
  
  const chrome: Window['chrome'];
}
