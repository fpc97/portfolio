(function() {
  var SVG = {
    createSvgElement: function(name, config) {
      var htmlElement = document.createElementNS("http://www.w3.org/2000/svg", name);
  
      utils.setMultipleAttributes(htmlElement, config);
  
      return htmlElement;
    },
  
    getHexagonPoints: function(x, y, s) {
      var A = [x + s, y];
      var D = [x - s, y];
  
      var B = [x + s * .5, y + s * Math.sin(1.0472)];
      var C = [x - s * .5, y + s * Math.sin(2.0944)];
      var E = [x - s * .5, y + s * Math.sin(4.18879)];
      var F = [x + s * .5, y + s * Math.sin(5.23599)];
  
      var points = [A, B, C, D, E, F];
  
      return points;
    },
  
    createHTMLHexagon: function(x, y, s, config) {
      if (utils.isUndefined(config)) {
        config = {};
      }
      
      config.points = this.getHexagonPoints(x, y, s).flat().join(" ");
  
      return this.createSvgElement("polygon", config);
    }
  }

  function createGrid(config) {
    if (utils.isUndefined(config.spacing)) {
      spacing = 0;
    }
    
    var container = document.getElementById("hex-grid");
    
    var hexagonSide = config.hexagonWidth / 2;
    var hexagonWhitespace = hexagonSide - hexagonSide * Math.cos(0.523599);
    var hexagonDistance = [
      config.hexagonWidth + hexagonSide + config.spacing,
      hexagonSide + config.spacing * .25 - hexagonWhitespace
    ];
    
    var gridDimensions = [
      Math.ceil(config.canvasWidth / hexagonDistance[0]),
      Math.ceil(config.canvasHeight / hexagonDistance[1])
    ];
    
    var gridExcess = [
      config.canvasWidth - gridDimensions[0] * hexagonDistance[0],
      config.canvasHeight - gridDimensions[1] * hexagonDistance[1]
    ];
    
    var centeringOffset = [0, 0];
    
    if (config.center === true) {
      centeringOffset[0] = gridExcess[0] / 2;
      centeringOffset[1] = gridExcess[1] / 2;
    }
    
    var svgGrid = SVG.createSvgElement("svg", {
      "id": "SVG-grid",
      "data-name": "SVG-grid",
      "xmlns": "http://www.w3.org/2000/svg",
      "viewBox": "0 0 " + config.canvasWidth + " " + config.canvasHeight
    });
    
    for (var i = 0; i <= gridDimensions[1]; i++) {
      var odd = !(i % 2);
      var oddOffset = 0;
        
      if (odd) {
        oddOffset = hexagonDistance[0] / 2;
      }
      
      for (var j = 0; j <= gridDimensions[0]; j++) {
        var hexClass

        // if (odd) {
        //   hexClass = 'grid-hex';
        // } else {
        //   hexClass = 'grid-hex';
        // }

        var thisHexagon = SVG.createHTMLHexagon(
          j * hexagonDistance[0] + centeringOffset[0] + oddOffset,
          i * hexagonDistance[1] + centeringOffset[1],
          hexagonSide,
          { class: 'gridhex-' + i + '-' + j }
        );
        
        svgGrid.appendChild(thisHexagon);
      }
    }
    
    container.appendChild(svgGrid);
  }

  createGrid({
    canvasWidth: 1000,
    canvasHeight: 1000,
    hexagonWidth: 80,
    spacing: 12,
    center: true
  });
})()