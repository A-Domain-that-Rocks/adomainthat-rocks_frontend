import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchForm = (props: any) => {
    const [searchValue, setSearchValue] = useState('');
    const [minDepthValue, setMinDepthValue] = useState('');
    const [maxDepthValue, setMaxDepthValue] = useState('');

    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        // TODO Implement search logic
        props.onSearchHandler(searchValue);
    };

    const updateSearchValue = (event: any) => {
        event.preventDefault();
        setSearchValue(event.target.value);
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
                              placeholder="Search author graph"
                              value={searchValue}
                              onChange={updateSearchValue} />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Control type="text"
                              placeholder="minimum depth"
                              value={minDepthValue}
                              onChange={updateMinDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
                <Form.Control type="text"
                              placeholder="maximum depth"
                              value={maxDepthValue}
                              onChange={updateMaxDepthValue} />
                <Form.Text className="text-muted"></Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Search
            </Button>
        </Form>
    );
};

export default SearchForm;
