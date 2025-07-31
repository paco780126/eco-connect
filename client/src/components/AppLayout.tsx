import React from 'react';
import * as ReactRouterDom from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
// import JisuAiChatbot from './JisuAiChatbot';

const AppLayout: React.FC = () => {
  return (
    <div id="app-container">
      <Header />
      <main>
        <ReactRouterDom.Outlet />
      </main>
      <Footer />
      {/* <JisuAiChatbot /> */}
    </div>
  );
};

export default AppLayout;