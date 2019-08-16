import React, { Component } from "react";
import NavBar from "./NavBar";
import { Container } from "semantic-ui-react";

export class Layout extends Component {
  displayName = Layout.name;

  render() {
    return (
      <Container>
        <NavBar />
        {this.props.children}
      </Container>
    );
  }
}
