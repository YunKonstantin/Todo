import { AppProviders } from "./components/AppProviders";
import { TodoDashboard } from "./components/TodoDashboard";
import { AppContainer, MainContainer } from "./styles/AppStyles";
export function AppContent() {
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
