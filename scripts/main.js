
/* An SVG radial chart built to illustrate the flavors in a cup of coffee.
   Adjustable via range sliders.
   Features to improve:
   * allow user to add custom flavors,
   * allow user to name their cup of coffee with details (bean type, grind, type of beverage)
   * use local storage to save past flavors.
   * accessibility updates
   * unit tests
   * use a better design pattern here - singleton probs
*/

'use strict';

var data,
    coffeeInputs,
    coffeeColors = [],
    domainRange = 100;

var initChartData = function(formId) {
  // data array used to build D3 chart
  data = [ { data: {} } ];

  // convert array-like inputs to array
  coffeeInputs = Array.prototype.slice.call(document.forms[formId].elements, 0);

  coffeeInputs.forEach(function(item, index) {
    var flavor = item.getAttribute('data-flavor'),
        color = item.getAttribute('data-color');

    if (data && color) {
      data[0].data[flavor] = item.value * domainRange;

      // coffee colors push to own array, want to be able to
      // keep colors as an option potentially
      coffeeColors.push(color);
    } else {
      // both flavor and color are a current requirement for any
      // default input
      throw new Error('Inputs need color and flavor.');
    }
  });
};

var buildInitialTaste = function() {
  // chart assumes default coffee flavors and colors are input
  // elements in the DOM
  var formId = 'coffees';

  initChartData(formId);

  d3.select('#chart')
    .datum(data)
    .call(chart);
}

var chart = radialBarChart()
  .barHeight(250)
  .reverseLayerOrder(true)
  .capitalizeLabels(true)
  .barColors(coffeeColors)
  .domain([0, domainRange])
  .tickValues([10,20,30,40,50,60,70,80,90,100])
  .tickCircleValues([10,20,30,40,50,60,70,80,90]);


var reflavor = function() {
  var currValue =  parseFloat(this.value),
      currKey =    coffeeInputs.indexOf(this),
      currFlavor = this.getAttribute('data-flavor');

  // @TODO - quick `isNan` and over max value check -
  // need to refactor once defaults are finalized for
  // supported HTML and max values
  currValue = isNaN(currValue) ? 0 : currValue;
  currValue = currValue > 1.0 ? 1.0 : currValue;

  // update current slider flavor
  coffeeInputs.forEach(function(item, index) {
    if (index === currKey) {
      data[0].data[currFlavor] = currValue * domainRange;
    }
  });

  // update chart with new flavor
  d3.select('#chart')
    .datum(data)
    .call(chart);
};

// watch for flavor changes
d3.selectAll('input')
  .on('input', reflavor);

// kick off the jams
buildInitialTaste();


