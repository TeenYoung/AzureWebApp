import React, { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default class NavBar extends Component {
  state = { activeItem: "" };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu inverted>
        <Menu.Item header>Dev Onboarding Task</Menu.Item>
        <Menu.Item
          as={Link}
          to="/"
          name="customers"
          active={activeItem === "customers"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/products"
          name="products"
          active={activeItem === "products"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/stores"
          name="stores"
          active={activeItem === "stores"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/sales"
          name="sales"
          active={activeItem === "sales"}
          onClick={this.handleItemClick}
        />
        <Menu.Menu position="right">
          <Menu.Item icon="code" name="Tim Young" />
        </Menu.Menu>
      </Menu>
    );
  }
}
