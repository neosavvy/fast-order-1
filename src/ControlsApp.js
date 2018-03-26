import React, {Component} from 'react';

import './App.css';

class ControlsApp extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (

            <div class="container-fluid">

                <div class="row align-items-center">

                    <div class="input-group">
                        <select class="custom-select" id="inputGroupSelect04">
                            <option selected>Select Currency Pair...</option>
                            <option value="1">BTC-USD</option>
                            <option value="2">ETH-USD</option>
                            <option value="3">BCH-USD</option>
                            <option value="4">LTC-USD</option>
                        </select>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary" type="button">Open Chart</button>
                            <button class="btn btn-danger" type="button">New Sell Order</button>
                            <button class="btn btn-success" type="button">New Buy Order</button>
                        </div>
                    </div>

                </div>
            </div>

        );
    }
}

export default ControlsApp;
