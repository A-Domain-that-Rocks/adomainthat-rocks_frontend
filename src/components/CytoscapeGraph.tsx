import Cytoscape from 'cytoscape';
import CytoscapeComponent from 'react-cytoscapejs';
// @ts-ignore
import COSEBilkent from 'cytoscape-cose-bilkent';
Cytoscape.use(COSEBilkent);

const CytoscapeGraph = (props: any) => {
    const APIresponseStartNode = props.graphApiResponse.data.nodeGraph.startNode;
    const APIresponseNodes = props.graphApiResponse.data.nodeGraph.vertices;
    const APIresponseEdges = props.graphApiResponse.data.nodeGraph.edges;

    let base_height = 3;
    let base_width = 3;
    let base_font_size = 7;
    let the_selectable = true;
    let the_locked = false;
    let the_grabbable = true;
    let base_border_width = 0;
    let the_border_style = 'solid';

    const mappedNodes = APIresponseNodes.map((n: { _id: any; graph_name: any; }, index: any) => {
        let the_type = n._id.split('/')[0];
        let the_name = n.graph_name.substring(0, 20);
        let the_width = 0;
        let the_height = 0;
        let the_shape = '';
        let the_background_color = '';
        let the_font_size = 0;
        let the_border_width = 0 + base_border_width;

        switch(the_type) {
            case ('affiliation_institution'):
                the_width = 0.75 * base_width;
                the_height = 0.75 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-heptagon';
                the_background_color = 'yellow';
                break;
            case ('author'):
                the_width = 1 * base_width;
                the_height = 1 * base_height;
                the_font_size = 1 * base_font_size;
                the_shape = 'circle';
                the_background_color = 'green';
                break;
            case ('editor'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-pentagon';
                the_background_color = 'gray';
                break;
            case ('journal'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.8 * base_font_size;
                the_shape = 'round-rectangle';
                the_background_color = 'pink';
                break;
            case ('publication'):
                the_width = 0.75 * base_width;
                the_height = 0.75 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'octagon';
                the_background_color = 'blue';
                break;
            case ('school'):
                the_width = 0.67 * base_width;
                the_height = 0.67 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'round-hexagon';
                the_background_color = 'red';
                break;
            case ('series'):
                the_width = 0.5 * base_width;
                the_height = 0.5 * base_height;
                the_font_size = 0.6 * base_font_size;
                the_shape = 'round-diamond';
                the_background_color = 'purple';
                break;
            default:
                break;
        }

        if (n._id === APIresponseStartNode._id) {
            the_width = 2 * base_width;
            the_height = 2 * base_height;
            //the_background_color = 'gray';
            the_font_size = 1 * base_font_size;
            the_border_width = 0.5 + base_border_width;
            the_border_style = 'dotted';
        }

        let constructed_node = {
            data: {
                id: n._id,
                'label': the_name
            },
            style: {
                width: the_width,
                height: the_height,
                'background-color': the_background_color,
                shape: the_shape,
                'font-size': the_font_size,
                'border-width': 0 + the_border_width,
                'border-style': the_border_style
            },
            //position: { x: Math.floor(Math.random() * 1000),
            //            y: Math.floor(Math.random() * 1000) },
            // labelPosition: "bottom"
            selectable: the_selectable,
            locked: the_locked,
            grabbable: the_grabbable
        };

        return constructed_node;
    });

    const mappedEdges = APIresponseEdges.map((e: { _from: any; _to: any; }, index: any) => {
        let constructed_edge = {
            data: {
                source: e._from,
                target: e._to,
                label: 'edge'
            },
            style: {
                width: 0.25
            }
        };
        return constructed_edge;
    });

    const graphElements = [ ...mappedNodes, ...mappedEdges];

    let layout_options = {
        name: 'cose',
      
        // Called on `layoutready`
        ready: function(){},
      
        // Called on `layoutstop`
        stop: function(){},
      
        // Whether to animate while running the layout
        // true : Animate continuously as the layout is running
        // false : Just show the end result
        // 'end' : Animate with the end result, from the initial positions to the end positions
        animate: true,
      
        // Easing of the animation for animate:'end'
        animationEasing: undefined,
      
        // The duration of the animation for animate:'end'
        animationDuration: 500,
      
        // A function that determines whether the node should be animated
        // All nodes animated by default on animate enabled
        // Non-animated nodes are positioned immediately when the layout starts
        animateFilter: function ( node: any, i: any ){ return true; },
      
      
        // The layout animates only after this many milliseconds for animate:true
        // (prevents flashing on fast runs)
        animationThreshold: 250,
      
        // Number of iterations between consecutive screen positions update
        refresh: 20,
      
        // Whether to fit the network view after when done
        fit: true,
      
        // Padding on fit
        padding: 20,
      
        // Constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        boundingBox: undefined,
      
        // Excludes the label when calculating node bounding boxes for the layout algorithm
        nodeDimensionsIncludeLabels: true,
      
        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: true,
      
        // Extra spacing between components in non-compound graphs
        componentSpacing: 150,
      
        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: function( node: any ){ return 4500; },
      
        // Node repulsion (overlapping) multiplier
        nodeOverlap: 4,
      
        // Ideal edge (non nested) length
        idealEdgeLength: function( edge: any ){ return 32; },

        smartRestLength: true,
      
        // Divisor to compute edge forces
        edgeElasticity: function( edge: any ){ return 32; },
      
        // Nesting factor (multiplier) to compute ideal edge length for nested edges
        nestingFactor: 1.2,
      
        // Gravity force (constant)
        gravity: 0.25,
      
        // Maximum number of iterations to perform
        numIter: 1000,
      
        // Initial temperature (maximum node displacement)
        initialTemp: 1000,
      
        // Cooling factor (how the temperature is reduced between consecutive iterations
        coolingFactor: 0.99,
      
        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0
    };
    
    let coseBilkentLayoutOptions = {
        name: 'cose-bilkent',
      
        // Called on `layoutready`
        ready: function(){},
      
        // Called on `layoutstop`
        stop: function(){},

        // Type of layout animation. The option set is {'during', 'end', false}
        animate: 'end',

        // Duration for animate:end
        animationDuration: 500,
      
        // Extra spacing between components in non-compound graphs
        componentSpacing: 150,
      
        // Divisor to compute edge forces
        edgeElasticity: 0.45,

        // Whether to fit the network view after when done
        fit: true,
      
        // Gravity force (constant)
        gravity: 0.25,
      
        // Gravity force (constant) for compounds
        gravityCompound: 1.0,

        // Gravity range (constant)
        gravityRange: 3.8,
        
        // Gravity range (constant) for compounds
        gravityRangeCompound: 1.5,

        // Ideal (intra-graph) edge length
        idealEdgeLength: 50,

        // Initial cooling factor for incremental layout
        initialEnergyOnIncremental: 0.5,

        // Lower temperature threshold (below this point the layout will end)
        minTemp: 1.0,
      
        // Nesting factor (multiplier) to compute ideal edge length for inter-graph edges
        nestingFactor: 0.1,

        // Whether to include labels in node dimensions. Useful for avoiding label overlap
        nodeDimensionsIncludeLabels: true,
      
        // Node repulsion (overlapping) multiplier
        nodeOverlap: 4,

        // Node repulsion (non overlapping) multiplier
        nodeRepulsion: 4500,

        // Maximum number of iterations to perform
        numIter: 2500,
      
        // Padding on fit
        padding: 10,

        // 'draft', 'default' or 'proof" 
        // - 'draft' fast cooling rate 
        // - 'default' moderate cooling rate 
        // - "proof" slow cooling rate
        quality: 'default',
      
        // Randomize the initial positions of the nodes (true) or use existing positions (false)
        randomize: true,
        // number of ticks per frame; higher is faster but more jerky
        refresh: 30,
        // Whether to tile disconnected nodes
        tile: true,
        // Amount of vertical space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingVertical: 10,
        // Amount of horizontal space to put between degree zero nodes during tiling (can also be a function)
        tilingPaddingHorizontal: 10

    };

    return (<CytoscapeComponent
            elements={graphElements}
            style={{
                width: '100%',
                height: '75vh',
                //maxWidth: '100%',
                //left: '-0vw',
                backgroundColor: '#2F3034',
                border: 1
            }}
            // style={ { width: '500px', height: '75vh' } }
            layout={coseBilkentLayoutOptions}
        />)
};

export default CytoscapeGraph;
