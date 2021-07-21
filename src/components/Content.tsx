/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable space-before-function-paren */
import { Container, Row, Col } from 'react-bootstrap';
import SearchFormNodeGraph from './SearchFormNodeGraph';
import GraphDraw from './Graph';
import React, { useState } from 'react';
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
    const [graphData, setGraphData] = useState({ data: { nodeGraph: { startNode: {}, vertices: [], edges: [] } } });

    const onNodeGraphSearchHandler = async (nodeId: String, minDepth: String, maxDepth: String) => {
        // Implement the logic for search
        const getGraphDataQuery = gql`
            query {
                nodeGraph(node_id: "${nodeId}", minDepth: "${minDepth}", maxDepth: "${maxDepth}") {
                    startNode {
                          _id
                          graph_name
                    }
                    vertices {
                        ... on SlimNode {
                            _id
                            graph_name
                        }
                    }
                    edges {
                        ... on SlimEdge {
                            _from
                            _to
                            label
                        }
                    }
                }
            }
        `;
        const result = await myApolloClient.query({ query: getGraphDataQuery });
        setGraphData(result);
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={4}>
                    <SearchFormNodeGraph onSearchHandler={onNodeGraphSearchHandler}/>
                </Col>
                <Col xs={12} md={8}>
                    {graphData && graphData.data && graphData.data.nodeGraph && graphData.data.nodeGraph.vertices && graphData.data.nodeGraph.vertices.length > 0 ? <GraphDraw graphApiResponse={graphData}/> : <div>Search to display a graph</div>}
                </Col>
            </Row>
        </Container>
    );
};

export default Content;
