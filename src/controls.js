import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ControlsApp from './ControlsApp';
import registerServiceWorker from './registerServiceWorker';

import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.render(<ControlsApp />, document.getElementById('root'));
registerServiceWorker();
