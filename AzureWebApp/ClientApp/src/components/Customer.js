import React, { Component } from "react";
import { Icon, Modal, Button, Table, Form, Message } from "semantic-ui-react";
import Pagination from "./common/Pagination";
import Axios from "axios";

const apiCustomers = "api/Customers";

class Customer extends Component {
  state = {
    customers: [],
    pageSize: 5,
    currentPage: 1,
    newCustomer: { name: "", address: "" }
  };

  async componentDidMount() {
    const { data: customers } = await Axios.get(apiCustomers);
    customers.reverse();
    this.setState({ customers });
  }

  handleNewCustomer = () => {
    const newCustomer = { name: "", address: "" };
    this.setState({ newCustomer });
  };

  handleCreate = async () => {
    const { newCustomer } = this.state;
    const { data: customer } = await Axios.post(apiCustomers, newCustomer);

    const customers = [customer, ...this.state.customers];
    const currentPage = 1;
    this.setState({ customers, currentPage });
  };

  handleEdit = customer => {
    const newCustomer = { ...customer };
    this.setState({ newCustomer });
  };

  handleUpdate = async customer => {
    const { newCustomer } = this.state;
    newCustomer.id = customer.id;
    await Axios.put(apiCustomers + "/" + customer.id, newCustomer);

    const customers = [...this.state.customers];
    const i = customers.indexOf(customer);
    if (~i) {
      customers[i] = newCustomer;
    }
    this.setState({ customers });
  };

  handleDelete = async customer => {
    const { data: deletedCustomer } = await Axios.delete(
      apiCustomers + "/" + customer.id
    );

    const customers = this.state.customers.filter(
      c => c.id !== deletedCustomer.id
    );
    this.setState({ customers });
  };

  handleInputChange = (e, { name, value }) => {
    const newCustomer = { ...this.state.newCustomer };
    newCustomer[name] = value;
    this.setState({ newCustomer });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = (e, { value }) => {
    this.setState({ pageSize: value, currentPage: 1 });
  };

  renderCustomersTable() {
    const { customers } = this.state;
    const { length: customersCount } = customers;
    const { pageSize, currentPage } = this.state;
    const { name, address } = this.state.newCustomer;

    if (customersCount === 0) return <h3>Opps, we don't have any customer!</h3>;

    const currentPageCustomers = customers.filter(
      c =>
        customers.indexOf(c) >= (currentPage - 1) * pageSize &&
        customers.indexOf(c) < currentPage * pageSize
    );

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentPageCustomers.map(customer => (
            <Table.Row key={customer.id}>
              <Table.Cell>{customer.name}</Table.Cell>
              <Table.Cell>{customer.address}</Table.Cell>
              <Table.Cell>
                <Modal
                  dimmer="blurring"
                  closeOnDimmerClick={false}
                  trigger={
                    <Button
                      color="yellow"
                      onClick={() => this.handleEdit(customer)}
                    >
                      <Icon name="edit" />EDIT
                    </Button>
                  }
                  header="Update Customer Info"
                  content={
                    <Form style={{ margin: 30 }}>
                      <Form.Input
                        required
                        label="NAME"
                        name="name"
                        value={name}
                        onChange={this.handleInputChange}
                      />
                      <Form.Input
                        required
                        label="ADDRESS"
                        name="address"
                        value={address}
                        onChange={this.handleInputChange}
                      />
                    </Form>
                  }
                  actions={[
                    "Cancel",
                    <Button
                      key={"edit"}
                      onClick={() => this.handleUpdate(customer)}
                      positive
                    >
                      Update
                    </Button>
                  ]}
                />
              </Table.Cell>
              <Table.Cell>
                <Modal
                  dimmer="blurring"
                  trigger={
                    <Button negative>
                      <Icon name="trash alternate" />DELETE
                    </Button>
                  }
                  header="Warning"
                  content="This action will permanently erase this customer from our database. Are you sure?"
                  actions={[
                    "Cancel",
                    <Button
                      key={"delete"}
                      onClick={() => this.handleDelete(customer)}
                      negative
                    >
                      Delete
                    </Button>
                  ]}
                />
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Pagination
                itemsCount={customersCount}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
                currentPage={currentPage}
                onPageSizeChange={this.handlePageSizeChange}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }

  render() {
    const { name, address } = this.state.newCustomer;

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          closeOnDimmerClick={false}
          trigger={
            <Button primary onClick={this.handleNewCustomer}>
              <Icon name="user" />New Customer
            </Button>
          }
          header="Create New Customer"
          content={
            <Form style={{ margin: 30 }}>
              <Form.Input
                required
                label="NAME"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
              <Form.Input
                required
                label="ADDRESS"
                name="address"
                value={address}
                onChange={this.handleInputChange}
              />
            </Form>
          }
          actions={[
            "Cancel",
            <Button key={"create"} onClick={() => this.handleCreate()} positive>
              Create
            </Button>
          ]}
        />
        {this.renderCustomersTable()}
      </React.Fragment>
    );
  }
}

export default Customer;
