import React from 'react';
import { Form, Button } from 'react-bootstrap';

const SearchForm = (props: any) => {
    const onSubmitHandler = (event: any) => {
        event.preventDefault();
        // TODO Implement search logic
        props.onSearchHandler();
    };

    return (
        <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="search">
                <Form.Label>Search</Form.Label>
                <Form.Control type="text" placeholder="Search by author" />
                <Form.Text className="text-muted">
                </Form.Text>
            </Form.Group>
            <Button variant="primary" type="submit">
                Search
            </Button>
        </Form>
    );
};

export default SearchForm;
