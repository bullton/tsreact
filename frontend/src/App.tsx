import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, Mcc, Hangzhou2hand, Shenzhen2hand, Hangzhou2handTotal } from './page';

const App: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} /><Route />
          <Route path="/house/hz2s" element={<Hangzhou2hand />} /><Route />
          <Route path="/house/sz2s" element={<Shenzhen2hand />} /><Route />
          <Route path="/house/hz2szs" element={<Hangzhou2handTotal />} /><Route />
          <Route path="/bank/mcc" element={<Mcc />} /><Route />
        </Routes>
      </BrowserRouter>

    </div>
  );
};

export default App;