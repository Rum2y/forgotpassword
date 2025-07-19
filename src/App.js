import "./App.css";
import { useState } from "react";
import { Client, Account } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://nyc.cloud.appwrite.io/v1")
  .setProject("686c91fd00382956557e");

export const account = new Account(client);

function App() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");
    const secret = urlParams.get("secret");

    if (!userId || !secret) {
      setError("Invalid request parameters.");
      return;
    }

    setIsLoading(true);
    try {
      await account.updateRecovery(userId, secret, password, confirmPassword);
      setSuccess(true);
    } catch (error) {
      setError("Error resetting password: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="form-container">
        {success ? (
          <div className="success-message">
            <h2>Password Reset Successful!</h2>
            <p>Your password has been successfully updated.</p>
            <p>You can now log in with your new password.</p>
          </div>
        ) : (
          <>
            <h2 className="form-title" style={{ textAlign: "center" }}>
              Reset Your Password
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",

                alignItems: "center",
              }}
            >
              <div className="form-group" style={{ marginBottom: ".75rem" }}>
                <label htmlFor="password">New Password: </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: ".75rem" }}>
                <label htmlFor="confirm-password">Confirm Password: </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirm-password"
                  name="confirm-password"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              {error && <div className="error-message">{error}</div>}
              <button
                type="submit"
                className="submit-button"
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
