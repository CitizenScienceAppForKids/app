import React, {Component} from 'react'
import Pcards from '../components/Pcards'

class Projects extends Component {

    state = {
        projects:[]
    }

    componentDidMount() {
        fetch('http://localhost:5000/api/projects')
        .then(res => res.json())
        .then((data) => {
          this.setState({ projects: data })
        })
        .catch(console.log)
    }

    render () {
        return (
            <Pcards projects = {this.state.projects} />
        );
    }
}

export default Projects;