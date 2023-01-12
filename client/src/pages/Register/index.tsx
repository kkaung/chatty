import { FormEvent, useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Form from '../../components/form';
import { ErrorMessage } from '../../components/message';
import { registerUser } from '../../store/Auth/AuthActions';
import { useAuth } from '../../store/Auth/AuthContext';
import { RegisterUser } from '../../types';

export default function RegisterPage() {
    const [{ username, email, password }, setForm] = useState<RegisterUser>({
        username: 'test1',
        password: 'test1',
        email: 'test1@gmail.com',
    });

    const navigate = useNavigate();

    const {
        state: { isLoading, message, isAuthenticated },
        dispatch,
    } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) return;
        navigate('/');
    }, [isAuthenticated, navigate]);

    const handleChange = (e: FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        setForm((prevState: any) => {
            return { ...prevState, [target.name]: target.value };
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        registerUser(dispatch, { username, email, password });
    };

    return (
        <>
            {message && <ErrorMessage message={message} />}
            <div className="flex justify-center items-center w-full h-full">
                <form
                    className=" bg-white px-6 py-4 rounded-xl shadow-sm max-w-[420px] sm:w-[360px]"
                    onSubmit={handleSubmit}
                >
                    <header className="mb-6 text-center">
                        <h1 className="text-lg font-semibold text-cyan-400">
                            Chatty
                        </h1>
                    </header>
                    <Form.FormInput
                        className="mb-4"
                        name="username"
                        value={username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <Form.FormInput
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={handleChange}
                        required
                    />
                    <Form.FormInput
                        type="password"
                        name="password"
                        value={password}
                        className="my-4"
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <Form.Button
                        title="Sign up"
                        className="w-full"
                        type="submit"
                        isLoading={isLoading}
                    />
                    <p className="text-sm mt-4">
                        Have an account ?{' '}
                        <Link
                            to="/login"
                            className=" text-cyan-500 hover:text-cyan-700 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
