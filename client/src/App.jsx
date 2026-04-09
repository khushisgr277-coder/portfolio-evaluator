import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Report from './pages/Report';

// Chart.js registration
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function App() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-950">
      {/* Background decoration elements for premium feel */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report/:username" element={<Report />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
