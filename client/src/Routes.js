import React from "react";
import MainPage from "./components/mainPage/MainPage";
import ItemsPage from "./components/collection/ItemsPage";
import CollectionsPage from "./components/collection/CollectionsPage";
import { Switch, Route, Redirect } from "react-router-dom";
import SignUpPage from "./components/authentication/SignUpPage";
import SignInPage from "./components/authentication/SignInPage";
import UserPage from "./components/collection/UserPage";
const Routes = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <MainPage />
      </Route>
      <Route path="/account" exact>
        <CollectionsPage />
      </Route>
      <Route path="/collection/:id">
        <ItemsPage />
      </Route>
      <Route path="/signUp">
        <SignUpPage />
      </Route>
      <Route path="/signIn">
        <SignInPage />
      </Route>
      <Route path="/profile">
        <UserPage/>
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
export default Routes;