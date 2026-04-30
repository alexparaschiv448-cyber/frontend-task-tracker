import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { Routes, Route, MemoryRouter } from "react-router-dom";

import AuthCheck from "../components/AuthCheck.jsx";
import Context from "../components/Context.jsx";
import MockDashboard from "./test_mocks/MockDashboard.jsx";
import Login from "../pages/Login.jsx";
import FetchWrapper from "../assets/FetchWrapper.jsx";
import Profile from "../pages/Profile.jsx";
import { waitFor } from "@testing-library/react";
import Error from "../pages/Error.jsx";



jest.mock("../assets/FetchWrapper.jsx");


beforeEach(() => {
    FetchWrapper.mockReset();
});





test("Login + invalid", async () => {
    FetchWrapper.mockResolvedValue({
        status: 200,
        result: {
            code: "AUTHORIZED",
            message: "Login successful",
            data: {
                token: "fake-token",
                email:"alex@yahoo.com",
                id:1,
                firstname:"Alex",
                lastname:"Test",
                createdat:"2024-01-01T00:00:00.000Z"
            }
        }
    });

    render(
        <Context>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route path="/login" element={<AuthCheck><Login /></AuthCheck>} />
                    <Route path="/error" element={<AuthCheck><Error /></AuthCheck>} />
                    <Route path="/me" element={<AuthCheck><Profile /></AuthCheck>} />
                    <Route path="/" element={<AuthCheck><MockDashboard /></AuthCheck>} />
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
    });
    FetchWrapper.mockReset();
    FetchWrapper.mockRejectedValue({
        status: 401,
        result: {
            code: "UNAUTHORIZED",
            message: "Token Expired"
        }
    });
    const profileButton = screen.getByText("Profile");
    await userEvent.click(profileButton);
    await waitFor(() => {
        expect(screen.getByText("Token Expired")).toBeInTheDocument();
    });
});


