import { TodoDashboard } from "./components/TodoDashboard";
import { AppProviders } from "./components/AppProviders";
import { AppContainer, MainContainer } from "./styles/AppStyles";

function AppContent() {
  return (
    <AppContainer>
      <MainContainer>
        <TodoDashboard />
      </MainContainer>
    </AppContainer>
  );
}

export default function App() {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
}
