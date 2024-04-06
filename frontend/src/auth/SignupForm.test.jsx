import React from "react";
import { expect, vi } from "vitest"
import { render, fireEvent } from "vitest-react";
import { MemoryRouter } from "react-router-dom";
import SignupForm from "./SignupForm";

test("smoke test", () => {
    render(
        <MemoryRouter>
            <SignupForm />
        </MemoryRouter>
    );
});

test("snapshot", () => {
    const { asFragment } = render(<MemoryRouter><SignupForm /></MemoryRouter>)
    expect(asFragment()).toMatchSnapshot()
})

test("should signup user", async () => {
    const signup = vi.fn().mockResolvedValue({ success: true })

    const { getByTestId, getByLabelText } = 
        render(
            <MemoryRouter>
                <SignupForm signup={signup}/>
            </MemoryRouter>)

    const username = getByLabelText("Username")
    const password = getByLabelText("Password")
    const firstName = getByLabelText("First Name")
    const lastName = getByLabelText("Last Name")
    const email = getByLabelText("Email")
    const signupButton = getByTestId("signup-button")
    
    fireEvent.change(username, { target: { value: 'testuser' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(firstName, { target: { value: 'Test' } })
    fireEvent.change(lastName, { target: { value: 'Test' } })
    fireEvent.change(email, { target: { value: 'test@test.com' } })
    fireEvent.click(signupButton)

    await vi.waitFor(() => expect(window.location.pathname).toBe('/'));
})

test("invalid signup: duplicate username", async () => {
    const signup = vi.fn().mockResolvedValue({ success: false, errors: ["Username taken: 'testuser'"]})

    const { getByTestId, getByLabelText, findByText } = 
        render(
            <MemoryRouter>
                <SignupForm signup={signup}/>
            </MemoryRouter>)

    const username = getByLabelText("Username")
    const password = getByLabelText("Password")
    const firstName = getByLabelText("First Name")
    const lastName = getByLabelText("Last Name")
    const email = getByLabelText("Email")
    const signupButton = getByTestId("signup-button")

    fireEvent.change(username, { target: { value: 'testuser' } })
    fireEvent.change(password, { target: { value: 'password' } })
    fireEvent.change(firstName, { target: { value: 'Test' } })
    fireEvent.change(lastName, { target: { value: 'Test' } })
    fireEvent.change(email, { target: { value: 'test@test.com' } })
    fireEvent.click(signupButton)

    const alert = await findByText("Username taken: 'testuser'");
    expect(alert).toBeInTheDocument();
    expect(alert.closest('div')).toHaveClass("alert-danger");
})


