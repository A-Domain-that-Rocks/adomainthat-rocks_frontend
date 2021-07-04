import React, { Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap';
import SearchForm from './components/SearchForm';
import Header from './components/Header';

function App() {
    const onSearchHandler = () => {
        // Implement the logic for search
    };
    return (
        <div className="App">
            <Fragment>
                <Header/>
                <Container>
                    <Row>
                        <Col xs={12} md={4}>
                            <SearchForm onSearchHandler={onSearchHandler}/>
                        </Col>
                        <Col xs={12} md={8}>col 2 of row 1</Col>
                    </Row>
                </Container>
            </Fragment>
        </div>
    );
};

export default App;
