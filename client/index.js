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
import jwtDecode from "jwt-decode";
import { setCurrentUser } from "./actions/authActions";
import NewEventPage from "./components/events/NewEventPage";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  )
);

if(localStorage.jwtToken){
  setAuthorizationToken(localStorage.jwtToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwtToken)));
}


render(
    <Provider store={store}>
      <BrowserRouter history={browserHistory}>
        <App>
          <Route exact path="/" component={Greatings} />
          <Route path="/signup" component={SignupPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/new-event" component={NewEventPage} />
        </App>
      </BrowserRouter>
    </Provider>  
, document.getElementById("app"));