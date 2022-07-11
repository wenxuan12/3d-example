import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Simple from './components/Simple';

function App() {

    return (
        <Router>
            <Routes>
                <Route element={ <Home /> } path="/" />
                <Route element={ <Simple /> } path="/simple" />
            </Routes>
        </Router>
    );
}

export default App;
