console.log("hello");

var startNode = "A";
var newNodes = ["A", "B", "C", "D"];
var newEdges = [
  ["A", "B"],
  ["A", "C"],
  ["B", "C"],
  ["B", "D"],
  ["C", "D"]
];
newWeights = [3, 2, 5, 1, 2, 3];

function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

document.addEventListener("DOMContentLoaded", function() {
  var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),

    layout: {
      name: "grid",
      rows: 2,
      cols: 2
    },

    style: [
      {
        selector: "node",
        style: {
          content: "data(name)"
        }
      },

      {
        selector: "edge",
        style: {
          // 'curve-style': 'bezier',
          // 'target-arrow-shape': 'triangle'
          // 'label': 'data(label)'
        }
      },

      // some style for the extension

      {
        selector: ".eh-handle",
        style: {
          "background-color": "red",
          width: 12,
          height: 12,
          shape: "ellipse",
          "overlay-opacity": 0,
          "border-width": 12, // makes the handle easier to hit
          "border-opacity": 0
        }
      },

      {
        selector: ".eh-hover",
        style: {
          "background-color": "red"
        }
      },

      {
        selector: ".eh-source",
        style: {
          "border-width": 2,
          "border-color": "red"
        }
      },

      {
        selector: ".eh-target",
        style: {
          "border-width": 2,
          "border-color": "red"
        }
      },

      {
        selector: ".eh-preview, .eh-ghost-edge",
        style: {
          "background-color": "red",
          "line-color": "red",
          "target-arrow-color": "red",
          "source-arrow-color": "red"
        }
      },

      {
        selector: ".eh-ghost-edge.eh-preview-active",
        style: {
          opacity: 0
        }
      },
      {
        selector: "edge[label]",
        style: {
          label: "data(label)",
          width: 3
        }
      }
    ],

    elements: {
      nodes: [
        { data: { id: "A", name: "A" } },
        { data: { id: "B", name: "B" } },
        { data: { id: "C", name: "C" } },
        { data: { id: "D", name: "D" } }
      ],
      edges: [
        { data: { source: "A", target: "B", label: "3" } },
        { data: { source: "A", target: "C", label: "2" } },
        { data: { source: "B", target: "D", label: "1" } },
        { data: { source: "B", target: "C", label: "2" } },
        {
          data: { source: "C", target: "D", label: "3" },
          classes: "top-center"
        }
      ]
    }
  }));

  var eh = cy.edgehandles();

  cy.on("ehcomplete", (event, sourceNode, targetNode, addedEles) => {
    let sourceNodeId = sourceNode._private.data.id;
    let targetNodeId = targetNode._private.data.id;
    let newEdge = [sourceNodeId, targetNodeId];
    newEdges.push(newEdge);
    let weight = prompt("Ingrese el peso");
    cy.elements().edges()[cy.elements().edges().length - 1]._private.data.label = weight
    newWeights.push(weight)
  });



  cy.on("tap", function(evt) {
    var tgt = evt.target
    let nextNode = startNode;

    if (newNodes.length > 0) {
      nextNode = nextChar(newNodes[newNodes.length - 1]);
    }
    var id = nextNode;

    if (tgt === cy) {
      cy.add({
        classes: "automove-viewport",
        data: { id: id, name: id },
        position: {
          x: evt.position.x,
          y: evt.position.y
        }
      });
      newNodes.push(id);
    }
  });

  cy.on('cxttap', 'node', function( evt ){
    var tgt = evt.target

    tgt.remove();
  });

  // document.querySelector('#draw-on').addEventListener('click', function() {
  //   eh.enableDrawMode();
  // });

  // document.querySelector('#draw-off').addEventListener('click', function() {
  //   eh.disableDrawMode();
  // });

//   document.querySelector('#start').addEventListener('click', function() {
//     eh.start( cy.$('node:selected') );
//   });

  document.querySelector("#reset").addEventListener("click", function() {
    cy.elements().remove();
    newNodes = [];
    newEdges = [];
    newWeights = [];
  });
});
