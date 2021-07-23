import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import '../custom.css';

const SearchFormNodeGraph = (props: any) => {
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [searchValueNodeID, setSearchValueNodeID] = useState('');
    const [minDepthValue, setMinDepthValue] = useState('');
    const [maxDepthValue, setMaxDepthValue] = useState('');
    const [nodes, setNodes] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [isQueringAPI, setIsQueringAPI] = useState(false);
    const [lastChangeTimeoutTimerId, setLastChangeTimeoutTimerId] = useState(0);

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        props.onSearchHandler(searchValueNodeID, minDepthValue, maxDepthValue);
    };

    const filterAlreadyPresentDataForSuggestions = (searchVal: any) => {
        let matches = []
        matches = nodes.filter((node: any) => {
            const regex = new RegExp(`${searchVal}`, "gi");
            return node.graph_name.match(regex)
        });
        console.log("sliced matches", matches.slice(0, 10));
        setSuggestions(matches.slice(0, 10));
    }

    const queryAPIforSuggestions = async (searchVal: any) => {
        const getSuggestionsQuery = gql`
            query {
                nodesID(name: "${searchVal}") {
                    ... on SuggestedNode {
                        _id
                        graph_name
                        the_type
                        appearances
                    }
                }
            }
        `;
        setIsQueringAPI(true);
        const result = await myApolloClient.query({ query: getSuggestionsQuery });
        console.log("result.data.nodesID", result.data.nodesID);
        setIsQueringAPI(false);
        setNodes(result.data.nodesID);
        console.log("Setting suggestions");
        console.log("sliced nodesID", result.data.nodesID.slice(0, 10));
        setSuggestions(result.data.nodesID.slice(0, 10));
    };

    const onDelayedTyping: any = (searchValue: any) => {
        if (!isQueringAPI) {
            if (nodes.length > 0) {
                filterAlreadyPresentDataForSuggestions(searchValue);
            }
            else {
                queryAPIforSuggestions(searchValue);
            }
        }
    };


    const updateSearchValueNodeName = (event: any) => {
        event.preventDefault();
        setSearchValueNodeName(event.target.value);
        clearTimeout (lastChangeTimeoutTimerId);
        if (event.target.value.length > 4) {
            if (nodes.length === 0) {
                const newTimeoutTimerId: any = setTimeout ( function() { onDelayedTyping(event.target.value); }, 300 );
                setLastChangeTimeoutTimerId(newTimeoutTimerId)
            }
            else {
                filterAlreadyPresentDataForSuggestions(event.target.value);
            }
        }
        else {
            setNodes([]);
        }
    };

    const onSuggestionSelectionHandler = (id: any, name:any) => {
        setSearchValueNodeID(id);
        setSearchValueNodeName(name);
        setSuggestions([]);
    };

    const updateMinDepthValue = (event: any) => {
        event.preventDefault();
        setMinDepthValue(event.target.value);
    };

    const updateMaxDepthValue = (event: any) => {
        event.preventDefault();
        setMaxDepthValue(event.target.value);
    };

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="search">
                <Form.Label>Search</Form.Label>
                <Form.Control type="text"
                              placeholder="Search for node"
                              value={searchValueNodeName}
                              onChange={updateSearchValueNodeName}
                              onBlur={() => {
                                  setTimeout(() => {
                                      setSuggestions([])
                                  }, 100);
                              }} />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Control type="text"
                              placeholder="Set minimum depth"
                              value={minDepthValue}
                              onChange={updateMinDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Control type="text"
                              placeholder="Set maximum depth"
                              value={maxDepthValue}
                              onChange={updateMaxDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Search
            </Button>
            {suggestions && suggestions.map((suggestions: any, i) => 
            <div key={i} className="suggestion justify-content-md-center"
            onClick={ () => onSuggestionSelectionHandler(suggestions._id, suggestions.graph_name) }
            >{suggestions.the_type[0].toUpperCase() + suggestions.the_type.slice(1) + ": " + suggestions.graph_name}</div>
            )}
        </Form>
    );
};

export default SearchFormNodeGraph;
