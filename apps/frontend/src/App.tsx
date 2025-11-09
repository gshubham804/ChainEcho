import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TraceResult from './pages/TraceResult';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/trace/:signature" element={<TraceResult />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

