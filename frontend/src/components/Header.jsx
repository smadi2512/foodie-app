import Logo from "../assets/logo.jpg";
import { useContext } from "react";
import CartContext from "../store/CartContext";
import UserProgressContext from "../store/UserProgressContext";
import Button from "./UI/Button";


export default function Header() {
  const { totalCartItems } = useContext(CartContext); //cart context
  const { showCart } = useContext(UserProgressContext); //userprogress context


  //Show cart modal
  function handleShowCart() {
    showCart();
  }

  return (
    <>
      <header id="main-header">
        <div id="title">
          <img src={Logo} alt="A restaurant" />
          <h1>Foodie</h1>
        </div>
        <nav>
          <Button textOnly onClick={handleShowCart}>
            Cart ({totalCartItems})
          </Button>
        </nav>
      </header>
    </>
  );
}
