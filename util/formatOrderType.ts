export const formatOrderType = (type: any) => {
    switch (type) {
      case "STOP":
        return "Stop Limit";
      case "TAKE_PROFIT":
        return "Take Profit";
      case "STOP_MARKET":
        return "Stop Market";
      case "TAKE_PROFIT_MARKET":
        return "Take Profit Market";
      case "SELL":
        return "Sell";
      case "BUY":
        return "Buy";
      default:
        return type;
    }
  };

  export const formatStopPrice = (type: any, orderType: string, stopPrice: number) => {
    switch(type) {
       case "TAKE_PROFIT_MARKET":
        if(orderType === "BUY") {
          return {prefix: "<= ", value: stopPrice};
        }
        case "TAKE_PROFIT_MARKET":
        if(orderType === "SELL") {
          return {prefix: ">= ", value: stopPrice};
        }
        case "TAKE_PROFIT":
          if(orderType === "BUY") {
            return {prefix: "<= ", value: stopPrice};
          }
        case "TAKE_PROFIT":
        if(orderType === "SELL") {
          return {prefix: ">= ", value: stopPrice};
        }
        case "STOP_MARKET":
          if(orderType === "BUY") {
            return {prefix: ">= ", value: stopPrice};
          }
        case "STOP_MARKET":
        if(orderType === "SELL") {
          return {prefix: "<= ", value: stopPrice};
        }
       case "STOP":
        if(orderType === "BUY") {
          return {prefix: ">= ", value: stopPrice};
        }
        case "STOP":
        if(orderType === "SELL") {
          return {prefix: "<= ", value: stopPrice};
        }
       default:
       break;
    }
    return {prefix: "", value: stopPrice};
  }
  
  