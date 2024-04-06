import React from "react";
import { expect, vi } from "vitest"
import { render, fireEvent } from "vitest-react";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";

test("smoke test", () => {
    render(
        <MemoryRouter>
            <LoginForm />
        </MemoryRouter>
    );
});

test("snapshot", () => {
    const { asFragment } = render(<MemoryRouter><LoginForm /></MemoryRouter>)
    expect(asFragment()).toMatchSnapshot()
})

test("should login user", async () => {
    const login = vi.fn().mockResolvedValue({ success: true })

    const { getByTestId, getByLabelText } = 
        render(
            <MemoryRouter>
                <LoginForm login={login}/>
            </MemoryRouter>)

    const username = getByLabelText("Username")
    const password = getByLabelText("Password")
    const loginButton = getByTestId("login-button")
    
    fireEvent.change(username, { target: { value: 'testuser' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.click(loginButton)

    await vi.waitFor(() => expect(window.location.pathname).toBe('/'));
})

test("unauthorized login", async () => {
    const login = vi.fn().mockResolvedValue({ success: false, errors: ["Invalid username/password"]})

    const { getByTestId, getByLabelText, findByText } = 
        render(
            <MemoryRouter>
                <LoginForm login={login}/>
            </MemoryRouter>)

    const username = getByLabelText("Username")
    const password = getByLabelText("Password")
    const loginButton = getByTestId("login-button")
    
    fireEvent.change(username, { target: { value: 'testuser' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.click(loginButton)

    const alert = await findByText("Invalid username/password");
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass("alert-danger");
})
