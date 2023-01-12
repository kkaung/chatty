import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyA2JWkZ_8eVKRdlmFbh4hYBNJnuX5tQYbM',
    authDomain: 'chatty-69803.firebaseapp.com',
    projectId: 'chatty-69803',
    storageBucket: 'chatty-69803.appspot.com',
    messagingSenderId: '378879559208',
    appId: '1:378879559208:web:9e0740632da5809fc7d71d',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
