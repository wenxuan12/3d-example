import { HashRouter, Routes, Route } from 'react-router-dom';
import Extrude from './components/Extrude';
import Home from './components/Home';
import Horse from './components/Horse';
import Lights from './components/Lights';
import Simple from './components/Simple';
import Texts from './components/Texts';

function App() {

    return (
        <HashRouter>
            <Routes>
                <Route element={ <Home /> } path="/" />
                <Route element={ <Simple /> } path="/simple" />
                <Route element={ <Extrude /> } path="/extrude" />
                <Route element={ <Lights /> } path="/lights" />
                <Route element={ <Texts /> } path="/texts" />
                <Route element={ <Horse /> } path="/horse" />
            </Routes>
        </HashRouter>
    );
}

export default App;
