import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { Auth, User, Conversation } from './store';

import App from './App';
import './styles/index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Auth.Provider>
                <User.Provider>
                    <Conversation.Provider>
                        <App />
                    </Conversation.Provider>
                </User.Provider>
            </Auth.Provider>
        </BrowserRouter>
    </React.StrictMode>
);
