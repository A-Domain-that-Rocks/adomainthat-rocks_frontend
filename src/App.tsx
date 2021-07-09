import React, { Fragment } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/Header';
import Content from './components/Content';
import Footer from './components/Footer';
import dotenv  from "dotenv";
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    useQuery,
    gql
} from "@apollo/client";

dotenv.config();

function App() {
    const myApolloClient = new ApolloClient({
        uri: `${process.env.SERVER_URL}:${process.env.PORT}`,
        cache: new InMemoryCache()
    });

    return (
        <div className="App">
            <Fragment>
                <Header/>
                <Content/>
                <Footer/>
            </Fragment>
        </div>
    );
};

export default App;
