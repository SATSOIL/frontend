interface LanguageSwitcherProps {
    setLanguage: (lang: string) => void;
  }
  
  const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ setLanguage }) => {
    return (
      <div className="lang-switcher">
        <button onClick={() => setLanguage('ja')}>日本語</button>
        <button onClick={() => setLanguage('en')}>English</button>
      </div>
    );
  };
  
  export default LanguageSwitcher;