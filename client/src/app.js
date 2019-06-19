import React, { useReducer } from 'react';
import Immutable from 'seamless-immutable';

import './assets/app.css';
import SearchInput from "./components/search-input";
import DependenciesTree from "./components/dependencies-tree";

const reducer = (state, { type, meta, payload}) => {
  switch (type) {
    case 'fetchData':
      return Immutable({ ...state, data: payload });
    case 'search':
      return Immutable({ ...state, searchData: payload });
    default:
      throw new Error();
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, { data: Immutable({})});

  const saveResponseData = ({ payload }) => dispatch({ type: 'fetchData' , payload});
  const saveSearchData = ({ payload }) => dispatch({ type: 'search' , payload});

  return (
    <div className="appWrapper">
      <div className="appContent">
        <SearchInput saveResponseData={ saveResponseData }
                     saveSearchData={ saveSearchData }
                     searchData={ state.searchData }/>
       <div className="appContentTreeWrapper">
          <DependenciesTree data={ state.data }/>
       </div>
      </div>
    </div>
  );
};

export default App;
