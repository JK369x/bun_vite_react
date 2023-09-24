import RouteAllPage from "./route/route";
import { useThemeContext } from "./theme/ThemeContextProvider";
import { CssBaseline, ThemeProvider } from "@mui/material";

function App() {
  const { theme } = useThemeContext();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouteAllPage />
    </ThemeProvider>
  );
}

export default App;
