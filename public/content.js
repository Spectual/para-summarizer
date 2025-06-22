// Content script for ParaSummarizer Chrome extension

let isExtensionActive = false;
let selectedText = '';

// Create floating button
function createFloatingButton() {
  const button = document.createElement('div');
  button.id = 'para-summarizer-button';
  button.innerHTML = `
    <div class="para-summarizer-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    </div>
  `;
  button.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    cursor: pointer;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    opacity: 0;
    transform: scale(0.8);
  `;
  
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
  });
  
  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });
  
  button.addEventListener('click', toggleExtension);
  
  document.body.appendChild(button);
  
  // Show button after a short delay
  setTimeout(() => {
    button.style.opacity = '1';
    button.style.transform = 'scale(1)';
  }, 1000);
}

// Toggle extension
function toggleExtension() {
  if (isExtensionActive) {
    deactivateExtension();
  } else {
    activateExtension();
  }
}

// Activate extension
function activateExtension() {
  isExtensionActive = true;
  document.addEventListener('mouseup', handleTextSelection);
  document.addEventListener('keyup', handleTextSelection);
  
  // Change button appearance
  const button = document.getElementById('para-summarizer-button');
  if (button) {
    button.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    button.querySelector('.para-summarizer-icon').innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 12l2 2 4-4"/>
        <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"/>
        <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"/>
      </svg>
    `;
  }
  
  // Show activation message
  showNotification('ParaSummarizer activated! Select text to save for summarization.', 'success');
}

// Deactivate extension
function deactivateExtension() {
  isExtensionActive = false;
  document.removeEventListener('mouseup', handleTextSelection);
  document.removeEventListener('keyup', handleTextSelection);
  
  // Change button appearance back
  const button = document.getElementById('para-summarizer-button');
  if (button) {
    button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    button.querySelector('.para-summarizer-icon').innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    `;
  }
  
  showNotification('ParaSummarizer deactivated.', 'info');
}

// Handle text selection
function handleTextSelection() {
  const selection = window.getSelection();
  const text = selection.toString().trim();
  
  if (text.length > 10) {
    selectedText = text;
    const dataToStore = { 
      'parasummarizer_selected_text': text,
    };

    // Save selected text to storage for the popup to access
    chrome.storage.local.set(dataToStore, () => {
      if (chrome.runtime.lastError) {
        console.error('[ParaSummarizer] Error saving text to storage:', chrome.runtime.lastError);
      } else {
        console.log(`[ParaSummarizer] Text successfully saved to storage. Length: ${text.length}`);
      }
    });
    showNotification(`Text selected (${text.length} characters). Click extension icon to summarize.`, 'success');
  }
}

// Show notification
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existingNotification = document.getElementById('para-summarizer-notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.id = 'para-summarizer-notification';
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
    color: white;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    z-index: 10002;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
    word-wrap: break-word;
    animation: slideIn 0.3s ease;
  `;

  // Add animation keyframes
  if (!document.getElementById('para-summarizer-styles')) {
    const style = document.createElement('style');
    style.id = 'para-summarizer-styles';
    style.textContent = `
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 3000);
}

// Initialize extension
function init() {
  createFloatingButton();
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
} 