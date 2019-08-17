import React, { Component } from "react";
import { Icon, Modal, Button, Table, Form } from "semantic-ui-react";
import Joi from "joi-browser";
import Pagination from "./common/Pagination";
import Axios from "axios";

const apiCustomers = "api/Customers";

class Customer extends Component {
  state = {
    customers: [],
    pageSize: 5,
    currentPage: 1,
    newCustomer: { name: "", address: "" },
    errors: { name: null, address: null }
  };

  schema = {
    name: Joi.string().required(),
    address: Joi.string().required()
  };

  validateForm = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(
      this.state.newCustomer,
      this.schema,
      options
    );

    if (!error) return null;

    const errors = {};
    for (let i of error.details) errors[i.path[0]] = i.message;

    return errors;
  };

  validateField = (name, value) => {
    const prop = { [name]: value };
    const propSchema = { [name]: this.schema[name] };
    const { error } = Joi.validate(prop, propSchema);

    return error ? error.details[0].message : null;
  };

  async componentDidMount() {
    const { data: customers } = await Axios.get(apiCustomers);
    customers.reverse();
    this.setState({ customers });
  }

  handleNewCustomer = () => {
    const newCustomer = { name: "", address: "" };
    const errors = { name: null, address: null };
    this.setState({ newCustomer, errors });
  };

  handleCreate = async () => {
    const { newCustomer } = this.state;
    const { data: customer } = await Axios.post(apiCustomers, newCustomer);

    const customers = [customer, ...this.state.customers];
    const currentPage = 1;
    this.setState({ customers, currentPage });
  };

  handleEdit = ({ name, address }) => {
    const newCustomer = { name, address };
    const errors = { name: null, address: null };
    this.setState({ newCustomer, errors });
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

    const errors = { ...this.state.errors };
    errors[name] = this.validateField(name, value);

    this.setState({ newCustomer, errors });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = (e, { value }) => {
    this.setState({ pageSize: value, currentPage: 1 });
  };

  renderCustomersTable() {
    const { customers, pageSize, currentPage } = this.state;
    const { length: customersCount } = customers;
    const { name, address } = this.state.newCustomer;
    const { name: nameError, address: addressError } = this.state.errors;

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
                        error={nameError}
                        label="NAME"
                        name="name"
                        value={name}
                        onChange={this.handleInputChange}
                      />
                      <Form.Input
                        required
                        error={addressError}
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
                      disabled={this.validateForm() ? true : false}
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
    const { name: nameError, address: addressError } = this.state.errors;

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
                error={nameError}
                label="NAME"
                name="name"
                value={name}
                onChange={this.handleInputChange}
              />
              <Form.Input
                required
                error={addressError}
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
              key={"create"}
              disabled={this.validateForm() ? true : false}
              onClick={() => this.handleCreate()}
              positive
            >
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
