import React from "react";

/** Alert
 * Displays alert with message for user. 
 * { LoginForm, SignupForm, ProfileForm, Product } -> Alert
 **/
function Alert({ type = "danger", messages = [] }) {

  return (
      <div className={`alert alert-${type} text-center`} role="alert">
        {messages.map(error => (
            <p className="mb-0 small" key={error}>
              {error}
            </p>
        ))}
      </div>
  );
}

export default Alert;