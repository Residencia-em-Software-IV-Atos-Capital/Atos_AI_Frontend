import React, { useState } from "react";
import "./Login.css"; 
import logo from "@/components/img/ATOSCAPITALBRANCO.png"; 

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password); 
    // auth
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img src={logo} alt="ATOS Capital" className="login-logo" />
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Login</h2>
          <input
            type="text"
            placeholder="Usuário"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;