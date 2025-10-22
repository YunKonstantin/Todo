import { AppProviders } from "./components/AppProviders";
import { AppContent } from "./components/AppContent";

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
