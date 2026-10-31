import React, { useEffect } from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import ReactDOMClient from "react-dom/client";
import App from "./App";
import Alert from "./components/Alert";
import Card from "./components/Card";
import ContactMeSection from "./components/ContactMeSection";
import EmploymentHistorySection from "./components/EmploymentHistorySection";
import Footer from "./components/Footer";
import FullScreenSection from "./components/FullScreenSection";
import Header from "./components/Header";
import LandingSection from "./components/LandingSection";
import ProjectsSection from "./components/ProjectsSection";
import { AlertProvider, useAlertContext } from "./context/alertContext";
import useSubmit from "./hooks/useSubmit";
import reportWebVitals from "./reportWebVitals";

const mockGetCLS = vi.fn();
const mockGetFID = vi.fn();
const mockGetFCP = vi.fn();
const mockGetLCP = vi.fn();
const mockGetTTFB = vi.fn();

vi.mock("web-vitals", () => ({
  getCLS: (...args) => mockGetCLS(...args),
  getFID: (...args) => mockGetFID(...args),
  getFCP: (...args) => mockGetFCP(...args),
  getLCP: (...args) => mockGetLCP(...args),
  getTTFB: (...args) => mockGetTTFB(...args),
}));

describe("App and Core Sections", () => {
  test("renders App with all main sections", () => {
    render(<App />);
    expect(screen.getByText(/Hello, my name is Elijah!/i)).toBeInTheDocument();
    expect(screen.getByText(/Professional Experience/i, { selector: "h1" })).toBeInTheDocument();
    expect(screen.getByText(/Featured Projects/i)).toBeInTheDocument();
    expect(screen.getByText(/Elijah • © 2023/i)).toBeInTheDocument();
  });

  test("FullScreenSection renders dark and light backgrounds properly", () => {
    const { rerender } = render(
      <ChakraProvider>
        <FullScreenSection isDarkBackground={true} backgroundColor="#000">
          <div>Dark Content</div>
        </FullScreenSection>
      </ChakraProvider>
    );
    expect(screen.getByText("Dark Content")).toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <FullScreenSection isDarkBackground={false} backgroundColor="#fff">
          <div>Light Content</div>
        </FullScreenSection>
      </ChakraProvider>
    );
    expect(screen.getByText("Light Content")).toBeInTheDocument();
  });

  test("Card renders title, description, image, and link", () => {
    render(
      <ChakraProvider>
        <Card
          title="Test Card"
          description="Test Description"
          imageSrc="test.png"
          url="https://example.com"
        />
      </ChakraProvider>
    );
    expect(screen.getByText("Test Card")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /See more/i });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  test("Footer renders copyright info", () => {
    render(
      <ChakraProvider>
        <Footer />
      </ChakraProvider>
    );
    expect(screen.getByText("Elijah • © 2023")).toBeInTheDocument();
  });

  test("LandingSection renders greeting and bios", () => {
    render(
      <ChakraProvider>
        <LandingSection />
      </ChakraProvider>
    );
    expect(screen.getByText("Hello, my name is Elijah!")).toBeInTheDocument();
    expect(screen.getByText("JPMorganChase Software Engineer")).toBeInTheDocument();
    expect(screen.getByText("BS/MS in Computer Science from Emory")).toBeInTheDocument();
  });

  test("EmploymentHistorySection renders job entries", () => {
    render(
      <ChakraProvider>
        <EmploymentHistorySection />
      </ChakraProvider>
    );
    expect(screen.getByText("Software Engineer I")).toBeInTheDocument();
    expect(screen.getByText("AT&T")).toBeInTheDocument();
  });

  test("ProjectsSection renders project cards", () => {
    render(
      <ChakraProvider>
        <ProjectsSection />
      </ChakraProvider>
    );
    expect(screen.getByText("ChatGeminiPro")).toBeInTheDocument();
    expect(screen.getByText("Open World Atlanta")).toBeInTheDocument();
  });
});

describe("Header Component", () => {
  test("handles scroll up and scroll down events", () => {
    Object.defineProperty(window, "scrollY", { value: 100, writable: true });

    const { container, unmount } = render(
      <ChakraProvider>
        <Header />
      </ChakraProvider>
    );
    const headerBox = container.firstChild;

    // Scroll down (100 -> 200): prevScrollPos (100) <= currentScrollPos (200) -> translateY(-200px)
    window.scrollY = 200;
    fireEvent.scroll(window);
    expect(headerBox.style.transform).toBe("translateY(-200px)");

    // Scroll up (200 -> 50): prevScrollPos (200) > currentScrollPos (50) -> translateY(0)
    window.scrollY = 50;
    fireEvent.scroll(window);
    expect(headerBox.style.transform).toBe("translateY(0)");

    unmount();
  });

  test("handles scroll safely when headerRef.current is null", () => {
    const removeSpy = vi
      .spyOn(window, "removeEventListener")
      .mockImplementation(() => {});

    const { unmount } = render(
      <ChakraProvider>
        <Header />
      </ChakraProvider>
    );

    unmount();
    removeSpy.mockRestore();

    window.scrollY = 300;
    expect(() => fireEvent.scroll(window)).not.toThrow();
  });

  test("handles navigation link clicks when target element exists and when it does not", () => {
    const scrollIntoViewMock = vi.fn();
    const getElementByIdSpy = vi
      .spyOn(document, "getElementById")
      .mockImplementation((id) => {
        if (id === "projects-section") {
          return { scrollIntoView: scrollIntoViewMock };
        }
        return null;
      });

    render(
      <ChakraProvider>
        <Header />
      </ChakraProvider>
    );

    const projectsLink = screen.getByText("Projects");
    fireEvent.click(projectsLink);
    expect(getElementByIdSpy).toHaveBeenCalledWith("projects-section");
    expect(scrollIntoViewMock).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });

    const expLink = screen.getByText("Professional Experience");
    fireEvent.click(expLink);
    expect(getElementByIdSpy).toHaveBeenCalledWith("employment-history-section");
    expect(scrollIntoViewMock).toHaveBeenCalledTimes(1);

    getElementByIdSpy.mockRestore();
  });
});

describe("Alert and AlertContext", () => {
  const TestConsumer = () => {
    const { isOpen, type, onOpen, onClose } = useAlertContext();
    return (
      <div>
        <span data-testid="status">{isOpen ? "open" : "closed"}</span>
        <span data-testid="type">{type}</span>
        <button onClick={() => onOpen("success", "Success Msg")}>Open Success</button>
        <button onClick={() => onOpen("error", "Error Msg")}>Open Error</button>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  test("opens and closes success and error alerts", async () => {
    render(
      <ChakraProvider>
        <AlertProvider>
          <TestConsumer />
          <Alert />
        </AlertProvider>
      </ChakraProvider>
    );

    expect(screen.getByTestId("status")).toHaveTextContent("closed");

    fireEvent.click(screen.getByText("Open Success"));
    expect(screen.getByTestId("status")).toHaveTextContent("open");
    expect(screen.getByText("All good!")).toBeInTheDocument();
    expect(screen.getByText("Success Msg")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Open Error"));
    expect(screen.getByText("Oops!")).toBeInTheDocument();
    expect(screen.getByText("Error Msg")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("closed");
    });
  });
});

describe("useSubmit Hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  const HookTester = ({ onResult }) => {
    const { isLoading, response, submit } = useSubmit();
    useEffect(() => {
      onResult({ isLoading, response, submit });
    }, [isLoading, response, submit, onResult]);
    return null;
  };

  test("resolves with success when Math.random >= 0.5", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.7);
    let latest;
    render(<HookTester onResult={(res) => { latest = res; }} />);

    let submitPromise;
    act(() => {
      submitPromise = latest.submit("https://example.com", { firstName: "Alice" });
    });

    expect(latest.isLoading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await submitPromise;
    });

    expect(latest.isLoading).toBe(false);
    expect(latest.response).toEqual({
      type: "success",
      message: "Thanks for your submission Alice, we will get back to you shortly!",
    });
  });

  test("resolves with error when Math.random < 0.5", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.2);
    let latest;
    render(<HookTester onResult={(res) => { latest = res; }} />);

    let submitPromise;
    act(() => {
      submitPromise = latest.submit("https://example.com", { firstName: "Bob" });
    });

    expect(latest.isLoading).toBe(true);

    await act(async () => {
      vi.advanceTimersByTime(2000);
      await submitPromise;
    });

    expect(latest.isLoading).toBe(false);
    expect(latest.response).toEqual({
      type: "error",
      message: "Something went wrong, please try again later!",
    });
  });
});

describe("ContactMeSection Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("validates fields and submits form with error and success responses", async () => {
    const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0.2);

    render(
      <ChakraProvider>
        <AlertProvider>
          <ContactMeSection />
          <Alert />
        </AlertProvider>
      </ChakraProvider>
    );

    const nameInput = screen.getByLabelText(/Name/i);
    const emailInput = screen.getByLabelText(/Email Address/i);
    const commentInput = screen.getByLabelText(/Your message/i);
    const submitBtn = screen.getByRole("button", { name: /Submit/i });

    // Trigger validation errors
    await act(async () => {
      fireEvent.blur(nameInput);
      fireEvent.blur(emailInput);
      fireEvent.blur(commentInput);
    });

    expect(screen.getAllByText("Required").length).toBeGreaterThan(0);

    // Fill valid data and submit (first with error: Math.random = 0.2)
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: "John Doe" } });
      fireEvent.change(emailInput, { target: { value: "john@example.com" } });
      fireEvent.change(commentInput, {
        target: { value: "This is a valid comment that is definitely over 25 characters long." },
      });
    });

    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByText("Something went wrong, please try again later!")
    ).toBeInTheDocument();

    // Now test success path (Math.random = 0.8) which also resets the form
    randomSpy.mockReturnValue(0.8);
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    await act(async () => {
      vi.advanceTimersByTime(2000);
    });

    expect(
      screen.getByText("Thanks for your submission John Doe, we will get back to you shortly!")
    ).toBeInTheDocument();

    expect(nameInput.value).toBe("");
  });
});

describe("reportWebVitals and index.jsx", () => {
  test("reportWebVitals does nothing when no callback or non-function is passed", () => {
    expect(() => reportWebVitals()).not.toThrow();
    expect(() => reportWebVitals(null)).not.toThrow();
    expect(() => reportWebVitals("not a function")).not.toThrow();
  });

  test("reportWebVitals calls web-vitals functions when a valid callback is passed", async () => {
    const mockCallback = function () {};
    reportWebVitals(mockCallback);

    await waitFor(() => {
      expect(mockGetCLS).toHaveBeenCalledWith(mockCallback);
      expect(mockGetFID).toHaveBeenCalledWith(mockCallback);
      expect(mockGetFCP).toHaveBeenCalledWith(mockCallback);
      expect(mockGetLCP).toHaveBeenCalledWith(mockCallback);
      expect(mockGetTTFB).toHaveBeenCalledWith(mockCallback);
    });
  });

  test("index.jsx renders App into root element", async () => {
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);

    const mockRender = vi.fn();
    const createRootSpy = vi
      .spyOn(ReactDOMClient, "createRoot")
      .mockReturnValue({ render: mockRender });

    await import("./index.jsx");

    expect(createRootSpy).toHaveBeenCalledWith(rootDiv);
    expect(mockRender).toHaveBeenCalled();

    createRootSpy.mockRestore();
    document.body.removeChild(rootDiv);
  });
});
