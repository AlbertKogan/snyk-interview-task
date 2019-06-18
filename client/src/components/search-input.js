import React, { useState } from 'react';
import debounce from 'debounce';

import { getResolvedPackageDependencies, searchPackage } from './../lib/api';
import SearchBox from './search-box';
import SearchIcon from './search-icon';

import './search-input.css';

const useSearch = ({ saveResponseData, saveSearchData }) => {
  const [inputs, setInputs] = useState({});

  const submitForm = (event) => {
    event.preventDefault();

    if (!event.target.value) { return; }

    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    getResolvedPackageDependencies({ name: inputs.package }).then(({ data }) => {
      saveResponseData({ payload: data });
      // Hide search panel
      saveSearchData({ payload: null });
    });
  };

  const setName = ({ name }) => (event) => {
    event.preventDefault();

    setInputs(inputs => ({...inputs, package: name}));
    getResolvedPackageDependencies({ name }).then(({ data }) => {
      saveResponseData({ payload: data });
      // Hide search panel
      saveSearchData({ payload: null });
    });
  };

  const search = ({ name }) => {
    searchPackage({ name }).then(({ data }) => {
      saveSearchData({ payload: data })
    });
  };

  const debouncedSearch = debounce(search, 200);

  const handleInputChange = (event) => {
    event.persist();

    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
    debouncedSearch({ name: event.target.value});
  };

  const handleEnterPress = (event) => {
    if (event.keyCode === 13) {
      // Cancel the default action, if needed
      event.preventDefault();
      // Trigger the button element with a click
      submitForm(event)
    }
  };

  return { submitForm, handleInputChange, inputs, setName, handleEnterPress };
};

const SearchInput = ({ saveResponseData, saveSearchData, searchData }) => {
  const { submitForm, handleInputChange, inputs, setName, handleEnterPress } = useSearch({ saveResponseData, saveSearchData });

  return (
    <div className="searchWrapper">
      <div className="searchContent">
        <form onSubmit={ submitForm } className="searchForm">
          <input type="text"
                 name="package"
                 className="searchInput"
                 value={ inputs.package }
                 placeholder="react@16.0.0 or @babel/core"
                 onKeyUp={ handleEnterPress }
                 onChange={ handleInputChange } />
          <button type="submit"
                  onClick={ submitForm }
                  className="searchButton">
            <SearchIcon />
          </button>
        </form>
        <SearchBox data={ searchData }
                   onItemClick={ setName } />
      </div>
    </div>
  );
};

export default SearchInput;
