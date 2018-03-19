# Fast Order Tools (MVP)
  
  As a trader in the crypto-currency market you need to be able to take advantage of rapid price movement by submitting trades without the use of your keyboard. Successful equity market traders have numerous hot keys mapped to order modification commands. 
  
  For the immediate term this tool will only be for order entry and will not enable Positions Management, Order Management, Trade History and Account Balances. Those features will be exposed through current features of the exchanges the trader is issuing trades on.
  
  We need to be able to run the application locally on a desktop not via web interface as speed and responsiveness of the interface will be incredibly critical for this application. 
  
  The following commands will be required in the onset of this application
   * Ctrl O - should open a new order entry window
   * Ctrl Tab - should switch focus between OE windows
   * Ctrl S or Ctrl B - should set the ticket as a Sell or Buy ticket
   * Ctrl E - should iterate through exchanges on focused OE Window
   * Ctrl P <currencyPair> - should auto filter and help set the currency pair for an exchange
   * Ctrl j and Ctrl k - increase / decrease quantity by 1%
   * Ctrl l and Ctrl ; - increase / decrease quantity by 10%
   * Ctrl t - iterates through Market, Limit, and Stop Loss Orders
   * Ctrl X - Executes / Sends to the exchange 
  
  Orders should be submitted to a FIX Order Handler internally on our client application. Order Management for user side orders should also be handled via FIX (cancel orders for example, and display of order status/fills)
  
  Price Action, Portfolio Balance Display across exchanges, and generally low priority data should be managed via a WebSocket. 
  
  We should generally avoid calling the REST API in this application, as it can at times result in rate limiting our client by IP address, which would result in incredibly unreliable order execution. 
  
  
  We will create a single order handler that adapts our client side order object into each exchange’s order object and submission protocol may it be FIX, WebSocket or REST. We will favor the protocols in the order of FIX, WebSocket then REST to ensure highest reliability and fastest execution. 


### HELPFUL DEV NOTES

- Kill all open electron windows 
```
kill -9 `ps aux | awk '/[e]lectron/{print $2}'`
```