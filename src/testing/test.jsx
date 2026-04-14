import { render, screen, waitFor } from "@testing-library/react";
import Hello from "./Hello";

// Mock fetch
global.fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve({ message: "Hello from backend!" }),
    })
);

test("renders message from API", async () => {
    render(<Hello />);

    // Initially shows loading
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for API response
    await waitFor(() =>
        expect(screen.getByText("Hello from backend!")).toBeInTheDocument()
    );

    expect(fetch).toHaveBeenCalledWith("/api/hello");
});