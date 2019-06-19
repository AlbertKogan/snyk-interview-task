import React from 'react';
import './search-box.css';

const SearchBox = ({ data, onItemClick }) => {
  if (!data) {
    return null;
  }

  return (<div className="searchBoxWrapper">
    { data.map((item, index) => {
      return <div className="searchBoxItem"
                  key={ index }
                  onClick={ onItemClick({ name: item }) } >{ item }</div>
    })}
  </div>)
};

export default SearchBox;
