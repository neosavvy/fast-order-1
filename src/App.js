import React, {Component} from 'react';
import cn from 'classnames';
import Gdax from 'gdax';
import CONFIG from './Config';
import './App.css';

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
const sandboxURI = 'https://api-public.sandbox.gdax.com';

class App extends Component {

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
        return (

            <div className="container">
            </div>

        );
    }
}

export default App;
