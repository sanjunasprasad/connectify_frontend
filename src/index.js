// import React from "react";
// import ReactDOM from "react-dom/client";
// import App from "./App";
// import { BrowserRouter as Router } from "react-router-dom";
// import { Provider } from "react-redux";
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from "./services/redux/store/store";
// import Modal from "react-modal";
// import "./index.css";

// const rootElement = document.getElementById("root");
// Modal.setAppElement(rootElement);
// const root = ReactDOM.createRoot(rootElement);

// root.render(
//   <React.StrictMode>
//     <Router>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <App />
//         </PersistGate>
//       </Provider>
//     </Router>
//   </React.StrictMode>
// );




import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './services/redux/store/store';
import Modal from 'react-modal';
import "./index.css"

const rootElement = document.getElementById('root');
Modal.setAppElement(rootElement);
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
   <Router>
   <Provider store={store}>
        <App />
      </Provider>
    </Router>
  </React.StrictMode>
);





