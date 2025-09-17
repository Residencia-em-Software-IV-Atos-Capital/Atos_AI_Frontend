import React, { useState } from "react";
import { UserIcon, EyeIcon, EyeClosed } from 'lucide-react';
import './style.css';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    }

    return (
        <div className="login-container">
            <div className="left-container"></div>
            <div className="right-container">
                <div className="login-form">
                    <div className="form-title">Login</div>
                    <div className="input-form">
                        <input
                            type="text" 
                            name="user-name" 
                            id="user-name" 
                            placeholder="Usuario"
                        />
                        <UserIcon />
                    </div>
                    <div className="input-form">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="user-password" 
                            id="user-password" 
                            placeholder="Senha"
                        />
                        {showPassword ? <EyeIcon onClick={handleShowPassword} style={{ cursor: 'pointer'}}/> : 
                                        <EyeClosed onClick={handleShowPassword} style={{ cursor: 'pointer'}} />}
                    </div>
                    <button className="btn-login" type="submit">Entrar</button>
                </div>
            </div>
        </div>
    );
}

export default Login;