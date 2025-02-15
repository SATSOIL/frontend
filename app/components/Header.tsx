import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import Nav from './Nav';

interface HeaderProps {
  setLanguage: (lang: string) => void;
}

const Header: React.FC<HeaderProps> = ({ setLanguage }) => {
  return (
    <header>
      <h1>SATSOIL</h1>
      <LanguageSwitcher setLanguage={setLanguage} />
      <Nav />
    </header>
  );
};

export default Header;