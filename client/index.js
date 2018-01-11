import React from "react";
import { render } from "react-dom";
import {BrowserRouter, browserHistory, Route, IndexRoute} from "react-router-dom";
import App from "./components/app";
import Greatings from "./components/greatings";
import SignupPage from "./components/signup/SignupPage";
import LoginPage from "./components/login/LoginPage";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "./rootReducer";
import setAuthorizationToken from "./utils/setAuthorizationToken";
import jwt from "jsonwebtoken";
import { setCurrentUser } from "./actions/authActions";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

if(localStorage.jwtToken){
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwt.decode(localStorage.jwtToken)));
}


render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
        <App>
          <Route exact path="/" component={Greatings} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
        </App>
      </BrowserRouter>
    </Provider>  
, document.getElementById("app"));