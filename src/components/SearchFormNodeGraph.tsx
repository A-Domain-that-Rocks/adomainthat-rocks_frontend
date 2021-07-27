import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import '../custom.css';

const SearchFormNodeGraph = (props: any) => {
    let lastValue = '';
    const [searchValueDict, setSearchValueDict] = useState(new Map<string, []>());
    const [isQueryingAPI, setIsQueryingAPI] = useState(new Map<string, boolean>());
    const [resultsObtained, setResultsObtained] = useState(new Set());
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [searchValueNodeID, setSearchValueNodeID] = useState('');
    const [minDepthValue, setMinDepthValue] = useState('');
    const [maxDepthValue, setMaxDepthValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [lastChangeTimeoutTimerId, setLastChangeTimeoutTimerId] = useState(0);

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        if (searchValueNodeID === '' || minDepthValue === '' || maxDepthValue === '') {
            //window.alert(`At least one of the search fields is empty... Please fill in the fields.`);
        } else {
            props.onSearchHandler(searchValueNodeID, minDepthValue, maxDepthValue);
        }
    };

    const searchQueryBuilder = (searchV: string, num: string) => {
        return gql`
            query {
                nodesID${num}(name: "${searchV}") {
                    ... on SuggestedNode {
                        _id
                        graph_name
                        the_type
                    }
                }
            }
        `;
    }

    const queryAPIforSuggestions = async (searchVal: string) => {
        // const lowerSearchVal = searchVal.toLowerCase()
        // 
        // isQueryingAPI.set(lowerSearchVal, true);
        // setIsQueryingAPI(isQueryingAPI);
        //
        // const result5: any = await myApolloClient.query({ query: searchQueryBuilder(lowerSearchVal, "5") });
        //
        // searchValueDict.set(lowerSearchVal, result5.data.nodesID5);
        // setSearchValueDict(searchValueDict);
        //
        // resultsObtained.add(lowerSearchVal);
        // setResultsObtained(resultsObtained);
        // filterObtainedResults();
        //
        // const result3: any = await myApolloClient.query({ query: searchQueryBuilder(lowerSearchVal, "3") });
        // const result35: any = [...result3.data.nodesID3, ...result5.data.nodesID5]
        //
        // searchValueDict.set(lowerSearchVal, result35);
        // setSearchValueDict(searchValueDict);
        // filterObtainedResults();
        //
        // const result2: any = await myApolloClient.query({ query: searchQueryBuilder(searchVal, "2") });
        // const result235: any = [...result2.data.nodesID2, ...result35]
        //
        // searchValueDict.set(lowerSearchVal, result235);
        // setSearchValueDict(searchValueDict);
        //
        // isQueryingAPI.set(lowerSearchVal, false);
        // setIsQueryingAPI(isQueryingAPI);
        // filterObtainedResults();

        const lowerSearchVal = searchVal.toLowerCase()

        isQueryingAPI.set(lowerSearchVal, true);
        setIsQueryingAPI(isQueryingAPI);

        const result2: any = await myApolloClient.query({ query: searchQueryBuilder(searchVal, "2") });
        
        searchValueDict.set(lowerSearchVal, result2.data.nodesID2);
        setSearchValueDict(searchValueDict);
        
        resultsObtained.add(lowerSearchVal);
        setResultsObtained(resultsObtained);

        isQueryingAPI.set(lowerSearchVal, false);
        setIsQueryingAPI(isQueryingAPI);
        filterObtainedResults();
    };

    const filterObtainedResults = () => {
        let flag_done = false;
        for (let i = 0; i < lastValue.length; i++) {
            for (let item of resultsObtained) {
                if (item === lastValue.substring(0, lastValue.length - i).toLowerCase()) {
                    const suggest: any = searchValueDict.get(item);
                    setSuggestions(suggest);
                    flag_done = true;
                    break;
                }
            }
            if (flag_done) break;
        }
        if (!flag_done) setSuggestions([]);
    }

    const updateSearchValueNodeName = (event: any) => {
        event.preventDefault();
        clearTimeout(lastChangeTimeoutTimerId);
        const argVal: string = event.target.value
        setSearchValueNodeName(argVal);
        lastValue = argVal;

        if (event.target.value.length > 4 && !resultsObtained.has(argVal.toLowerCase()) && !isQueryingAPI.has(argVal.toLowerCase())) {
            const newTimeoutTimerId: any = setTimeout ( function() {
                queryAPIforSuggestions(argVal);
            }, 750 );
            setLastChangeTimeoutTimerId(newTimeoutTimerId)
        } else if (event.target.value.length > 4 && resultsObtained.has(argVal.toLowerCase())) {
            const suggest: any = searchValueDict.get(argVal);
            setSuggestions(suggest);
        }
    };

    const onSuggestionSelectionHandler = (id: any, name:any) => {
        setSearchValueNodeID(id);
        setSearchValueNodeName(name);
        setSuggestions([]);
    };

    const updateMinDepthValue = (event: any) => {
        event.preventDefault();
        // console.log('updateMinDepthValue', event.target.value)
        setMinDepthValue(event.target.value);
    };

    const updateMaxDepthValue = (event: any) => {
        event.preventDefault();
        // console.log('updateMaxDepthValue', event.target.value)
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
                              placeholder="Set minimum depth, e.g: 1"
                              value={minDepthValue}
                              onChange={updateMinDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Control type="text"
                              placeholder="Set maximum depth, e.g: 2"
                              value={maxDepthValue}
                              onChange={updateMaxDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            {isQueryingAPI.has(searchValueNodeName) && isQueryingAPI.get(searchValueNodeName) ? <div>Loading possible nodes ... </div> : searchValueNodeID === "" ? <div>Enter a name or a title to get a list of possible nodes</div> : <Button variant="primary" type="submit">Search</Button>}
            
            {suggestions && suggestions.length > 0 && suggestions.map((this_suggestion: any, i) => 
            <div key={i} className="suggestion justify-content-md-center"
                         onClick={ () => onSuggestionSelectionHandler(this_suggestion._id, this_suggestion.graph_name) }
            >{this_suggestion.the_type[0].toUpperCase() + this_suggestion.the_type.slice(1) + ": " + this_suggestion.graph_name}
            </div>
            )}
        </Form>
    );
};

export default SearchFormNodeGraph;
