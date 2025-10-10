import { createContext, useMemo, useReducer, useState } from "react";

// Initial state
const initialState = { progress: "idle" }; // 'idle' | 'cart' | 'checkout' | 'success'

// Create context object
const UserProgressContext = createContext({
  progress: "idle",
  showCart: () => {},
  hideCart: () => {},
  showCheckout: () => {},
  hideCheckout: () => {},
});

// Reducer function
function userProgressReducer(state, action) {
  switch (action.type) {
    case "SHOW_CART":
      return { progress: "cart" };
    case "SHOW_CHECKOUT":
      return { progress: "checkout" };
    case "SHOW_SUCCESS":
      return { progress: "success" };
    case "HIDE":
      return { progress: "idle" };
    default:
      return state;
  }
}

// Provider component
export function UserProgressContextProvider({ children }) {
  const [userProgressState, dispatch] = useReducer(userProgressReducer, initialState);

  const showCart = () => dispatch({ type: "SHOW_CART" });
  const hideCart = () => dispatch({ type: "HIDE" });
  const showCheckout = () => dispatch({ type: "SHOW_CHECKOUT" });
  const hideCheckout = () => dispatch({ type: "HIDE" });
  const showSuccess = () => dispatch({ type: "SHOW_SUCCESS" });

  const isCartOpen = userProgressState.progress === "cart";
  const isCheckoutOpen = userProgressState.progress === "checkout";

  // Memoized context value
  const userProgressContext = useMemo(
    () => ({
      progress: userProgressState.progress,
      showCart,
      hideCart,
      showCheckout,
      hideCheckout,
      showSuccess,
      isCartOpen,
      isCheckoutOpen,
    }),
    [userProgressState.progress, isCartOpen, isCheckoutOpen]
  );

  return (
    <UserProgressContext.Provider value={userProgressContext}>
      {children}
    </UserProgressContext.Provider>
  );
}

export default UserProgressContext;
