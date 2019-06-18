import React from 'react';

import './dependencies-tree.css';

function DependenciesTree ({ data }) {

  if (data && !Object.entries(data).length || !data ) return null;

  return (
    <ul className="dependenciesTree">
      {
        Object.entries(data).map(([key, value], ) => {
          return (<li className="dependenciesTreeItem" key={ key }>
            <span>{ value.name } : { value.version } </span>
            <DependenciesTree data={ value.dependencies } />
          </li>)
        })
      }
    </ul>
  );
}

export default DependenciesTree;
