import React from 'react';

import './dependencies-tree.css';

function DependenciesTree ({ data }) {

  if ((data && !Object.keys(data).length) || !data ) return null;

  return (
    <div className="dependenciesTree">
      <div className="dependenciesTreeItem">
        <div className="dependenciesTreeItemInner">{ data.name } : { data.version } </div>
        { (data.dependencies || []).map(
          (item) => <DependenciesTree key={ item.key } data={ item } />
        ) }
      </div>
    </div>
  );
}

export default DependenciesTree;
