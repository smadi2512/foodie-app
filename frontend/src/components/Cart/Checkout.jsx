import { useContext } from "react";
import UserProgressContext from "../../store/UserProgressContext";
import CartContext from "../../store/CartContext";
import Input from "../UI/Input";
import Button from "../UI/Button";
import Modal from "../UI/Modal";
import Error from "../UI/Error";
import useHttp from "../../hooks/useHttp";
import { currencyFormatter } from "../../util/formatting";

const requestConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}; //Should be here so will be created once.

export default function Checkout() {
  const {
    clearCart,
    totalAmount: cartTotal,
    items: cartItems,
  } = useContext(CartContext); //cart context
  const { hideCheckout, isCheckoutOpen } = useContext(UserProgressContext); //userprogress context

  const {
    data,
    isLoading: isSending,
    error,
    sendRequest,
    clearData,
  } = useHttp("http://localhost:3000/orders", requestConfig);

  //Close checkout modal
  function handleCloseCheckout() {
    hideCheckout();
  }

  //finish checkout process
  function handleFinish() {
    hideCheckout();
    clearCart();
    clearData();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target); //get the FormData object
    const customerData = Object.fromEntries(fd.entries()); //convert an array of key-value pairs into an object.
    sendRequest({
      order: {
        items: cartItems,
        customer: customerData,
      },
    });
  }

  let actions = (
    <>
      <Button type="button" textOnly onClick={handleCloseCheckout}>
        Close
      </Button>
      <Button>Submit Order</Button>
    </>
  );

  if (isSending) {
    actions = <span>Sending order data...</span>;
  }

  if (data && !error) {
    return (
      <Modal open={isCheckoutOpen} onClose={handleFinish}>
        <h2>Yay! Your order is on the way 🍔</h2>
        <p>Thanks for ordering with Foodie!</p>
        <p>We've received your order and will send you an update soon.</p>
        <p className="modal-actions">
          <Button onClick={handleFinish}>Okay</Button>
        </p>
      </Modal>
    );
  }

  return (
    <Modal
      className="checkout"
      open={isCheckoutOpen}
      onClose={handleCloseCheckout}
    >
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input type="text" label="Full Name" id="name" />
        <Input type="email" label="E-Mail Address" id="email" />
        <Input type="text" label="Street" id="street" />
        <div className="control-row">
          <Input type="text" label="Postal Code" id="postal-code" />
          <Input type="text" label="City" id="city" />
        </div>
        {error && <Error title="Failed to send your order" message={error} />}
        <p className="modal-actions">{actions}</p>
      </form>
    </Modal>
  );
}
