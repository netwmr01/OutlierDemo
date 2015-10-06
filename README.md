# OutlierDemo

## Backend

## Frontend

### Dependencies
*  [AngularJS](https://angularjs.org/) is used for general interation with the site and comunication with various parts of the page. 
* [D3.js](http://d3js.org/) is used for the visualization of the data.

### File Structure
The landing pages can be found in the \src\main\resources\templates folder. The rest of the files for the front end can be found under the \src\main\webapp\resources\lib directory.
 
 *  app.js: This initializes the angular module _indexApp_
 * Controllers: contains the angular controllers which handles the visual logic of th site 
 * Directives: contains the angular directives which handles one time setup of various web elements
 * Services: conains angular directives which handles the comunication between controllers and AJAX requests
 * Styles: contains CSS files for web page styling
 * Templates: contains HTML Snippets. 
 * Vender: Various vender libraries/

# TODO
* Move code around to mroe closely follow file structure paradigm listed above. ie. Directives only handle setup and all AJAX requests go through Services and Directives and Controllers get data from services. 
