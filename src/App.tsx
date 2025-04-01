import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MusicPlayer from './components/Bases/MusicPlayer';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import DefaultLayout from './components/Layouts/DefaultLayout';

function App() {
  return (
    <MusicPlayerProvider>
      <Router basename="/Meowlody">
        <div className="relative min-h-screen bg-gray-900 text-white">
          <div className="h-[calc(100vh-96px)]">
            <DefaultLayout>
              <Routes>
                <Route path="/" element={<Home />} />
              </Routes>
            </DefaultLayout>
          </div>
          <div className="fixed bottom-0 left-0 right-0 z-50">
            <MusicPlayer />
          </div>
        </div>
      </Router>
    </MusicPlayerProvider>
  );
}

export default App;
