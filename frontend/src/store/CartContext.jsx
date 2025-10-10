import { createContext, useMemo, useReducer } from "react";

// Initial state
const initialCartState = { items: [] };

// Create context object
const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
  totalCartItems: 0,
  totalAmount: 0,
});

// Reducer function
function cartReducer(state, action) {
  if (action.type === "ADD_ITEM") {
    //Check if the item is already found in cart
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.item.id
    );
    const updatedItems = [...state.items];

    if (existingCartItemIndex > -1) {
      //Update the quantity of the item inside the cart.
      const existingItem = state.items[existingCartItemIndex];
      const updatedItem = {
        ...existingItem,
        quantity: existingItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      //Add new item to the cart
      updatedItems.push({ ...action.item, quantity: 1 });
    }
    //return the latest updated state
    return { ...state, items: updatedItems };
  }

  if (action.type === "REMOVE_ITEM") {
    const existingCartItemIndex = state.items.findIndex(
      (item) => item.id === action.id
    );
    const existingCartItem = state.items[existingCartItemIndex];
    const updatedItems = [...state.items];
    if (existingCartItem.quantity === 1) {
      updatedItems.splice(existingCartItemIndex, 1);
    } else {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity - 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    }
    //return the latest updated state
    return { ...state, items: updatedItems };
  }

  if (action.type === "CLEAR_CART") {
    return { ...state, items: [] };
  }

  return state;
}

// Provider component
export function CartContextProvider({ children }) {
  const [cartState, dispatch] = useReducer(cartReducer, initialCartState);

  const addItem = (item) => dispatch({ type: "ADD_ITEM", item });
  const removeItem = (id) => dispatch({ type: "REMOVE_ITEM", id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  //Calculate the total amount
  const totalAmount = useMemo(
    () =>
      cartState.items.reduce((totalPrice, item) => {
        return totalPrice + item.quantity * item.price;
      }, 0),
    [cartState.items]
  );

  //Calculate the total cart items
  const totalCartItems = useMemo(
    () =>
      cartState.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
      }, 0),
    [cartState.items]
  );

  // Memoized context value
  const cartContext = useMemo(
    () => ({
      items: cartState.items,
      addItem,
      removeItem,
      clearCart,
      totalCartItems,
      totalAmount,
    }),
    [cartState.items, totalCartItems, totalAmount]
  );

  return (
    <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
  );
}

export default CartContext;
