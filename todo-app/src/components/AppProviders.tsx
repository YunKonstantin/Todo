import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider, useTheme } from "../hooks/useTheme";
import { GlobalStyle } from "../styles/AppStyles";
import { BrowserRouter as Router } from "react-router-dom";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Router basename="/Todo">
          {" "}
          <GlobalStyleWithTheme />
          {children}
        </Router>
      </ThemeProvider>
    </Provider>
  );
};

const GlobalStyleWithTheme = () => {
  const { theme } = useTheme();
  return <GlobalStyle $themeMode={theme} />;
};
