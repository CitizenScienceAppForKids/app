import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Observations from './pages/Observations';
import Observation from './pages/Observation';
import NewOb from './pages/NewOb';


function App() {
  return (
    <div>
      <BrowserRouter>
          <NavBar />
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/projects' component={Projects} exact />
              <Route path='/project' component={Project} exact />
              <Route path='/observations' component={Observations} exact />
              <Route path='/observation' component={Observation} exact />
              <Route path='/newobservation' component={NewOb} exact />
            </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
