import React from "react";

const LoginForm: React.FC = () => {
  return (
    <form>
      <div>
        <label>Email:</label>
        <input type="email" placeholder="Ingresa tu email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" placeholder="Ingresa tu contraseña" />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;