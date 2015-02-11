
/* An SVG radial chart built to illustrate the flavors in a cup of coffee.
   Adjustable via range sliders.
   Features to improve:
   * dynamically build out initial flavors
   * allow user to add custom flavors,
   * allow user to name their cup of coffee with details (bean type, grind, type of beverage)
   * use local storage to save past flavors.
   * accessibility updates
   * unit tests
   * use a better design pattern here - singleton probs
*/

'use strict';

var data;
var domainRange = 100,
    // @TODO - improve, these keys assume the flavor matches an ID in the DOM
    keys = ['floral', 'citrus', 'berry', 'chocolate', 'sugar', 'nut', 'grain', 'herb', 'earth'];

var initChartData = function() {
  data = [ { data: {} } ];
  keys.forEach(function(item, index) {
    var availFlavor = document.getElementById(item);
    if (availFlavor) {
      // initial value of each flavor
      data[0].data[keys[index]] = availFlavor.value * domainRange;
    }
  });
};

var buildInitialTaste = function() {
  initChartData();

  d3.select('#chart')
    .datum(data)
    .call(chart);
}

var chart = radialBarChart()
  .barHeight(250)
  .reverseLayerOrder(true)
  .capitalizeLabels(true)
  // @TODO - map colors to flavors in initial data
  .barColors(['#206E4F', '#CCC02B', '#9F572B', '#7C7063', '#D8D5C9', '#BA966B', '#C6B566', '#918821', '#8AA370'])
  .domain([0, domainRange])
  .tickValues([10,20,30,40,50,60,70,80,90,100])
  .tickCircleValues([10,20,30,40,50,60,70,80,90]);


var reflavor = function() {
  var currValue = +this.value,
      currKey = keys.indexOf(this.id);

  // update current slider flavor
  keys.forEach(function(item, index) {
    if (index === currKey) {
      data[0].data[keys[currKey]] = currValue * domainRange;
    }
  });

  // update chart with new flavor
  d3.select('#chart')
    .datum(data)
    .call(chart);
};

// watch for flavor changes
d3.selectAll('input[type=range]')
  .on('input', reflavor);


// kick off the jams
buildInitialTaste();


