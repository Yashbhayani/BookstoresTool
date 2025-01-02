import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import AuthState from './Context/Auth/AuthState';
import HomeState from './Context/Home/HomeState';
import ProductState from './Context/Product/ProductState';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <AuthState>
    <HomeState>
      <ProductState>
        {/* <React.StrictMode> */}
        <Provider store={store}>
          <App />
        </Provider>
        {/* </React.StrictMode> */}
      </ProductState>
    </HomeState>
  </AuthState>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
