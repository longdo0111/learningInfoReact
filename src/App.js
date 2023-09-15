import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import HeaderComponent from './components/HeaderComponent';
import FooterComponent from './components/FooterComponent';
import Homepage from './components/Homepage';
import WFDComponent from './components/practice/WFDComponent';

function App() {
  return (
    <div>
      <Router>
        <HeaderComponent />
        <div className="container">
            <Routes>Homepage
              <Route path="/" Component={Homepage}></Route>
              <Route path="/wfd" Component={WFDComponent}></Route>
            </Routes>
        </div>
        <FooterComponent />
      </Router>
    </div>
  );
}

export default App;
