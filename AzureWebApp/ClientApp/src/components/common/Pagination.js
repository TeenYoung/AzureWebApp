import React from "react";
import { Menu, Icon, Dropdown } from "semantic-ui-react";
import PropTypes from "prop-types";

const Pagination = props => {
  const {
    itemsCount,
    pageSize,
    onPageChange,
    currentPage,
    onPageSizeChange
  } = props;
  const pagesCount = Math.ceil(itemsCount / pageSize);

  const options = [
    { key: 1, text: "5", value: 5 },
    { key: 2, text: "10", value: 10 }
  ];

  var pageNumbers = [];
  for (var i = 1; i < pagesCount + 1; i++) {
    pageNumbers.push(i);
  }

  return (
    <React.Fragment>
      <Menu compact>
        <Dropdown
          options={options}
          value={pageSize}
          item
          onChange={onPageSizeChange}
        />
      </Menu>
      <Menu floated="right" pagination>
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon name="chevron left" />
        </Menu.Item>
        {pageNumbers.map(pageNumber => (
          <Menu.Item
            key={pageNumber}
            as="a"
            onClick={() => onPageChange(pageNumber)}
            active={pageNumber === currentPage}
          >
            {pageNumber}
          </Menu.Item>
        ))}
        <Menu.Item
          as="a"
          icon
          disabled={currentPage === pagesCount}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon name="chevron right" />
        </Menu.Item>
      </Menu>
    </React.Fragment>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageSizeChange: PropTypes.func.isRequired
};

export default Pagination;
