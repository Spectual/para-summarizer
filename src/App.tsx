import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ChromeExtensionApp from "./ChromeExtensionApp";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChromeExtensionApp />
  </QueryClientProvider>
);

export default App;
