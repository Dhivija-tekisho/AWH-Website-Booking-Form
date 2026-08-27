import React from 'react';
import ChatWidget from './ChatWidget';

function App() {
  const botId = import.meta.env.VITE_BOT_ID || 'cc544937-b11a-4970-8bdc-78b64d062b09';
  const apiUrl = import.meta.env.VITE_AI_ORCHESTRATION_URL || 'https://13-205-179-0.sslip.io';

  return (
    <div className="w-full min-h-[100dvh] bg-gray-100 relative flex flex-col items-center justify-center">
      <div className="p-8 text-center text-gray-500 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-700 mb-2">Local Development Environment</h1>
        <p>
          The <code>ChatWidget</code> is mounted as an independent component. 
          This guarantees that what you see here perfectly matches the widget bundle!
        </p>
      </div>
      <div id="awh-chat-widget-root"></div>
      <ChatWidget botId={botId} apiUrl={apiUrl} />
    </div>
  );
}

export default App;
