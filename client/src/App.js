import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Projects from './pages/Projects';
import Header from './components/Header';
import TestObservationPage from './pages/TestObservationPage';
import './components/AsyncFileUpload.js';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Switch>
        <Route path='/' component={Projects} exact />
      </Switch>
      <Switch>
        <Route path='/test' component={TestObservationPage} exact />
      </Switch>

    </BrowserRouter>
  );
}

export default App;
