import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import '../custom.css';

const SearchFormNodeGraph = (props: any) => {
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [lastSearchValueNodeName, setLastSearchValueNodeName] = useState('');
    const [searchValueNodeID, setSearchValueNodeID] = useState('');
    const [minDepthValue, setMinDepthValue] = useState('');
    const [maxDepthValue, setMaxDepthValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isQueryingAPI, setIsQueringAPI] = useState(false);

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        if (searchValueNodeID === '' || minDepthValue === '' || maxDepthValue === '') {
            window.alert(`At least one of the search fields is empty... Please fill in the fields.`);
        } else {
            props.onSearchHandler(searchValueNodeID, minDepthValue, maxDepthValue);
        }
    };

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
        setSearchValueNodeName(searchVal + ' Loading possible nodes...');
        setSuggestions([]);
        console.log('queryAPIforSuggestions', searchVal)
        const result = await myApolloClient.query({ query: getSuggestionsQuery });
        console.log('queryAPIforSuggestions', result.data.nodesID);
        setSuggestions(result.data.nodesID);
        setSearchValueNodeName(searchVal);
        setIsQueringAPI(false);
    };

    const updateSearchValueNodeName = (event: any) => {
        event.preventDefault();
        console.log('updateSearchValueNodeName', event.target.value)
        console.log('searchValueNodeName', searchValueNodeName)
        if (!isQueryingAPI) {
            setSearchValueNodeName(event.target.value);
            setLastSearchValueNodeName(event.target.value);
            queryAPIforSuggestions(event.target.value);
        } else {
            setSearchValueNodeName(lastSearchValueNodeName + ' Loading possible nodes...');
        }
    };

    const onSuggestionSelectionHandler = (id: any, name:any) => {
        setSearchValueNodeID(id);
        setSearchValueNodeName(name);
        setSuggestions([]);
        setIsQueringAPI(false);
    };

    const updateMinDepthValue = (event: any) => {
        event.preventDefault();
        console.log('updateMinDepthValue', event.target.value)
        setMinDepthValue(event.target.value);
    };

    const updateMaxDepthValue = (event: any) => {
        event.preventDefault();
        console.log('updateMaxDepthValue', event.target.value)
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
            {isQueryingAPI ? <div>Loading possible nodes ... </div> : searchValueNodeID === "" ? <div>Select one of the nodes</div> : <Button variant="primary" type="submit">Search</Button>}
            
            {suggestions && suggestions.map((this_suggestion: any, i) => 
            <div key={i} className="suggestion justify-content-md-center"
                         onClick={ () => onSuggestionSelectionHandler(this_suggestion._id, this_suggestion.graph_name) }
            >{this_suggestion.the_type[0].toUpperCase() + this_suggestion.the_type.slice(1) + ": " + this_suggestion.graph_name}
            </div>
            )}
        </Form>
    );
};

export default SearchFormNodeGraph;
