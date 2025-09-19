import React, { useState } from "react";
import { UserIcon, EyeIcon, EyeClosed } from 'lucide-react';
import './style.css';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        // Implementar aqui a requisicao de login
        e.preventDefault();

        try {
            console.log(formData);
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }

    const handleShowPassword = () => {
        setShowPassword((prevState) => !prevState);
    }

    return (
        <div className="login-container">
            <div className="left-container"></div>
            <div className="right-container">
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-title">Login</div>
                    <div className="input-form">
                        <input
                            type="text" 
                            name="username" 
                            id="username" 
                            placeholder="Usuario"
                            onChange={handleChange}
                        />
                        <UserIcon />
                    </div>
                    <div className="input-form">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            id="password" 
                            placeholder="Senha"
                            onChange={handleChange}
                        />
                        {showPassword ? <EyeIcon onClick={handleShowPassword} style={{ cursor: 'pointer'}}/> : 
                                        <EyeClosed onClick={handleShowPassword} style={{ cursor: 'pointer'}} />}
                    </div>
                    <button className="btn-login" type="submit">Entrar</button>
                </form>
            </div>
        </div>
    );
}

export default Login;