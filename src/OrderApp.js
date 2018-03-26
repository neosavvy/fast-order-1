import React, {Component} from 'react';
import cn from 'classnames';
//import AuthUtils from 'gdax-trade-client/src/util/authentication.util'
import Gdax from 'gdax';
import _ from 'lodash';

import './App.css';


const BUY = 'BUY';
const SELL = 'SELL';

const EXCHANGE_GDAX = "GDAX";
const EXCHANGE_BITTREX = "BITTREX";
const EXCHANGE_BINANCE = "BINANCE";

const ORDER_TYPE_MARKET = "MARKET";
const ORDER_TYPE_LIMIT = "LIMIT";
const ORDER_TYPE_STOP_LOSS = "STOP_LOSS";

const CRED = {
    "key": "b7ed535d1496aad6bcfc1adcebef2372",
    "secret": "d/I4TKRc7u0oJd+psjf5u024t1LhpkP6O2IQrGP4sb62R6D0jiIHTxhVJrYVdck8SjXYys/U7wgsLJ24JgNR3w==",
    "passphrase": "entente-baronage-camomile"
};
const apiURI = 'https://api.gdax.com';
const sandboxURI = 'https://api-public.sandbox.gdax.com';

class OrderApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exchangeRoute: EXCHANGE_GDAX,
            side: "BUY",
            currencyPair: 'select',
            orderType: "MARKET",
            size: 0,
            limitPrice: null,
        };
    }

    async componentDidMount() {
        const client = new Gdax.PublicClient();
        const products = await client.getProducts();
        this.setState({
            products
        });
    }

    onExchangeChange = (exchange) => {
        this.setState({
            exchangeRoute: exchange
        })
    };

    onSideChange = (side) => {
        this.setState({
            side
        })
    };

    onOrderTypeChange = (orderType) => {
        this.setState({
            orderType
        })
    };

    onCurrencyPairChange = (event) => {
        this.setState({
            currencyPair: event.target.value
        });
    };

    onAmountChange = (event) => {
        this.setState({
            size: event.target.value
        });
    };

    onLimitChange = (event) => {
        this.setState({
            limitPrice: event.target.value
        });
    };


    determineClassForPredicate = ( predicateFn, base ) => {
        return cn({
            ...base,
            'active': predicateFn()
        });
    };

    sendOrder = async () => {
        const client = new Gdax.AuthenticatedClient(
            CRED.key,
            CRED.secret,
            CRED.passphrase,
            apiURI
        );


        const params = {
            side: this.state.side.toLowerCase(),
            price: this.state.limitPrice, // USD
            size: this.state.size, // BTC, BCH, ETH, LTC
            product_id: this.state.currencyPair,
            post_only: true
        };
        const orderConfirmation = await client.placeOrder(params);
        console.log("Order Confirmation: ", orderConfirmation);
        //
        // const accounts = await client.getCoinbaseAccounts();
        // console.log("accounts: ", accounts);

    };

    render() {
        const orderTicketClass = cn({
            'alert': true,
            'alert-danger': this.state.side === SELL,
            'alert-success': this.state.side === BUY
        });


        const gdaxClass = cn({
            "btn": true,
            "btn-secondary": true,
            "active": this.state.exchangeRoute === EXCHANGE_GDAX
        });

        const bittrexClass = cn({
            "btn": true,
            "btn-secondary": true,
            "active": this.state.exchangeRoute === EXCHANGE_BITTREX
        });

        const binanceClass = cn({
            "btn": true,
            "btn-secondary": true,
            "active": this.state.exchangeRoute === EXCHANGE_BINANCE
        });

        const orderClassBuy = this.determineClassForPredicate(() => {this.state.side === BUY}, {"btn": true, 'btn-success': true});
        const orderClassSell = this.determineClassForPredicate(() => {this.state.side === SELL}, {"btn": true, 'btn-danger': true});
        const marketClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_MARKET}, {"btn": true, 'btn-secondary': true});
        const limitClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_LIMIT}, {"btn": true, 'btn-secondary': true});
        const stopLossClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_STOP_LOSS}, {"btn": true, 'btn-secondary': true});

        return (

            <div className="container">
                <div>&nbsp;</div>
                <div className="alert alert-dark" role="alert">
                    <div className="row justify-content-center">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={gdaxClass}>
                                <input
                                    onChange={() => { this.onExchangeChange(EXCHANGE_GDAX)}}
                                    type="radio"
                                    name="exchangeOptions"
                                    id={EXCHANGE_GDAX}
                                    autocomplete="off"/>{EXCHANGE_GDAX}
                            </label>
                            <label className={bittrexClass}>
                                <input
                                    onChange={() => { this.onExchangeChange(EXCHANGE_BITTREX)}}
                                    type="radio"
                                    name="exchangeOptions"
                                    id={EXCHANGE_BITTREX}
                                    autocomplete="off"/>{EXCHANGE_BITTREX}
                            </label>
                            <label className={binanceClass}>
                                <input
                                    onChange={() => { this.onExchangeChange(EXCHANGE_BINANCE)}}
                                    type="radio"
                                    name="exchangeOptions"
                                    id={EXCHANGE_BINANCE}
                                    autocomplete="off"/>{EXCHANGE_BINANCE}
                            </label>
                        </div>
                    </div>
                    <div>&nbsp;</div>
                    <div className="row justify-content-center">
                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={orderClassSell}>
                                <input
                                    onClick={() => {this.onSideChange('SELL')}}
                                    type="radio" name="sideOptions" id="option1" autocomplete="off"/>{SELL}
                            </label>
                            <label className={orderClassBuy}>
                                <input
                                    onClick={() => {this.onSideChange('BUY')}}
                                    type="radio" name="sideOptions" id="option2" autocomplete="off"/>{BUY}
                            </label>
                        </div>
                    </div>
                </div>

                <div className={orderTicketClass} role="alert">
                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Currency Pair</span>
                        </div>
                        <select
                            onChange={this.onCurrencyPairChange}
                            value={this.state.currencyPair}
                            className="form-control">
                            {
                                _.map(this.state.products, (p) => {
                                    return <option id={p.id}>{p.id}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="input-group mb-3">

                        <div className="btn-group btn-group-toggle" data-toggle="buttons">
                            <label className={marketClass}>
                                <input
                                    onChange={() => { this.onOrderTypeChange(ORDER_TYPE_MARKET)}}
                                    type="radio"
                                    name="orderTypeOptions"
                                    id={ORDER_TYPE_MARKET}
                                    autocomplete="off"/>{ORDER_TYPE_MARKET}
                            </label>
                            <label className={limitClass}>
                                <input
                                    onChange={() => { this.onOrderTypeChange(ORDER_TYPE_LIMIT)}}
                                    type="radio"
                                    name="orderTypeOptions"
                                    id={ORDER_TYPE_LIMIT}
                                    autocomplete="off"/>{ORDER_TYPE_LIMIT}
                            </label>
                            <label className={stopLossClass}>
                                <input
                                    onChange={() => { this.onOrderTypeChange(ORDER_TYPE_STOP_LOSS)}}
                                    type="radio"
                                    name="orderTypeOptions"
                                    id={ORDER_TYPE_STOP_LOSS}
                                    autocomplete="off"/>{ORDER_TYPE_STOP_LOSS}
                            </label>
                        </div>
                    </div>

                    <div className="input-group mb-3">
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">Amount</span>
                        </div>
                        <input
                            onChange={this.onAmountChange}
                            type="text"
                            className="form-control"
                            placeholder="Enter Size"/>
                    </div>

                    {
                        this.state.orderType === ORDER_TYPE_LIMIT ?
                            <div className="input-group mb-3">
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon1">Limit Price</span>
                                </div>
                                <input
                                    onChange={this.onLimitChange}
                                    type="text"
                                    className="form-control"
                                    placeholder="7000.00"/>
                            </div> : null

                    }

                    <div className="input-group mb-3">
                        <button type="button" className="btn btn-secondary" onClick={this.sendOrder}>SEND ORDER</button>
                    </div>
                </div>
            </div>

        );
    }
}

export default OrderApp;
