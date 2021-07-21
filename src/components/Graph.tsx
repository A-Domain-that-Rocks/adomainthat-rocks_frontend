/* eslint-disable eqeqeq */
/* eslint-disable react/prop-types */
/* eslint-disable prefer-const */
/* eslint-disable camelcase */
/* eslint-disable semi */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-unused-vars */
import { Graph } from 'react-d3-graph';
import React, { useEffect, useState } from 'react';

const GraphDraw = (props: any) => {
    console.log('props' + props);
    const APIresponseNodes = props.graphApiResponse.data.nodeGraph.vertices;
    const APIresponseEdges = props.graphApiResponse.data.nodeGraph.edges;

    const mappedNodes = APIresponseNodes.map((n: { _id: any; graph_name: any; }) => {
        return {
            id: n._id,
            color: '#52821b',
            name: n.graph_name
        }
    });

    const mappedEdges = APIresponseEdges.map((e: { _from: any; _to: any; }) => {
        return {
            source: e._from,
            target: e._to
        }
    });

    const mydata = {
        nodes: [...mappedNodes],
        links: [...mappedEdges]
    };

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue'
        },
        link: { highlightColor: 'lightblue' }
    };

    const onClickNode = function(nodeId: any) {
        window.alert(`Clicked node ${nodeId}`);
    };

    const onClickLink = function(source: any, target: any) {
        window.alert(`Clicked link between ${source} and ${target}`);
    };

    return <div className="Graph">
        <Graph
            id='graph-id'
            data={mydata}
            config={myConfig}
            onClickNode={onClickNode}
            onClickLink={onClickLink}
        /></div>
    ;
};

export default GraphDraw;
