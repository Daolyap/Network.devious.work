document.addEventListener('DOMContentLoaded', function() {
  var cy = cytoscape({
    container: document.getElementById('cy'),
    elements: [
      { data: { id: 'a' } },
      { data: { id: 'b' } },
      {
        data: { id: 'ab', source: 'a', target: 'b' }
      }
    ],
    style: [
      {
        selector: 'node',
        style: {
          'background-color': '#666',
          'label': 'data(id)'
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'line-color': '#ccc',
          'target-arrow-color': '#ccc',
          'target-arrow-shape': 'triangle'
        }
      },
      {
        selector: '.bottleneck',
        style: {
            'line-color': 'red',
            'target-arrow-color': 'red',
            'width': 6
        }
      },
      {
        selector: '.traffic',
        style: {
            'background-color': 'blue',
            'line-color': 'blue',
            'target-arrow-color': 'blue',
            'transition-property': 'background-color, line-color, target-arrow-color',
            'transition-duration': '0.5s'
        }
      }
    ],
    layout: {
      name: 'grid',
      rows: 1,
      cols: 2
    }
  });

  var selectedNode = null;

  cy.on('tap', 'node', function(evt){
    var node = evt.target;
    if (selectedNode) {
        if(selectedNode.id() !== node.id()){
            cy.add({
                group: 'edges',
                data: { source: selectedNode.id(), target: node.id() }
            });
        }
      selectedNode.style({ 'border-color': 'black', 'border-width': 0 });
      selectedNode = null;
    } else {
      selectedNode = node;
      selectedNode.style({ 'border-color': 'blue', 'border-width': 3 });
    }
  });


  document.getElementById('add-node').addEventListener('click', function() {
    var id = prompt("Enter node ID");
    if (id) {
      cy.add({
        group: 'nodes',
        data: { id: id }
      });
    }
  });

  document.getElementById('add-edge').addEventListener('click', function() {
    alert("Click on two nodes to create an edge");
  });

  document.getElementById('remove-element').addEventListener('click', function() {
    cy.$(':selected').remove();
  });

  document.getElementById('run-simulation').addEventListener('click', function() {
    // Simulate traffic flow
    cy.edges().forEach(function(edge, i){
        setTimeout(function(){
            edge.addClass('traffic');
            setTimeout(function(){
                edge.removeClass('traffic');
            }, 500);
        }, i * 500);
    });

    // Simulate bottleneck
    setTimeout(function(){
        cy.edges().forEach(function(edge){
            if(Math.random() > 0.5){
                edge.addClass('bottleneck');
            }
        });
    }, cy.edges().length * 500);

    // Simulate network failure
    setTimeout(function(){
        cy.nodes().forEach(function(node){
            if(Math.random() > 0.7){
                node.style({ 'background-color': 'red' });
            }
        });
    }, cy.edges().length * 500 + 1000);
  });
});