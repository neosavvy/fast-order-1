import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import OrderApp from './OrderApp';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.render(<OrderApp />, document.getElementById('root'));
registerServiceWorker();
