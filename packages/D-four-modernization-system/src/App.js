import React, { useState } from 'react';
import './App.css';
import Home from './pages/Home';
import Detail from './pages/Detail';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleLearnMore = () => {
    setCurrentPage('detail');
  };

  const handleBack = () => {
    setCurrentPage('home');
  };

  return (
    <div className="App">
      {currentPage === 'home' ? (
        <Home onLearnMore={handleLearnMore} />
      ) : (
        <Detail name="提高社会化、法治化、智能化、专业化水平，构建富有活力和效率的新型基层社会治理体系" gallery="D馆" onBack={handleBack} />
      )}
    </div>
  );
}

export default App;