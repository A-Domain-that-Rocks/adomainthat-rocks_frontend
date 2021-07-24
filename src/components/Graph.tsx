import { Graph } from 'react-d3-graph';
import React from 'react';

const GraphDraw = (props: any) => {
    const APIresponseStartNode = props.graphApiResponse.data.nodeGraph.startNode;
    const APIresponseNodes = props.graphApiResponse.data.nodeGraph.vertices;
    const APIresponseEdges = props.graphApiResponse.data.nodeGraph.edges;

    const mappedNodes = APIresponseNodes.map((n: { _id: any; graph_name: any; }) => {
        let the_type = n._id.split('/')[0];
        let the_name = n.graph_name.substring(0, 20);
        let the_color = '';
        let the_size = 0;
        let the_symbolType = '';
        let the_fontSize = 0;

        switch(the_type) {
            case ('affiliation_institution'):
                the_size = 100;
                the_fontSize = 8
                the_color = 'yellow';
                the_symbolType = 'diamond';
                break;
            case ('author'):
                the_size = 200;
                the_fontSize = 10;
                the_color = 'green';
                the_symbolType = 'circle';
                break;
            case ('editor'):
                the_size = 75;
                the_fontSize = 8;
                the_color = 'gray';
                the_symbolType = 'triangle';
                break;
            case ('journal'):
                the_size = 50;
                the_fontSize = 8;
                the_color = 'pink';
                the_symbolType = 'triangle';
                break;
            case ('publication'):
                the_size = 150;
                the_fontSize = 6;
                the_color = 'blue'; 
                the_symbolType = 'square';
                break;
            case ('school'):
                the_size = 100;
                the_fontSize = 8;
                the_color = 'red';
                the_symbolType = 'diamond';
                break;
            case ('series'):
                the_size = 50;
                the_fontSize = 6;
                the_color = 'purple'
                the_symbolType = 'triangle';
                break;
            default:
                break;
        }

        if (n._id === APIresponseStartNode._id) {
            the_size = 300;
        }

        return {
            id: n._id,
            color: the_color,
            name: the_name,
            size: the_size,
            fontSize: the_fontSize,
            symbolType: the_symbolType
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
        links: [...mappedEdges],
        focusedNodeId: APIresponseStartNode._id
    };

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            color: 'lightgreen',
            size: 120,
            highlightStrokeColor: 'blue',
            labelProperty: "name"
        },
        link: { highlightColor: 'lightblue' }
    };

    const onClickNode = function(nodeId: any) {
        let theClickedNode: any = { _id: '', graph_name: ''}
        for (let i = 0; i < APIresponseNodes.length; i++) {
            if (APIresponseNodes[i]._id === nodeId) {
                theClickedNode = APIresponseNodes[i];
                break;
            }
        }
        window.alert(`Info on the clicked node:\n\ntype: ${theClickedNode._id.split('/')[0]}\nname: ${theClickedNode.graph_name}`);
    };

    const onClickLink = function(source: any, target: any) {
        let theClickedSourceNode: any = { _id: '', graph_name: ''}
        let theClickedTargetNode: any = { _id: '', graph_name: ''}
        for (let i = 0; i < APIresponseNodes.length; i++) {
            if (APIresponseNodes[i]._id === source) {
                theClickedSourceNode = APIresponseNodes[i];
            } else if (APIresponseNodes[i]._id === target) {
                theClickedTargetNode = APIresponseNodes[i];
            }
        }
        window.alert(`Info on the clicked edge:\n\nSource type: ${theClickedSourceNode._id.split('/')[0]}\nSource name: ${theClickedSourceNode.graph_name}\n\nTarget type: ${theClickedTargetNode._id.split('/')[0]}\nTarget name: ${theClickedTargetNode.graph_name}\n`);
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
