import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Extrude from './components/Extrude';
import Home from './components/Home';
import Lights from './components/Lights';
import Simple from './components/Simple';

function App() {

    return (
        <Router>
            <Routes>
                <Route element={ <Home /> } path="/" />
                <Route element={ <Simple /> } path="/simple" />
                <Route element={ <Extrude /> } path="/extrude" />
                <Route element={ <Lights /> } path="/lights" />
            </Routes>
        </Router>
    );
}

export default App;
