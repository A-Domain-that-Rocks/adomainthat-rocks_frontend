import { Container, Row, Col } from 'react-bootstrap';
import SearchFormNodeGraph from './SearchFormNodeGraph';
import CytoscapeGraph from './CytoscapeGraph';
import { useState } from 'react';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';

const Content = () => {
    const initialEmptyGraph = { data: { nodeGraph: { startNode: {}, vertices: [], edges: [] } } }
    const [graphData, setGraphData] = useState(initialEmptyGraph);
    const [isLoadingGraph, setIsLoadingGraph] = useState(false);

    const onNodeGraphSearchHandler = async (nodeId: String, minDepth: String, maxDepth: String) => {
        setGraphData(initialEmptyGraph);
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
        setIsLoadingGraph(true);
        const result = await myApolloClient.query({ query: getGraphDataQuery });
        setGraphData(result);
        setIsLoadingGraph(false);
    };

    return (
        <Container>
            <Row>
                <Col xs={12} md={4}>
                    <SearchFormNodeGraph onSearchHandler={onNodeGraphSearchHandler}/>
                </Col>
                <Col xs={12} md={8}>
                        {graphData && graphData.data && graphData.data.nodeGraph && graphData.data.nodeGraph.vertices && graphData.data.nodeGraph.vertices.length > 0 ? <CytoscapeGraph graphApiResponse={graphData}/> : isLoadingGraph ? <div>Loading graph ...</div> : <div>Search to display a graph</div> }
                </Col>
            </Row>
        </Container>
    );
};

export default Content;
