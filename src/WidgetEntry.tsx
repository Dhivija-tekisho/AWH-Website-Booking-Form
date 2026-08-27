import { createRoot } from 'react-dom/client';
import ChatWidget from './ChatWidget';
import './widget.css';

interface WidgetOptions {
  botId: string;
  apiUrl?: string;
  containerId?: string;
}

const init = (options: Partial<WidgetOptions> = {}) => {
  let container: HTMLElement | null = null;

  if (options.containerId) {
    container = document.getElementById(options.containerId);
  }

  if (!container) {
    container = document.createElement('div');
    container.id = 'awh-chat-widget-root';
    document.body.appendChild(container);
  }

  let botId = options.botId;
  let apiUrl = options.apiUrl;

  if (!botId) {
    const scriptTag = document.currentScript || document.querySelector('script[src*="widget.js"]');
    if (scriptTag) {
      botId = scriptTag.getAttribute('data-bot-id') || undefined;
      apiUrl = scriptTag.getAttribute('data-api-url') || undefined;
    }
  }

  if (!botId) {
    console.error('AWH Chat Widget: No botId provided. Please provide a botId in init() or as data-bot-id on the script tag.');
    return;
  }

  const root = createRoot(container);
  root.render(<ChatWidget botId={botId} apiUrl={apiUrl} />);
};

// Expose globally
(window as any).AWHChatWidget = { init };

// Auto-init if the script tag has data-bot-id
if (document.currentScript && document.currentScript.getAttribute('data-bot-id')) {
  init();
}
