import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SearchForm from './SearchForm';
import SearchFormAuthorGraph from './SearchFormAuthorGraph';
import dotenv from 'dotenv';
import {
    ApolloClient
    , InMemoryCache
    //, ApolloProvider
    //, useQuery
    , gql
} from '@apollo/client';

dotenv.config();

const myApolloClient = new ApolloClient({
    uri: `${process.env.REACT_APP_API_URL}`,
    cache: new InMemoryCache()
});

const Content = () => {
    const onAuthorSearchHandler = (mySearchValue: String) => {
        // Implement the logic for search
        const MY_QUERY = gql`
            query {
                author(name: "${mySearchValue}") {
                    name,
                    orcid,
                    other_names
                }
            }
        `;
        myApolloClient.query({ query: MY_QUERY })
                      .then(result => console.log(result));
    };

    const onAuthorGraphSearchHandler = (authorId: String, minDepth: String, maxDepth: String) => {
        // Implement the logic for search
        const getGraphDataQuery = gql`
            query {
                authorGraph(author_id: "${authorId}", minDepth: "${minDepth}", maxDepth: "${maxDepth}") {
                    graph
                }
            }
        `;

        myApolloClient.query({ query: getGraphDataQuery })
                      .then(result => console.log(result));
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={4}>
                    <SearchForm onSearchHandler={onAuthorSearchHandler}/>
                    <SearchFormAuthorGraph onSearchHandler={onAuthorGraphSearchHandler}/>
                </Col>
                <Col xs={12} md={8}>col 2 of row 1</Col>
            </Row>
        </Container>
    );
};

export default Content;
