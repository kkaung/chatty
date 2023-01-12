import { FormEvent, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Form from '../../components/form';
import { ErrorMessage } from '../../components/message';
import { loginUser, useAuth } from '../../store/Auth/AuthContext';
import { LoginUser } from '../../types';

export default function LoginPage() {
    const [{ email, password }, setForm] = useState<LoginUser>({
        email: 'string@gmail.com',
        password: 'string',
    });

    const {
        state: { isLoading, isAuthenticated, message },
        dispatch,
    } = useAuth();

    const navigate = useNavigate();

    const handleChange = (e: FormEvent) => {
        const target = e.target as HTMLInputElement;
        setForm((prevState: any) => {
            return { ...prevState, [target.name]: target.value };
        });
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        loginUser(dispatch, { email, password });
    };

    useEffect(() => {
        if (!isAuthenticated) return;
        navigate('/');
    }, [isAuthenticated, navigate]);

    return (
        <>
            {message && <ErrorMessage message={message} />}
            <div className="flex justify-center items-center h-full w-full">
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
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={handleChange}
                    />
                    <Form.FormInput
                        type="password"
                        name="password"
                        value={password}
                        className="my-4"
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <Form.Button
                        title="Login"
                        className="w-full"
                        type="submit"
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                    <p className="text-sm mt-4">
                        Don't have an account ?{' '}
                        <Link
                            to="/signup"
                            className=" text-cyan-500 hover:text-cyan-700 hover:underline"
                        >
                            Sign up
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
}
