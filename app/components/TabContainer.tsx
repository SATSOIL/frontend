import React, { useState } from 'react';

const TabContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState('simple');

  const handleTabChange = (searchType: string) => {
    setActiveTab(searchType);
    const simpleSearch = document.getElementById('simpleSearch');
    const detailedSearch = document.getElementById('detailedSearch');
    
    if (searchType === 'simple') {
      simpleSearch?.style.setProperty('display', 'block');
      detailedSearch?.style.setProperty('display', 'none');
    } else {
      simpleSearch?.style.setProperty('display', 'none');
      detailedSearch?.style.setProperty('display', 'block');
    }
  };

  return (
    <div className="search-type-buttons">
      <div className="btn-group">
        <button 
          className={`btn ${activeTab === 'simple' ? 'active' : ''}`}
          onClick={() => handleTabChange('simple')}
          data-i18n="section.search.simple"
        >
          簡易検索
        </button>
        <button 
          className={`btn ${activeTab === 'detailed' ? 'active' : ''}`}
          onClick={() => handleTabChange('detailed')}
          data-i18n="section.search.detailed"
        >
          詳細検索
        </button>
      </div>
    </div>
  );
};

export default TabContainer;