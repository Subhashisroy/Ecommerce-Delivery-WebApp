import React from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
    const [auth, setAuth] = useAuth()
    const [cart, setCart] = useCart()
    const navigate = useNavigate()

    // Total Price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.map((item) => {
                total = total + item.price;
            })
            return total.toLocaleString('en-us', {
                style: 'currency',
                currency: 'USD',
            });
        } catch (error) {
            console.log(error)
        }
    }

    // Detele Item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex((item) => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart', JSON.stringify(myCart));
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Layout>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h2 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h2>
                        <h4 className='text-center'>
                            {cart?.length ?
                                `You have ${cart.length} items in your cart
                                 ${auth?.token ? ""
                                    : "Please login to checkout"}`
                                : "Your Cart is Empty"}
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-6'>
                        {cart?.map((p) => (
                            <div className='row mb-2 card flex-row'>
                                <div className='col-md-4'>
                                    <img src={`/api/v1/product/get-photo/${p._id}`}
                                        className="card-img-top" alt={p.name} />
                                </div>
                                <div className='col-md-4 mt-3'>
                                    <h6> {p.name} </h6>
                                    <h6> {p.description} </h6>
                                    <h6> Price: $ {p.price} </h6>
                                    <button className='btn btn-danger mt-1'
                                        onClick={() => removeCartItem(p._id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <h5>Cart Summary</h5>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h5>Total : {totalPrice()} </h5>
                        {auth?.user?.address ? (
                            <>
                                <div className='mb-3'>
                                    <h5>Current Address : {auth?.user?.address} </h5>
                                    <button className='btn btn-outline-warning'
                                        onClick={() => navigate('/dashboard/user/profile')}
                                    >
                                        Update Address
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='mb-3'>
                                    {
                                        auth?.token ? (
                                            <button className='btn btn-outline-warning'
                                                onClick={() => navigate('/dashboard/user/profile')}
                                            >
                                                Update Address
                                            </button>
                                        ) : (
                                            <button className='btn btn-outline-warning'
                                                onClick={() => navigate('/login', {
                                                    state: "/cart",
                                                })}
                                            >
                                                Please Login to Checkout
                                            </button>
                                        )
                                    }
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage;