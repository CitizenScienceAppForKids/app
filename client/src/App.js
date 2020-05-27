import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Project from './pages/Project';
import Observations from './pages/Observations';
import Observation from './pages/Observation';
import NewOb from './pages/NewOb';
import Logo from './components/Logo/Logo';
import Particles from 'react-particles-js';
import './App.css';
import history from './components/history';
import "react-responsive-carousel/lib/styles/carousel.min.css";


const particlesOptions = {
    particles: {
        number: {
            value: 30,
            density: {
                enable: true,
                value_area: 800
            }
        }
    },
    interactivity: {
        events: {
            "onhover": {
                "enable": true,
                "mode": "repulse"
            }
        }
    }
}

function App() {
  return (
    <div>
        <Particles className='particles'
            params={particlesOptions}
        />
        <Router history={history}>
          <NavBar />
            <Switch>
              <Route path='/' component={Home} exact />
              <Route path='/projects' component={Projects} exact />
              <Route path='/project' component={Project} exact />
              <Route path='/observations' component={Observations} exact />
              <Route path='/observation' component={Observation} exact />
              <Route path='/newobservation' component={NewOb} exact />
            </Switch>
        </Router>
    </div>

  );
}

export default App;
