import { useEffect, useState } from 'react';
import { Form, Button, ListGroup, Spinner } from 'react-bootstrap';
import { myApolloClient } from '../App';
import { gql } from '@apollo/client';
import './SearchFormNodeGraph.css';

const SearchFormNodeGraph = (props: any) => {
    let lastValue = '';
    const [searchValueDict, setSearchValueDict] = useState(new Map<string, []>());
    const [isQueryingAPI, setIsQueryingAPI] = useState(new Map<string, boolean>());
    const [resultsObtained, setResultsObtained] = useState(new Set());
    const [searchValueNodeName, setSearchValueNodeName] = useState('');
    const [searchValueNodeID, setSearchValueNodeID] = useState(''); // to do refactor with formInputs.input.nodeId
    const [minDepthValue, setMinDepthValue] = useState(1); // to do refactor with formInputs.input.min
    const [maxDepthValue, setMaxDepthValue] = useState(2); // to do refactor with formInputs.input.max
    const [suggestions, setSuggestions] = useState([]);
    const [lastChangeTimeoutTimerId, setLastChangeTimeoutTimerId] = useState(0);
    const [formInputs, setFormInputs] = useState({
        input: {nodeId: '', min: 1, max: 2}, // to do refactor with searchValueNodeID, minDepthValue and maxDepthValue
        errors: {nodeId: '', min: '', max: ''}
    });
    const [isValidatedAtLeastOnce, setIsValidatedAtLeastOnce] = useState(false);

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        setIsValidatedAtLeastOnce(true)
        if (validate()) {
            setFormInputs({input: {nodeId: "", min: 1, max: 2}, errors: {nodeId: '', min: '', max: ''}});
            props.onSearchHandler(searchValueNodeID, minDepthValue, maxDepthValue);
        }
        // props.onSearchHandler("author/40211985", "1", "2"); // static author id just to do some fast tests
    };

    useEffect( () => {
            if (isValidatedAtLeastOnce) { validate(); }
        }, [searchValueNodeID, minDepthValue, maxDepthValue, searchValueNodeName]
    );

    const validate = () => {
        let input = formInputs.input;
        let errors = {
            min: '',
            max: '',
            nodeId: ''
        };
        let isValid = true;

        //Name is required - check if it is empty
        if ((!input["nodeId"] || input["nodeId"] === '') && searchValueNodeName !== '') {
            isValid = false;
            errors["nodeId"] = "Choose a node name from the list";
        }

        if ((!input["nodeId"] || input["nodeId"]) && searchValueNodeName === '') {
            isValid = false;
            errors["nodeId"] = "Enter a name or a title to get a list of possible nodes"
        }

        // Minimum depth validation checks
        if (!input["min"]) {
            isValid = false;
            errors["min"] = "Minimum depth is required";
        }
        if ((input["min"] < 1 && !input["max"]) || (input["min"] < 1 && input["min"] <= input["max"])) {
            isValid = false;
            errors["min"] = "Minimum depth has to be greater or equal to 1";
        }
        if (input["min"] < 1 && input["min"] > input["max"]) {
            isValid = false;
            errors["min"] = "Minimum depth has to be greater or equal to maximum depth and it has to be greater or equal to 1";
        }
        if (input["min"] > 1 && input["min"] > input["max"]) {
            isValid = false;
            errors["min"] = "Minimum depth has to be smaller or equal to maximum depth";
        }

        //Maximum depth checks
        if (!input["max"]) {
            isValid = false;
            errors["max"] = "Maximum depth is required";
        }
        if (input["max"] >= 1 && input["max"] < input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to minimum depth";
        }
        if (input["max"] < 1 && input["max"] >= input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to 1";
        }
        if (input["max"] < 1 && input["max"] < input["min"]) {
            isValid = false;
            errors["max"] = "Maximum depth has to be greater or equal to minimum depth and it has to be greater or equal to 1";
        }

        setFormInputs((prevState) => ({
            ...prevState,
            errors
        }));
        return isValid;
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
    };

    const queryAPIforSuggestions = async (searchVal: string) => {
        // const lowerSearchVal = searchVal
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

        const lowerSearchVal = searchVal

        isQueryingAPI.set(lowerSearchVal, true);
        setIsQueryingAPI(isQueryingAPI);

        const result2: any = await myApolloClient.query({query: searchQueryBuilder(searchVal, "2")});

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
                if (item === lastValue.substring(0, lastValue.length - i)) {
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

        if (event.target.value.length > 4 && !resultsObtained.has(argVal) && !isQueryingAPI.has(argVal)) {
            const newTimeoutTimerId: any = setTimeout(function() {
                queryAPIforSuggestions(argVal);
            }, 750);
            setLastChangeTimeoutTimerId(newTimeoutTimerId)
        } else if (event.target.value.length > 4 && resultsObtained.has(argVal)) {
            const suggest: any = searchValueDict.get(argVal);
            setSuggestions(suggest);
        }
    };

    const onSuggestionSelectionHandler = (suggestion: any) => {
        setSearchValueNodeID(suggestion._id);
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                nodeId: suggestion._id
            }
        }));
        setSearchValueNodeName(suggestion.graph_name);
    };

    const updateMinDepthValue = (event: any) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [event.target.name]: parseInt(event.target.value) // to do refactor to outer function call
            },
        }));
        setMinDepthValue(event.target.value);
    };

    const updateMaxDepthValue = (event: any) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [event.target.name]: parseInt(event.target.value) // to do refactor to outer function call
            },
        }));
        setMaxDepthValue(event.target.value);
    };

    return (
        <Form onSubmit={onSubmitHandler} className="searchForm">
            <Form.Group className="autocomplete-container"
                        controlId="search"
                        onBlur={() => {
                            setTimeout(() => {
                                setSuggestions([])
                            }, 100);
                        }}>
                <Form.Label className="text-muted">Node name or title</Form.Label>
                <Form.Control type="text"
                              name="nodeId"
                              placeholder="Enter a name or a title"
                              value={searchValueNodeName}
                              onChange={updateSearchValueNodeName}
                              isInvalid={formInputs.errors.nodeId !== ''}
                              isValid={isValidatedAtLeastOnce && formInputs.input.nodeId !== ''}
                              onFocus={updateSearchValueNodeName}
                />
                <Form.Control.Feedback type="invalid">
                    {formInputs.errors.nodeId}
                </Form.Control.Feedback>

                <ListGroup className="suggestionList">
                    {suggestions && suggestions.length > 0 && suggestions.map((this_suggestion: any, i) =>
                        <ListGroup.Item
                            key={i}
                            onClick={() => onSuggestionSelectionHandler(this_suggestion)}
                        >
                            {this_suggestion.the_type[0].toUpperCase() + this_suggestion.the_type.slice(1) + ": " + this_suggestion.graph_name}
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-muted">Minimum depth</Form.Label>
                <Form.Control type="number"
                              name="min"
                              placeholder="Set minimum depth, e.g: 1"
                              value={minDepthValue}
                              isInvalid={formInputs.errors.min !== ''}
                              isValid={isValidatedAtLeastOnce && formInputs.errors.min === ''}
                              onChange={updateMinDepthValue}
                />
                <Form.Control.Feedback type="invalid">
                    {formInputs.errors.min}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group>
                <Form.Label className="text-muted">Maximum depth</Form.Label>
                <Form.Control type="number"
                              name="max"
                              placeholder="Set maximum depth, e.g: 2"
                              value={maxDepthValue}
                              onChange={updateMaxDepthValue}
                              isInvalid={formInputs.errors.max !== ''}
                              isValid={isValidatedAtLeastOnce && formInputs.errors.max === ''}
                />
                <Form.Control.Feedback type="invalid">
                    {formInputs.errors.max}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
            <Button className="searchButton"
                    variant="dark"
                    type="submit"
                    disabled={isValidatedAtLeastOnce && (
                        // !isFormValid ||
                        props.isLoadingGraph)}>
                    {props.isLoadingGraph && <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />}
                    <span> Search</span></Button>
            </Form.Group>
        </Form>
    );
};

export default SearchFormNodeGraph;
