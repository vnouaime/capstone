import React from "react"
import { beforeAll, afterEach, expect, vi } from "vitest"
import { render, fireEvent } from "vitest-react"
import UserContext from "../auth/UserContext"
import Cart from "./Cart"
import { MemoryRouter } from "react-router-dom";
import FurnifyAPI from "../api/FurnifyAPI"
import FurnitureAPI from "../api/ExternalAPI"

const currentUser = {
    username: "testuser"
}

FurnifyAPI.cart = vi.fn()
FurnitureAPI.getProductDetails = vi.fn()

afterEach(() => (
    vi.clearAllMocks()
))

test("smoke test", () => {
    const mockCartData = {
        username: currentUser.username,
        products: [],
        total: 0,
    };

    FurnifyAPI.cart.mockResolvedValue(mockCartData);

    render(
        <UserContext.Provider value={{ currentUser }}>
            <Cart />
        </UserContext.Provider>
    )
})

test("snapshot", () => {
    const mockCartData = {
        username: currentUser.username,
        products: [],
        total: 0,
    };

    FurnifyAPI.cart.mockResolvedValue(mockCartData);

    const { asFragment } = render(
        <UserContext.Provider value={{ currentUser }}>
            <Cart />
        </UserContext.Provider>
    )
    expect(asFragment()).toMatchSnapshot()
})

test('renders cart products when data is fetched', async () => {
    const mockCartData = {
        username: currentUser.username,
        products: [
          { sku: '123', name: 'Product 1', unitPrice: { customerPrice: 10 }, quantity: 2 },
          { sku: '456', name: 'Product 2', unitPrice: { customerPrice: 20 }, quantity: 1 },
        ],
        total: 40,
    };
  
    const mockProductDetails = {
        sku: '1',
        name: 'Product 1',
        customer_reviews: {
          average_rating_value: 4.5,
          reviews: [{}, {}],
        },
        unitPrice: { customerPrice: 50 },
    };

    FurnifyAPI.cart.mockResolvedValue(mockCartData);
    FurnitureAPI.getProductDetails.mockResolvedValue(mockProductDetails)
  
    const { findByText } = render(
        <MemoryRouter>
            <UserContext.Provider value={{ currentUser }}>
                <Cart />
            </UserContext.Provider>
        </MemoryRouter>
        
    );
  
    const cart = await findByText("My Cart")
    const product1 = await findByText("Product 1")

    expect(cart).toBeInTheDocument()
    expect(product1).toBeInTheDocument()
})

test('Displays no items in cart if there are none', async () => {
    const mockCartData = {
        username: currentUser.username,
        products: [],
        total: 0,
    };
  
    FurnifyAPI.cart.mockResolvedValue(mockCartData);
  
    const { findByText } = render(
        <MemoryRouter>
            <UserContext.Provider value={{ currentUser }}>
                <Cart />
            </UserContext.Provider>
        </MemoryRouter>
        
    );
  
    const cart = await findByText("My Cart")
    const emptyCart = await findByText("No items in cart")

    expect(cart).toBeInTheDocument()
    expect(emptyCart).toBeInTheDocument()
})
