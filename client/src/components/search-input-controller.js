import { useState, useRef } from 'react';

import {getResolvedPackageDependencies, searchPackage} from "../lib/api";
import {useDebouncedCallback} from "use-debounce";

export const useSearch = ({ saveResponseData, saveSearchData }) => {
  const [inputs, setInputs] = useState({ package: '' });
  const [errorState, setErrorState] = useState(false);

  const inputEl = useRef(null);

  const submit = (event) => {
    event.preventDefault();

    const value = inputEl.current.value;

    if (!value) { return setInputs(() => ({package: ''})); }

    setInputs(() => ({package: value}));
    // Hide search panel
    saveSearchData({ payload: null });
    getResolvedPackageDependencies({ name: inputs.package }).then(({ data, status }) => {
      if (status === 'fail') {
        setErrorState(true);

        return;
      }

      saveResponseData({ payload: data });
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

  const search = ({ name }) =>
    searchPackage({ name }).then(
    ({ data, status }) => {
        if (status === 'fail') {
          setErrorState(true);

          return;
        }
        setErrorState(false);
        saveSearchData({ payload: data })
      }).catch((error) => {
        console.log('error', error)
      });

  const [debouncedSearch] = useDebouncedCallback(search, 200);

  const handleInputChange = () => {
    if (errorState) {
      setErrorState(false);
    }
    const value = inputEl.current.value;

    if (!value) { return setInputs(() => ({package: ''})); }

    setInputs(() => ({package: value}));
    debouncedSearch({ name: value });
  };

  const handleEnterPress = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      submit(event)
    }
  };

  return { submit, handleInputChange, inputs, setName, handleEnterPress, errorState, inputEl };
};
