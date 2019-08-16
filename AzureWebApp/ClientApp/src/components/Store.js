import React, { Component } from "react";
import { Icon, Modal, Button, Table, Form } from "semantic-ui-react";
import Pagination from "./common/Pagination";
import Axios from "axios";

const apiStores = "api/Stores";

class Store extends Component {
  state = {
    stores: [],
    pageSize: 5,
    currentPage: 1,
    newStore: { name: "", address: "" }
  };

  async componentDidMount() {
    const { data: stores } = await Axios.get(apiStores);
    stores.reverse();
    this.setState({ stores });
  }

  handleNewStore = () => {
    const newStore = { name: "", address: "" };
    this.setState({ newStore });
  };

  handleCreate = async () => {
    const { newStore } = this.state;
    const { data: store } = await Axios.post(apiStores, newStore);

    const stores = [store, ...this.state.stores];
    const currentPage = 1;
    this.setState({ stores, currentPage });
  };

  handleEdit = store => {
    const newStore = { ...store };
    this.setState({ newStore });
  };

  handleUpdate = async store => {
    const { newStore } = this.state;
    newStore.id = store.id;
    await Axios.put(apiStores + "/" + store.id, newStore);

    const stores = [...this.state.stores];
    const i = stores.indexOf(store);
    if (~i) {
      stores[i] = newStore;
    }
    this.setState({ stores });
  };

  handleDelete = async store => {
    const { data: deletedStore } = await Axios.delete(
      apiStores + "/" + store.id
    );

    const stores = this.state.stores.filter(c => c.id !== deletedStore.id);
    this.setState({ stores });
  };

  handleInputChange = ({ currentTarget: input }) => {
    const newStore = { ...this.state.newStore };
    newStore[input.name] = input.value;
    this.setState({ newStore });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = (e, { value }) => {
    this.setState({ pageSize: value, currentPage: 1 });
  };

  renderStoresTable() {
    const { stores } = this.state;
    const { length: storesCount } = stores;
    const { pageSize, currentPage } = this.state;
    const { name, address } = this.state.newStore;

    if (storesCount === 0) return <h3>Opps, we don't have any store!</h3>;

    const currentPageStores = stores.filter(
      c =>
        stores.indexOf(c) >= (currentPage - 1) * pageSize &&
        stores.indexOf(c) < currentPage * pageSize
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
          {currentPageStores.map(store => (
            <Table.Row key={store.id}>
              <Table.Cell>{store.name}</Table.Cell>
              <Table.Cell>{store.address}</Table.Cell>
              <Table.Cell>
                <Modal
                  dimmer="blurring"
                  closeOnDimmerClick={false}
                  trigger={
                    <Button
                      color="yellow"
                      onClick={() => this.handleEdit(store)}
                    >
                      <Icon name="edit" />EDIT
                    </Button>
                  }
                  header="Update Store Info"
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
                      onClick={() => this.handleUpdate(store)}
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
                  content="This action will permanently erase this store from our database. Are you sure?"
                  actions={[
                    "Cancel",
                    <Button
                      key={"delete"}
                      onClick={() => this.handleDelete(store)}
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
                itemsCount={storesCount}
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
    const { name, address } = this.state.newStore;

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          closeOnDimmerClick={false}
          trigger={
            <Button primary onClick={this.handleNewStore}>
              <Icon name="shop" />New Store
            </Button>
          }
          header="Create New Store"
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
        {this.renderStoresTable()}
      </React.Fragment>
    );
  }
}

export default Store;
