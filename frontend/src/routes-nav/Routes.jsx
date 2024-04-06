import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import CategoryProductList from "../categories/CategoryProductList";
import Product from "../products/Product";
import SignupForm from "../auth/SignupForm";
import LoginForm from "../auth/LoginForm";
import Homepage from "../homepage/Homepage";
import SearchResults from "../search/SearchResults";
import Cart from "../cart/Cart"
import CheckoutShipping from "../checkout/CheckoutShipping";
import CheckoutPayment from "../checkout/CheckoutPayment";
import CheckoutReview from "../checkout/CheckoutReview";
import CheckoutThankYou from "../checkout/CheckoutThankYou";
import ProfileEditForm from "../profiles/ProfileEditForm";
import Orders from "../orders/Orders";
import UserContext from "../auth/UserContext";

/** All Routes
 * 
 * Lists all public and private routes available on site. Redirects user to home for unknown routes. Passed props for login and signup form. 
 * 
 * Props:
 * login, signup
 * 
 * State: 
 * none
 * 
 * App -> AllRoutes
 */
const AllRoutes = ({ login, signup }) => {
    const { currentUser } = useContext(UserContext)

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Homepage />}></Route>
            <Route path="/signup" element={<SignupForm signup={signup} />} />
            <Route path="/login" element={<LoginForm login={login} />} />
            <Route path="/search" element={<SearchResults />} />
            
            <Route path="/categories/:categoryId" element={<CategoryProductList />} />
            <Route path="/product/:sku" element={<Product />} />
            
            {/* Private Routes */}
            {currentUser && (
                <>
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<CheckoutShipping />} />
                    <Route path="/checkout/payment-method" element={<CheckoutPayment />} />
                    <Route path="/checkout/review" element={<CheckoutReview />} />
                    <Route path="/checkout/place-order" element={<CheckoutThankYou />} />
                    <Route path="/profile" element={<ProfileEditForm />} />
                    <Route path="/orders" element={<Orders />} />
                </>
            )}
            
            {/* Redirect for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    )
}

export default AllRoutes;