const Nav: React.FC = () => {
    const showSection = (id: string) => {
      document.querySelectorAll('section').forEach((sec) => {
        sec.classList.remove('active');
        if (sec.id === id) {
          sec.classList.add('active');
        }
      });
    };
  
    return (
      <nav>
        <ul>
          <li onClick={() => showSection('home')}><span data-i18n="nav.home">ダッシュボード</span></li>
          <li onClick={() => showSection('search')}><span data-i18n="nav.search">農地検索</span></li>
          <li onClick={() => showSection('mypage')}><span data-i18n="nav.mypage">投資ポートフォリオ</span></li>
        </ul>
      </nav>
    );
  };
  
export default Nav;