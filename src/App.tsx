import { useRoutes } from "react-router-dom";

import router from "./router";

function App() {
  const element = useRoutes(router);

  return <div className="app">{element}</div>;
}

export default App;
