import { type ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import { ThemeProvider, useTheme } from "../hooks/useTheme";
import { GlobalStyle } from "../styles/AppStyles";

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {" "}
        <GlobalStyleWithTheme />
        {children}
      </ThemeProvider>
    </Provider>
  );
};

const GlobalStyleWithTheme = () => {
  const { theme } = useTheme();
  return <GlobalStyle $themeMode={theme} />;
};
