import CancelButton from "./buttonCancelOrder";

type Order = {
  symbol: string;
  orderId: number;
  price: number;
  stopPrice: number;
};

type OrderDataRowProps = {
  order: Order;
};

export default function OrderDataRow({ order }: OrderDataRowProps) {
  return (
    <div>
      <div>Symbol: {order.symbol}</div>
      <div>Order ID: {order.orderId}</div>
      <div>Price: {order.price}</div>
      <div>Stop Price: {order.stopPrice}</div>
      <CancelButton symbol={order.symbol} orderId={order.orderId} />
    </div>
  );
}
