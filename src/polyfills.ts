/* BROWSER POLYFILLS
*/

/** IE9, IE10 and IE11 requires all of the following polyfills. **/
 import 'core-js/es6/symbol';
import 'core-js/es6/object';
import 'core-js/es6/function';
import 'core-js/es6/parse-int';
import 'core-js/es6/parse-float';
import 'core-js/es6/number';
import 'core-js/es6/math';
import 'core-js/es6/string';
import 'core-js/es6/date';
import 'core-js/es6/array';
import 'core-js/es6/regexp';
import 'core-js/es6/map';
import 'core-js/es6/weak-map';
import 'core-js/es6/set';
import 'core-js/es6/reflect';
import 'core-js/client/shim';

/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.

/** IE10 and IE11 requires the following to support `@angular/animation`. */
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.

/***************************************************************************************************
* Zone JS is required by Angular itself.
*/
 import 'zone.js/dist/zone';  // Included with Angular CLI.

/***************************************************************************************************
* APPLICATION IMPORTS
*/

/* polyfill ie11 */
// import 'core-js/es7/array';
// import 'core-js/es7/reflect';

/**
 * Date, currency, decimal and percent pipes.
 * Needed for: All but Chrome, Firefox, Edge, IE11 and Safari 10
 */
// Run `npm install --save intl`.
// import 'intl'; 
// import 'intl/locale-data/complete.js';
// import 'intl/locale-data/jsonp/en.js';

// if (typeof SVGElement.prototype.contains == 'undefined') {
//     SVGElement.prototype.contains = HTMLDivElement.prototype.contains;
// }

/* As project is compiled to serve ES5 to all browsers, ES5-style classes cannot properly extend ES6 
classes creates problem in chrome therefore need below adapter */

import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';
