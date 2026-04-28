import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Routes, Route, MemoryRouter } from "react-router-dom";

import AuthCheck from "../components/AuthCheck.jsx";
import Context from "../components/Context.jsx";
import MockDashboard from "./test_mocks/MockDashboard.jsx";
import Login from "../pages/Login.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import { waitFor } from "@testing-library/react";



jest.mock("../assets/FetchWrapper.jsx");


beforeEach(() => {
    FetchWrapper.mockReset();
});



test("navigate to login", async () => {
    render(
        <Context>
            <MemoryRouter initialEntries={["/"]}>
                <Routes>
                    <Route path="/" element={<AuthCheck><MockDashboard /></AuthCheck>} />
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                </Routes>
            </MemoryRouter>
        </Context>
    );

    const loginButton = screen.getByText("Login");
    await userEvent.click(loginButton);

    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});



test("Login", async () => {
    FetchWrapper.mockResolvedValue({
        status: 200,
        result: {
            code: "AUTHORIZED",
            message: "Login successful",
            data: {
                token: "fake-token"
            }
        }
    });

    render(
        <Context>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                    <Route path="/" element={<div>Home</div>} />
                </Routes>
            </MemoryRouter>
        </Context>
    );

    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "alex@yahoo.com");
    await userEvent.type(passwordInput, "Test");

    await userEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
        expect(FetchWrapper).toHaveBeenCalled();
    });

    await waitFor(() => {
    expect(FetchWrapper).toHaveBeenCalledWith(
        "/auth/login",
        "POST",
        expect.objectContaining({
            "Content-Type": "application/json"
        }),
        {
            email: "alex@yahoo.com",
            password: "Test"
        }
    );});
    await waitFor(() => {
        expect(sessionStorage.getItem("authorization")).toBe("fake-token");
        sessionStorage.clear();
        expect(screen.getByText("Home")).toBeInTheDocument();
    });
});



test("failed login", async () => {

    FetchWrapper.mockResolvedValue({
        status: 404,
        result: {
            code: "NOT_FOUND",
            message: "Invalid credentials!"
        }
    });

    render(
        <Context>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                </Routes>
            </MemoryRouter>
        </Context>
    );

    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "wrong@test.com");
    await userEvent.type(passwordInput, "wrongpass");

    await userEvent.click(screen.getByText("Submit"));

    expect(FetchWrapper).toHaveBeenCalled();
});



test("Invalid email", async () => {
    render(
        <Context>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                </Routes>
            </MemoryRouter>
        </Context>
    );
    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "wrong@ test.com");
    await userEvent.type(passwordInput, "wrongpass");

    await userEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
        expect(screen.getByText("Invalid user credentials")).toBeInTheDocument();
    })
});


test("Full login flow", async () => {
    FetchWrapper.mockResolvedValue({
        status: 200,
        result: {
            code: "AUTHORIZED",
            message: "Login successful",
            data: {
                token: "fake-token"
            }
        }
    });
    render(
        <Context>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                    <Route path="/" element={<AuthCheck><MockDashboard/></AuthCheck>} />
                </Routes>
            </MemoryRouter>
        </Context>
    );

    const emailInput = screen.getByPlaceholderText("Email address");
    const passwordInput = screen.getByPlaceholderText("Password");

    await userEvent.type(emailInput, "alex@yahoo.com");
    await userEvent.type(passwordInput, "Test");

    await userEvent.click(screen.getByText("Submit"));
    await waitFor(() => {
        expect(FetchWrapper).toHaveBeenCalled();
    });

    await waitFor(() => {
        expect(FetchWrapper).toHaveBeenCalledWith(
            "/auth/login",
            "POST",
            expect.objectContaining({
                "Content-Type": "application/json"
            }),
            {
                email: "alex@yahoo.com",
                password: "Test"
            }
        );});
    await waitFor(() => {
        expect(sessionStorage.getItem("authorization")).toBe("fake-token");
        expect(screen.getByText("MOCKDASHBOARD")).toBeInTheDocument();
        sessionStorage.clear();
    });
});