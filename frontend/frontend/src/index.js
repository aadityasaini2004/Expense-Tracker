// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
  UserButton,
} from "@clerk/clerk-react";
import Dashboard from "./pages/Dashboard";

import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

// Check for the publishable key
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
if (!clerkPubKey) {
  throw new Error("Missing Publishable Key from .env file");
}

// This component will define the main layout and routing logic
function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
        {/* Public routes that are accessible to signed-out users */}
        <Route
          path="/sign-in/*"
          element={<SignIn routing="path" path="/sign-in" />}
        />
        <Route
          path="/sign-up/*"
          element={<SignUp routing="path" path="/sign-up" />}
        />

        {/* Private routes that are only accessible to signed-in users */}
        <Route
          path="/*"
          element={
            <SignedIn>
              <MainLayout />
            </SignedIn>
          }
        />

        {/* A catch-all for signed-out users, which redirects them to the sign-in page */}
        <Route
          path="*"
          element={
            <SignedOut>
              <SignIn routing="path" path="/sign-in" />
            </SignedOut>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

// This component defines the layout for the authenticated part of the app
function MainLayout() {
  return (
    <div>
      <header
        style={{
          padding: "1rem",
          display: "flex",
          justifyContent: "flex-end",
          borderBottom: "1px solid #e5e5e5",
        }}
      >
        <UserButton afterSignOutUrl="/sign-in" />
      </header>
      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other private routes here, for example: */}
          {/* <Route path="/reports" element={<ReportsPage />} /> */}

          {/* A default route for signed-in users */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider defaultColorScheme="auto">
      <Router>
        <App />
      </Router>
    </MantineProvider>
  </React.StrictMode>
);
