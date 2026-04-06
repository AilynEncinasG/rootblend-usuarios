import React from "react";

const RegisterForm: React.FC = () => {
  return (
    <form>
      <div>
        <label>Nombre:</label>
        <input type="text" placeholder="Ingresa tu nombre" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" placeholder="Ingresa tu email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" placeholder="Crea una contraseña" />
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterForm;