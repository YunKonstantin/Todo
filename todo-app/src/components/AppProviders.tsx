import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider } from "styled-components";
import { GlobalStyle } from "../styles/AppStyles";
import { useAppLogic } from "../hooks/useAppLogic";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  const { theme } = useAppLogic();

  return (
    <Provider store={store}>
      <ThemeProvider theme={{ mode: theme }}>
        <GlobalStyle $themeMode={theme} />
        {children}
      </ThemeProvider>
    </Provider>
  );
};
