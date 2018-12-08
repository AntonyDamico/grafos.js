console.log("hello");

// Valores de inicio y globales
var startNode = "A";
var newNodes = ["A", "B", "C", "D"];
var newEdges = [["A", "B"], ["A", "C"], ["B", "C"], ["B", "D"], ["C", "D"]];
var newWeights = [3, 2, 5, 1, 2, 3];

// Funcion para aumentar una letra: B+1 => C
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

// Parte principal
document.addEventListener("DOMContentLoaded", function() {
  var cy = (window.cy = cytoscape({
    container: document.getElementById("cy"),

    // Layout para los nodos iniciales
    layout: {
      name: "grid",
      rows: 2,
      cols: 2
    },

    // Tomado los estilos del json
    style: fetch("js/style.json").then(function(res) {
      return res.json();
    }),

    // Nodos y aristas iniciales
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

  // agregando peso y aristas a los arrays globales
  cy.on("ehcomplete", (event, sourceNode, targetNode, addedEles) => {
    let sourceNodeId = sourceNode._private.data.id;
    let targetNodeId = targetNode._private.data.id;
    let newEdge = [sourceNodeId, targetNodeId];
    newEdges.push(newEdge);
    let weight = prompt("Ingrese el peso");
    cy.elements().edges()[
      cy.elements().edges().length - 1
    ]._private.data.label = weight;
    newWeights.push(weight);
  });

  // Dibujando nodo y agregando a array global
  cy.on("tap", function(evt) {
    var tgt = evt.target;
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

  // Eliminando nodo
  cy.on("cxttap", "node", function(evt) {
    var tgt = evt.target;
    const nodeId = tgt._private.data.id;
    const index = newNodes.indexOf(nodeId);
    newNodes.splice(index, 1);

    for (let i = 0; i < newEdges.length; i++) {
      if(newEdges[i].includes(nodeId)) {
        newEdges.splice(i,1)
        newWeights.splice(i, 1)
        i--
      }
    }
    tgt.remove();
  });

  // Boton para reiniciar el canvas
  document.querySelector("#reset").addEventListener("click", function() {
    cy.elements().remove();
    newNodes = [];
    newEdges = [];
    newWeights = [];
  });
});
