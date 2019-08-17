import React, { Component } from "react";
import { Icon, Modal, Button, Table, Form } from "semantic-ui-react";
import Joi from "joi-browser";
import Pagination from "./common/Pagination";
import Axios from "axios";

const apiProducts = "api/Products";

class Product extends Component {
  state = {
    products: [],
    pageSize: 5,
    currentPage: 1,
    newProduct: { name: "", price: "" },
    errors: { name: null, price: null }
  };

  schema = {
    name: Joi.string().required(),
    price: Joi.number()
      .positive()
      .required()
  };

  validateForm = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.newProduct, this.schema, options);

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
    const { data: products } = await Axios.get(apiProducts);
    products.reverse();
    this.setState({ products });
  }

  handleNewProduct = () => {
    const newProduct = { name: "", price: "" };
    const errors = { name: null, price: null };
    this.setState({ newProduct, errors });
  };

  handleCreate = async () => {
    const { newProduct } = this.state;
    const { data: product } = await Axios.post(apiProducts, newProduct);

    const products = [product, ...this.state.products];
    const currentPage = 1;
    this.setState({ products, currentPage });
  };

  handleEdit = product => {
    const newProduct = { ...product };
    const errors = { name: null, price: null };
    this.setState({ newProduct, errors });
  };

  handleUpdate = async product => {
    const { newProduct } = this.state;
    newProduct.id = product.id;
    await Axios.put(apiProducts + "/" + product.id, newProduct);

    const products = [...this.state.products];
    const i = products.indexOf(product);
    if (~i) {
      products[i] = newProduct;
    }
    this.setState({ products });
  };

  handleDelete = async product => {
    const { data: deletedProduct } = await Axios.delete(
      apiProducts + "/" + product.id
    );

    const products = this.state.products.filter(
      c => c.id !== deletedProduct.id
    );
    this.setState({ products });
  };

  handleInputChange = (e, { name, value }) => {
    const newProduct = { ...this.state.newProduct };
    newProduct[name] = value;

    const errors = { ...this.state.errors };
    errors[name] = this.validateField(name, value);

    this.setState({ newProduct, errors });
  };

  handlePageChange = pageNumber => {
    this.setState({ currentPage: pageNumber });
  };

  handlePageSizeChange = (e, { value }) => {
    this.setState({ pageSize: value, currentPage: 1 });
  };

  renderProductsTable() {
    const { products } = this.state;
    const { length: productsCount } = products;
    const { pageSize, currentPage } = this.state;
    const { name, price } = this.state.newProduct;
    const { name: nameError, price: priceError } = this.state.errors;

    if (productsCount === 0) return <h3>Opps, we don't have any product!</h3>;

    const currentPageProducts = products.filter(
      c =>
        products.indexOf(c) >= (currentPage - 1) * pageSize &&
        products.indexOf(c) < currentPage * pageSize
    );

    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Price</Table.HeaderCell>
            <Table.HeaderCell />
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {currentPageProducts.map(product => (
            <Table.Row key={product.id}>
              <Table.Cell>{product.name}</Table.Cell>
              <Table.Cell>{product.price}</Table.Cell>
              <Table.Cell>
                <Modal
                  dimmer="blurring"
                  closeOnDimmerClick={false}
                  trigger={
                    <Button
                      color="yellow"
                      onClick={() => this.handleEdit(product)}
                    >
                      <Icon name="edit" />EDIT
                    </Button>
                  }
                  header="Update Product Info"
                  content={
                    <Form style={{ margin: 30 }}>
                      <Form.Input
                        error={nameError}
                        required
                        label="NAME"
                        name="name"
                        value={name}
                        onChange={this.handleInputChange}
                      />
                      <Form.Input
                        required
                        error={priceError}
                        label="PRICE"
                        name="price"
                        value={price}
                        onChange={this.handleInputChange}
                      />
                    </Form>
                  }
                  actions={[
                    "Cancel",
                    <Button
                      key={"edit"}
                      disabled={this.validateForm() ? true : false}
                      onClick={() => this.handleUpdate(product)}
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
                  content="This action will permanently erase this product from our database. Are you sure?"
                  actions={[
                    "Cancel",
                    <Button
                      key={"delete"}
                      onClick={() => this.handleDelete(product)}
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
                itemsCount={productsCount}
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
    const { name, price } = this.state.newProduct;
    const { name: nameError, price: priceError } = this.state.errors;

    return (
      <React.Fragment>
        <Modal
          dimmer="blurring"
          closeOnDimmerClick={false}
          trigger={
            <Button primary onClick={this.handleNewProduct}>
              <Icon name="laptop" />New Product
            </Button>
          }
          header="Create New Product"
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
                error={priceError}
                label="PRICE"
                name="price"
                value={price}
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
        {this.renderProductsTable()}
      </React.Fragment>
    );
  }
}

export default Product;
