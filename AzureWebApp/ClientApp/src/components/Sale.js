import React, { Component } from "react";
import { Icon, Modal, Button, Table, Form } from "semantic-ui-react";
import Pagination from "./common/Pagination";
import Axios from "axios";

const apiSales = "api/Sales";
const apiCustomers = "api/Customers";
const apiProducts = "api/Products";
const apiStores = "api/Stores";

class Sale extends Component {
  state = {
    sales: [],
    customers: [],
    products: [],
    stores: [],
    salesViewModel: [],
    pageSize: 5,
    currentPage: 1,
    newSale: {
      customerId: 0,
      productId: 0,
      storeId: 0,
      dateSold: ""
    }
  };

  async componentDidMount() {
    const { data: sales } = await Axios.get(apiSales);
    sales.reverse();
    this.setState({ sales });

    const { data: salesViewModel } = await Axios.get(apiSales + "/view");
    salesViewModel.reverse();
    this.setState({ salesViewModel });

    const { data: customers } = await Axios.get(apiCustomers + "/options");
    customers.reverse();
    this.setState({ customers });

    const { data: products } = await Axios.get(apiProducts + "/options");
    products.reverse();
    this.setState({ products });

    const { data: stores } = await Axios.get(apiStores + "/options");
    stores.reverse();
    this.setState({ stores });
  }

  handleNewSale = () => {
    const newSale = {
      customerId: 0,
      productId: 0,
      storeId: 0,
      dateSold: ""
    };
    this.setState({ newSale });
  };

  handleCreate = async () => {
    const { newSale } = this.state;
    const { data: sale } = await Axios.post(apiSales, newSale);
    const { data: salesViewModel } = await Axios.get(apiSales + "/view");
    salesViewModel.reverse();

    const sales = [sale, ...this.state.sales];
    const currentPage = 1;
    this.setState({ sales, currentPage, salesViewModel });
  };

  handleEdit = sale => {
    const newSale = this.state.sales.find(s => s.id === sale.id);
    const { dateSold } = newSale;
    const dateString = dateSold.substring(0, 10);
    newSale.dateSold = dateString;

    this.setState({ newSale });
  };

  handleUpdate = async sale => {
    const { newSale } = this.state;
    newSale.id = sale.id;
    await Axios.put(apiSales + "/" + sale.id, newSale);

    const sales = [...this.state.sales];
    const i = sales.indexOf(sale);
    if (~i) {
      sales[i] = newSale;
    }

    const { data: salesViewModel } = await Axios.get(apiSales + "/view");
    salesViewModel.reverse();

    this.setState({ sales, salesViewModel });
  };

  handleEdit = sale => {
    const newSale = this.state.sales.find(s => s.id === sale.id);
    const { dateSold } = newSale;
    const dateString = dateSold.substring(0, 10);
    newSale.dateSold = dateString;

    this.setState({ newSale });
  };

  handleDelete = async sale => {
    const { data: deletedSale } = await Axios.delete(apiSales + "/" + sale.id);

    const sales = this.state.sales.filter(s => s.id !== deletedSale.id);

    const salesViewModel = this.state.salesViewModel.filter(
      sv => sv.id !== deletedSale.id
    );

    this.setState({ sales, salesViewModel });
  };

  handleInputChange = (e, { name, value }) => {
    const newSale = { ...this.state.newSale };
    newSale[name] = value;
    this.setState({ newSale });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = (e, { value }) => {
    this.setState({ pageSize: value, currentPage: 1 });
  };

  rendersalesTable() {
    const { salesViewModel } = this.state;
    const { length: salesCount } = salesViewModel;
    const { pageSize, currentPage } = this.state;
    const { customerId, productId, storeId, dateSold } = this.state.newSale;

    if (salesCount === 0) return <h3>Opps, we don't have any sale!</h3>;

    const currentPageSales = salesViewModel.filter(
      s =>
        salesViewModel.indexOf(s) >= (currentPage - 1) * pageSize &&
        salesViewModel.indexOf(s) < currentPage * pageSize
    );

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Customer</Table.HeaderCell>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell>Store</Table.HeaderCell>
            <Table.HeaderCell>Date Sold</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentPageSales.map(sale => (
            <Table.Row key={sale.id}>
              <Table.Cell>{sale.customerName}</Table.Cell>
              <Table.Cell>{sale.productName}</Table.Cell>
              <Table.Cell>{sale.storeName}</Table.Cell>
              <Table.Cell>{sale.dateSold}</Table.Cell>

              <Table.Cell>
                <Modal
                  dimmer="blurring"
                  closeOnDimmerClick={false}
                  trigger={
                    <Button
                      color="yellow"
                      onClick={() => this.handleEdit(sale)}
                    >
                      <Icon name="edit" />EDIT
                    </Button>
                  }
                  header="Update Sale Info"
                  content={
                    <Form style={{ margin: 30 }}>
                      <Form.Dropdown
                        required
                        label="Customer"
                        name="customerId"
                        value={customerId}
                        selection
                        search
                        options={this.state.customers}
                        onChange={this.handleInputChange}
                      />
                      <Form.Dropdown
                        required
                        label="Product"
                        name="productId"
                        value={productId}
                        selection
                        search
                        options={this.state.products}
                        onChange={this.handleInputChange}
                      />
                      <Form.Dropdown
                        required
                        label="Store"
                        name="storeId"
                        value={storeId}
                        selection
                        search
                        options={this.state.stores}
                        onChange={this.handleInputChange}
                      />
                      <Form.Input
                        required
                        type="Date"
                        label="Date Sold"
                        name="dateSold"
                        value={dateSold}
                        onChange={this.handleInputChange}
                      />
                    </Form>
                  }
                  actions={[
                    "Cancel",
                    <Button
                      key={"edit"}
                      onClick={() => this.handleUpdate(sale)}
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
                  content="This action will permanently erase this sale from our database. Are you sure?"
                  actions={[
                    "Cancel",
                    <Button
                      key={"delete"}
                      onClick={() => this.handleDelete(sale)}
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
            <Table.HeaderCell colSpan="6">
              <Pagination
                itemsCount={salesCount}
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
    const { customerId, productId, storeId, dateSold } = this.state.newSale;

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          closeOnDimmerClick={false}
          trigger={
            <Button primary onClick={this.handleNewSale}>
              <Icon name="clipboard" />New Sale
            </Button>
          }
          header="Create New Sale"
          content={
            <Form style={{ margin: 30 }}>
              <Form.Dropdown
                required
                label="Customer"
                name="customerId"
                value={customerId}
                selection
                search
                options={this.state.customers}
                onChange={this.handleInputChange}
              />
              <Form.Dropdown
                required
                label="Product"
                name="productId"
                value={productId}
                selection
                search
                options={this.state.products}
                onChange={this.handleInputChange}
              />
              <Form.Dropdown
                required
                label="Store"
                name="storeId"
                value={storeId}
                selection
                search
                options={this.state.stores}
                onChange={this.handleInputChange}
              />
              <Form.Input
                required
                type="Date"
                label="Date Sold"
                name="dateSold"
                value={dateSold}
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
        {this.rendersalesTable()}
      </React.Fragment>
    );
  }
}

export default Sale;
