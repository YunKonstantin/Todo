import { TodoDashboard } from "./TodoDashboard";
import { AppContainer, MainContainer } from "../styles/AppStyles";
 export function AppContent() {
  return (
    <AppContainer>
      <MainContainer>
        <TodoDashboard />
      </MainContainer>
    </AppContainer>
  );
}
