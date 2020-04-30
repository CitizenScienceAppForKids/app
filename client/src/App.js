import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Projects from './pages/Projects';
import Header from './components/Header'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' component={Projects} exact />
      </Switch>
    </BrowserRouter>
  );
}

export default App;