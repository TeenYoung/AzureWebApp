import React, { Component } from "react";
import { Route } from "react-router";
import { Layout } from "./components/Layout";
import Product from "./components/Product";
import Customer from "./components/Customer";
import Store from "./components/Store";
import Sale from "./components/Sale";

export default class App extends Component {
  displayName = App.name;

  render() {
    return (
      <Layout>
        <Route exact path="/" component={Customer} />
        <Route path="/products" component={Product} />
        <Route path="/stores" component={Store} />
        <Route path="/sales" component={Sale} />
      </Layout>
    );
  }
}
