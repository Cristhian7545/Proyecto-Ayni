import OfflineStatus from './components/OfflineStatus.jsx';
import PwaUpdate from './components/PwaUpdate.jsx';
import { FeedbackProvider } from './controllers/FeedbackContext.jsx';
import { SessionProvider } from './controllers/SessionContext.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

export default function App() {
  return (
    <SessionProvider>
      <FeedbackProvider>
        <Header />
        <OfflineStatus />
        <PwaUpdate />
        <AppRoutes />
        <Footer />
      </FeedbackProvider>
    </SessionProvider>
  );
}
