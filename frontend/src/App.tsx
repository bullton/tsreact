import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, Mcc } from './page';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} /><Route />
          <Route path="/mcc" element={<Mcc />} /><Route />
        </Routes>
      </BrowserRouter>

    </div>
  );
};

export default App;