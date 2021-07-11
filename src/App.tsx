import React, { Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';

function App() {
    return (
        <div className="App">
            <Fragment>
                <Header/>
                <Content/>
                <Footer/>
            </Fragment>
        </div>
    );
};

export default App;
