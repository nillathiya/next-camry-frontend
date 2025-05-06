import {
  Checkout,
  EmptyCart,
  Gotoyourcart,
  Href,
  ImagePath,
  OrderTotal,
} from "@/constants";
import { cartHeaderData } from "@/data/layout/RightHeader";
import { useAppSelector } from "@/redux-toolkit/Hooks";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Minus, Plus, Trash2 } from "react-feather";
import { Button, Input } from "reactstrap";

const CartHeaderList = () => {
  const [items, setItems] = useState(cartHeaderData);

  const handleIncrement = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const handleDecrement = (id: number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setItems(updatedItems);
  };
  const handleDelete = (id: number) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
  };
  return (
    <ul className="cart-main-wrapper simple-list">
      {items.length > 0 ? (
        <>
          {items.map((item) => (
            <li className="cart-product" key={item.id}>
              <div className="d-flex">
                <img
                  className="img-fluid b-r-5 me-3 img-60"
                  src={`${ImagePath}/other-images/cart-${item.image}`}
                  alt="cosmetic"
                />
                <div className="flex-grow-1">
                  <span className="f-w-500">{item.name}</span>
                  <div className="qty-box">
                    <div className="touchspin-wrapper d-flex flex-row">
                      <Button
                        className="decrement-touchspin btn-touchspin"
                        onClick={() => handleDecrement(item.id)}
                      >
                        <Minus />
                      </Button>
                      <Input
                        className="input-touchspin"
                        id="inputData"
                        type="number"
                        value={item.quantity}
                        readOnly
                      />
                      <Button
                        className="increment-touchspin btn-touchspin"
                        onClick={() => handleIncrement(item.id)}
                      >
                        <Plus />
                      </Button>
                    </div>
                    <h6 className="font-primary">
                      {"$"}
                      {item.price * item.quantity}{" "}
                    </h6>
                  </div>
                </div>
                <div className="close-circle">
                  <a href={Href} onClick={() => handleDelete(item.id)}>
                    <Trash2 />
                  </a>
                </div>
              </div>
            </li>
          ))}
          <li className="total">
            <h6 className="mb-0">
              {OrderTotal}{" "}
              <span className="f-right">
                {"$" +
                  items.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                  )}
              </span>
            </h6>
          </li>
          <li className="text-center">
            <Link
              className="d-block mb-3 view-cart f-w-700"
              href={`/applications/ecommerce/cart`}
            >
              {Gotoyourcart}
            </Link>
            <Link
              className="btn btn-primary view-checkout w-100"
              href={`/applications/ecommerce/checkout`}
            >
              {Checkout}
            </Link>
          </li>
        </>
      ) : (
        <div className={`cart-empty ${items.length === 0 ? "show" : ""}`}>
          <div className="cart-image">
            <Image
              height={60}
              width={60}
              className="img-fluid"
              src={`${ImagePath}/product/order-trash.gif`}
              alt="empty"
            />
          </div>
          <h5>{EmptyCart}</h5>
        </div>
      )}
    </ul>
  );
};
export default CartHeaderList;
