import React, {Component} from 'react';
import cn from 'classnames';
import Gdax from 'gdax';
import _ from 'lodash';
import CONFIG from './Config';
import './App.css';
import {HotKeys} from 'react-hotkeys';

const CRED = CONFIG.CRED;


const BUY = 'BUY';
const SELL = 'SELL';

const EXCHANGE_GDAX = "GDAX";
const EXCHANGE_BITTREX = "BITTREX";
const EXCHANGE_BINANCE = "BINANCE";

const ORDER_TYPE_MARKET = "MARKET";
const ORDER_TYPE_LIMIT = "LIMIT";
const ORDER_TYPE_STOP_LOSS = "STOP_LOSS";

const apiURI = 'https://api.gdax.com';


class OrderApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exchangeRoute: EXCHANGE_GDAX,
            side: "BUY",
            currencyPair: 'select',
            orderType: "MARKET",
            size: 0,
            limitPrice: 0,
        };
    }

    componentDidUpdate(prevProps) {
        if(!prevProps.isFocused && this.props.isFocused) {
            this._container.focus();
        }
    }

    async componentDidMount() {
        const client = new Gdax.PublicClient();
        const products = await client.getProducts();
        this.setState({
            products,
            client
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
            product_id: _.get(this.state.currencyPair, "id", this.state.currencyPair),
            post_only: true
        };

        const orderConfirmation = await client.placeOrder(params);
        console.log("Order Confirmation: ", orderConfirmation);

    };

    increaseQuantity = (percentageOrAmount, isPercent = true) => {
        const percentAsFloat = Number(percentageOrAmount / 100);
        const currentQuantity = this.state.size;
        if(isPercent) {
            this.setState({
                size: Math.round(currentQuantity * (1 + percentAsFloat))
            });
        } else {
            this.setState({
                size: Math.round(currentQuantity + percentageOrAmount)
            });
        }
    };

    decreaseQuantity = (percentageOrAmount, isPercent = true) => {
        const percentAsFloat = Number(percentageOrAmount / 100);
        const currentQuantity = this.state.size;
        if(isPercent) {
            this.setState({
                size: Math.round(currentQuantity * (1 - percentAsFloat))
            });
        } else {
            this.setState({
                size: Math.round(currentQuantity - percentageOrAmount)
            });
        }
    };

    increasePrice = (percentageOrAmount, isPercent = true) => {
        const percentAsFloat = Number(percentageOrAmount / 100);
        const currentLimitPrice = this.state.limitPrice;
        if(isPercent) {
            this.setState({
                limitPrice: Math.round(currentLimitPrice * (1 + percentAsFloat))
            });
        } else {
            this.setState({
                limitPrice: Math.round(currentLimitPrice + percentageOrAmount)
            });
        }
    };

    decreasePrice = (percentageOrAmount, isPercent = true) => {
        const percentAsFloat = Number(percentageOrAmount / 100);
        const currentLimitPrice = this.state.limitPrice;
        if(isPercent) {
            this.setState({
                limitPrice: Math.round(currentLimitPrice * (1 - percentAsFloat))
            });
        } else {
            this.setState({
                limitPrice: Math.round(currentLimitPrice - percentageOrAmount)
            });
        }
    };

    iterateOrderType = () => {
        const orderTypes = [
            ORDER_TYPE_MARKET,
            ORDER_TYPE_LIMIT,
            ORDER_TYPE_STOP_LOSS
        ];
        const current = this.state.orderType;
        const currentIndex = _.findIndex(orderTypes, (e) => {return e === current});
        const nextIndex = _.size(orderTypes) === currentIndex + 1 ? 0 : currentIndex + 1;
        this.setState({
            orderType: orderTypes[nextIndex]
        });
    };

    iterateExchange = () => {
        const exchanges = [EXCHANGE_GDAX, EXCHANGE_BITTREX, EXCHANGE_BINANCE];
        const current = this.state.exchangeRoute;
        const currentIndex = _.findIndex(exchanges, (e) => {return e === current});
        const nextIndex = _.size(exchanges) === currentIndex + 1 ? 0 : currentIndex + 1;
        this.setState({
            exchangeRoute: exchanges[nextIndex]
        });
    };

    toggleOrderType = () => {
        if(this.state.side === 'BUY') {
            this.onSideChange('SELL');
        } else if(this.state.side === 'SELL') {
            this.onSideChange('BUY');
        }
    };

    iterateCurrency = () => {
        const products = this.state.products;
        const current = this.state.currencyPair;
        const currentIndex = _.findIndex(products, (e) => {
            return e.id === current.id
        });
        const nextIndex = _.size(products) === currentIndex + 1 ? 0 : currentIndex + 1;
        const price = 400;//await this.state.client.getProductTicker(products[nextIndex]);
        this.setState({
            currencyPair: products[nextIndex],
            limitPrice: price
        });
    }

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

        const keyMap = {
            increaseQuantity: 'up',
            decreaseQuantity: 'down',
            increaseQuantity10: 'shift+up',
            decreaseQuantity10: 'shift+down',
            increaseQuantity100: 'command+shift+up',
            decreaseQuantity100: 'command+shift+down',
            increasePrice: 'right',
            decreasePrice: 'left',
            increasePrice10: 'shift+right',
            decreasePrice10: 'shift+left',
            increasePrice100: 'command+shift+right',
            decreasePrice100: 'command+shift+left',
            iterateOrderType: 'command+o',
            iterateExchange: 'command+e',
            toggleOrderType: 'command+s',
            iterateCurrency: 'command+c',
            executeOrder: 'command+x',
            executeOrder: 'control+x',
        };

        const handlers = {
            'increaseQuantity': () => this.increaseQuantity(1, false),
            'decreaseQuantity': () => this.decreaseQuantity(1, false),
            'increaseQuantity10': () => this.increaseQuantity(5),
            'decreaseQuantity10': () => this.decreaseQuantity(5),
            'increaseQuantity100': () => this.increaseQuantity(10),
            'decreaseQuantity100': () => this.decreaseQuantity(10),

            'increasePrice': () => this.increasePrice(1, false),
            'decreasePrice': () => this.decreasePrice(1, false),
            'increasePrice10': () => this.increasePrice(5),
            'decreasePrice10': () => this.decreasePrice(5),
            'increasePrice100': () => this.increasePrice(10),
            'decreasePrice100': () => this.decreasePrice(10),

            'iterateOrderType': () => this.iterateOrderType(),
            'iterateExchange': () => this.iterateExchange(),
            'toggleOrderType': () => this.toggleOrderType(),
            'iterateCurrency': () => this.iterateCurrency(),

            'executeOrder': () => this.sendOrder()
        };


        const orderClassBuy = this.determineClassForPredicate(() => {this.state.side === BUY}, {"btn": true, 'btn-success': true});
        const orderClassSell = this.determineClassForPredicate(() => {this.state.side === SELL}, {"btn": true, 'btn-danger': true});
        const marketClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_MARKET}, {"btn": true, 'btn-secondary': true});
        const limitClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_LIMIT}, {"btn": true, 'btn-secondary': true});
        const stopLossClass = this.determineClassForPredicate(() => {this.state.orderType === ORDER_TYPE_STOP_LOSS}, {"btn": true, 'btn-secondary': true});

        return (

            <HotKeys
                keyMap={keyMap}
                handlers={handlers}
            >

            <div ref={ (c) => {this._container = c}}
                className="container">
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
                                    type="radio" name="sideOptions" id="option1" autoComplete="off"/>{SELL}
                            </label>
                            <label className={orderClassBuy}>
                                <input
                                    onClick={() => {this.onSideChange('BUY')}}
                                    type="radio" name="sideOptions" id="option2" autoComplete="off"/>{BUY}
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
                            value={this.state.currencyPair ? this.state.currencyPair.id : null}
                            className="form-control">
                            {
                                _.map(this.state.products, (p) => {
                                    return <option id={p.id} value={p.id}>{p.id}</option>
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
                            value={this.state.size}
                            onChange={this.onAmountChange}
                            type="numeric"
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
                                    value={this.state.limitPrice}
                                    onChange={this.onLimitChange}
                                    type="numeric"
                                    className="form-control"
                                    placeholder="Enter Price"/>
                            </div> : null

                    }

                    <div className="input-group mb-3">
                        <button type="button" className="btn btn-secondary" onClick={this.sendOrder}>SEND ORDER</button>
                    </div>
                </div>
            </div>

            </HotKeys>

        );
    }
}

export default OrderApp;
