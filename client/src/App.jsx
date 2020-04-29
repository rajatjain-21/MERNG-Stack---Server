import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Container } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Menubar from "./components/Menubar";
import { AuthProvider } from "./context/auth";
import AuthRoute from "./utils/AuthRoute";

function App() {
  return (
    <AuthProvider>
      <Container>
        <Router>
          <Menubar />
          <Route exact path="/" component={Home} />
          <AuthRoute path="/login" component={Login} />
          <AuthRoute path="/register" component={Register} />
        </Router>
      </Container>
    </AuthProvider>
  );
}

export default App;
