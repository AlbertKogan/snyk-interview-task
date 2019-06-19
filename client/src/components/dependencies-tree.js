import React from 'react';

import './dependencies-tree.css';

function DependenciesTree ({ data }) {

  if (data && !Object.entries(data).length || !data ) return null;

  return (
    <div className="dependenciesTree">
      {
        Object.entries(data).map(([key, value], ) => {
          return (<div className="dependenciesTreeItem" key={ key }>
            <div className="dependenciesTreeItemInner">{ value.name } : { value.version } </div>
            <DependenciesTree data={ value.dependencies } />
          </div>)
        })
      }
    </div>
  );
}

export default DependenciesTree;
