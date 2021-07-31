import React, { useState } from 'react';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import './SearchFormNodeGraph.css';

const SearchFormNodeGraph = (props: any) => {
    let lastValue = '';
    const [searchValueDict, setSearchValueDict] = useState(new Map<string, []>());
    const [isQueryingAPI, setIsQueryingAPI] = useState(new Map<string, boolean>());
    const [resultsObtained, setResultsObtained] = useState(new Set());
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [searchValueNodeID, setSearchValueNodeID] = useState('');
    const [minDepthValue, setMinDepthValue] = useState(1);
    const [maxDepthValue, setMaxDepthValue] = useState(2);
    const [suggestions, setSuggestions] = useState([]);
    const [lastChangeTimeoutTimerId, setLastChangeTimeoutTimerId] = useState(0);

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        if (searchValueNodeID === '' || minDepthValue === null || maxDepthValue === null) {
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
        setSearchValueNodeID('');
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
            const suggest: any = searchValueDict.get(argVal.toLowerCase());
            setSuggestions(suggest);
        }
    };

    const onSuggestionSelectionHandler = (id: any, name: any) => {
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
        <Form onSubmit={onSubmitHandler} className="searchForm">
            <Form.Group className="mb-3" controlId="search">
                <Form.Label className="searchInfo">Enter a name or a title to get a list of possible
                    nodes</Form.Label>

                <Form.Text className="text-muted">Node name or title</Form.Text>
                <Form.Control type="text"
                              placeholder="Enter a name or a title"
                              value={searchValueNodeName}
                              onChange={updateSearchValueNodeName}
                              onBlur={() => {
                                  setTimeout(() => {
                                      setSuggestions([])
                                  }, 100);
                              }}
                              onFocus={updateSearchValueNodeName} 
                              style={ searchValueNodeName === '' || resultsObtained.size === 0 ? {backgroundColor: 'rgb(30, 30, 30)'}: (searchValueNodeID === '' ? {backgroundColor: 'yellow', color: 'rgb(30, 30, 30)'}: {backgroundColor: 'darkgreen'}) }
                />

                {/*Suggestion section*/}
                <ListGroup className="suggestionList">
                    {/*{isQueryingAPI.has(searchValueNodeName) && isQueryingAPI.get(searchValueNodeName) ?*/}
                    {/*    <div>Loading possible nodes ... </div> : searchValueNodeID === "" ? <div></div> :*/}
                    {suggestions && suggestions.length > 0 && suggestions.map((this_suggestion: any, i) =>
                        <ListGroup.Item key={i}>
                            <div
                                onClick={() => onSuggestionSelectionHandler(this_suggestion._id, this_suggestion.graph_name)}>
                                {this_suggestion.the_type[0].toUpperCase() + this_suggestion.the_type.slice(1) + ": " + this_suggestion.graph_name}
                            </div>
                        </ListGroup.Item>
                    )}
                </ListGroup>
                
                <Form.Text className="text-muted">Minimum depth</Form.Text>
                <Form.Control type="number"
                              placeholder="Set minimum depth, e.g: 1"
                              value={minDepthValue}
                              onChange={updateMinDepthValue}
                              style={minDepthValue == 1 || (minDepthValue > 1 && maxDepthValue >= minDepthValue) ? {backgroundColor: 'darkgreen'}: {backgroundColor: 'yellow', color: 'rgb(30, 30, 30)'} }
                />
                {minDepthValue < 1 && minDepthValue <= maxDepthValue ? <Form.Text className="text-warning">Minimum depth has to be greater or equal to 1</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                {minDepthValue < 1 && minDepthValue > maxDepthValue ? <Form.Text className="text-warning">Minimum depth has to be greater or equal to maximum depth and it has to be greater or equal to 1</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                {minDepthValue > 1 && minDepthValue > maxDepthValue ? <Form.Text className="text-warning">Minimum depth has to be smaller or equal to maximum depth</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                <Form.Text className="text-muted">Maximum depth</Form.Text>
                <Form.Control type="number"
                              placeholder="Set maximum depth, e.g: 2"
                              value={maxDepthValue}
                              onChange={updateMaxDepthValue}
                              style={maxDepthValue >= minDepthValue && maxDepthValue >= 1 ? {backgroundColor: 'darkgreen'}: {backgroundColor: 'yellow', color: 'rgb(30, 30, 30)'} }
                />
                {maxDepthValue >= 1 && maxDepthValue < minDepthValue ? <Form.Text className="text-warning">Maximum depth has to be greater or equal to minimum depth</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                {maxDepthValue < 1 && maxDepthValue >= minDepthValue ? <Form.Text className="text-warning">Maximum depth has to be greater or equal to 1</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                {maxDepthValue < 1 && maxDepthValue < minDepthValue ? <Form.Text className="text-warning">Maximum depth has to be greater or equal to minimum depth and it has to be greater or equal to 1</Form.Text>: <Form.Text className="text-warning"></Form.Text>}
                <Button className="searchButton" variant="dark" type="submit">Search</Button>
            </Form.Group>
        </Form>
    );
};

export default SearchFormNodeGraph;
