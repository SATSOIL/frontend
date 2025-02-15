const TabContainer: React.FC = () => {
    const switchSearchTab = (tab: string) => {
      const simpleDiv = document.getElementById("simpleSearch");
      const detailedDiv = document.getElementById("detailedSearch");
      const tabSimple = document.getElementById("tabSimple");
      const tabDetailed = document.getElementById("tabDetailed");
      if (tab === "simple") {
        if (simpleDiv) simpleDiv.style.display = "block";
        if (detailedDiv) detailedDiv.style.display = "none";
        if (tabSimple) tabSimple.classList.add("active");
        if (tabDetailed) tabDetailed.classList.remove("active");
      } else {
        if (simpleDiv) simpleDiv.style.display = "none";
        if (detailedDiv) detailedDiv.style.display = "block";
        if (tabSimple) tabSimple.classList.remove("active");
        if (tabDetailed) tabDetailed.classList.add("active");
      }
    };
  
    return (
      <div className="tab-container">
        <button className="tab active" id="tabSimple" onClick={() => switchSearchTab('simple')} data-i18n="tabcontainer.simpleserach">簡易検索</button>
        <button className="tab" id="tabDetailed" onClick={() => switchSearchTab('detailed')} data-i18n="tabcontainer.detailserach">詳細検索</button>
      </div>
    );
  };
  
  export default TabContainer;