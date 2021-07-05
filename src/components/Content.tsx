import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SearchForm from './SearchForm';

const Content = () => {
    const onSearchHandler = () => {
        // Implement the logic for search
    };
    return (
        <Container>
            <Row>
                <Col xs={12} md={4}>
                    <SearchForm onSearchHandler={onSearchHandler}/>
                </Col>
                <Col xs={12} md={8}>col 2 of row 1</Col>
            </Row>
        </Container>
    );
};

export default Content;
