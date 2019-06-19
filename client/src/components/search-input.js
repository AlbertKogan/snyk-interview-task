import React from 'react';
import cn from 'classnames';

import { useSearch } from './search-input-controller';

import SearchBox from './search-box';
import SearchIcon from './search-icon';

import './search-input.css';

const SearchInput = ({ saveResponseData, saveSearchData, searchData }) => {
  const {
    submit,
    handleInputChange,
    inputs,
    setName,
    handleEnterPress,
    errorState,
    inputEl
  } = useSearch({ saveResponseData, saveSearchData });

  return (
    <div className="searchWrapper">
      <div className="searchContent">
        <div className="searchForm">
          <input type="text"
                 name="package"
                 ref={ inputEl }
                 className={ cn('searchInput', { 'searchInputError': errorState }) }
                 value={ inputs.package }
                 placeholder="react@16.0.0 or @babel/core"
                 onKeyUp={ (event) => handleEnterPress(event) }
                 onChange={ (event) => handleInputChange(event) } />
          <div onClick={ (event) => submit(event) }
               className="searchButton">
            <SearchIcon />
          </div>
        </div>
        { errorState && <div className="searchInputErrorMessage">Error :(</div>}
        <SearchBox data={ searchData }
                   onItemClick={ setName } />
      </div>
    </div>
  );
};

export default SearchInput;
