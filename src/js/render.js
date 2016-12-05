//'use strict';

import '../stylesheets/main.scss';
import ReactDOM from 'react-dom';
import routes from './routes.jsx';

main();

function main() {
  console.log('main() has been run');
  console.log('rendering routes to app');
  ReactDOM.render(routes, document.getElementById('app'));
}

if (module.hot) {
  console.log('module is hot');
  module.hot.accept();
  module.hot.dispose(function() {

  });
}
