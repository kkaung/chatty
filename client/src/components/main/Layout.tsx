import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div className="bg-zinc-100">
            <main
                className={`container mx-auto py-10 w-full`}
                style={{ height: '100vh' }}
            >
                <Outlet />
            </main>
        </div>
    );
}
