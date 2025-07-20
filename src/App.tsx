import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { MusicPlayerProvider } from './contexts/MusicPlayerContext';
import { MainLayout } from './components/layout/MainLayout';
import { MusicPlayer } from './components/music/Player/MusicPlayer';
import { Home, Search, Library } from './pages';
import { AnimatePresence } from 'framer-motion';
import { AnimatedPage } from './components/AnimatedPage';
import { VideoBackground } from './components/VideoBackground';
import { CompanionCharacter } from './components/CompanionCharacter';
import { Footer } from './components/layout/Footer/Footer';
import { ChatWidget } from 'infall-chatbot-widget';
// import 'infall-chatbot-widget/style.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AnimatedPage>
              <Home />
            </AnimatedPage>
          }
        />
        <Route
          path="/search"
          element={
            <AnimatedPage>
              <Search />
            </AnimatedPage>
          }
        />
        <Route
          path="/library"
          element={
            <AnimatedPage>
              <Library />
            </AnimatedPage>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <MusicPlayerProvider>
      <Router basename="/Meowlody">
        <div className="relative min-h-screen text-white flex flex-col">
          <ChatWidget title="Support Chat" primaryColor="blue" position="bottom-right" />
          <VideoBackground videoSource="./assets/sky.mp4" />
          <div className="flex-1 flex justify-center">
            <MainLayout>
              <AnimatedRoutes />
            </MainLayout>
          </div>
          <div className="h-24">
            {' '}
            {/* Fixed height for music player space */}
            <MusicPlayer />
          </div>
          <Footer />
          {/* <CompanionCharacter /> */}
        </div>
      </Router>
    </MusicPlayerProvider>
  );
}

export default App;
