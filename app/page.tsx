'use client';

import { useEffect, useState } from 'react';
import Header from './components/Header';
import TabContainer from './components/TabContainer';
import { updateLanguage } from '../utils/translations';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import Nav from './components/Nav';

const Home: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'ja' | 'en'>('ja');

  useEffect(() => {
    updateLanguage(currentLang);
  }, [currentLang]);

  return (
    <div>
      <Header setLanguage={setCurrentLang} />
      <main>
        <section id="home" className="active">
          <h2 data-i18n="section.home.title">ダッシュボード</h2>
          <p>
            ようこそ。SATSOILは最新の農地投資市場情報、注目案件および各種通知を提供する統合プラットフォームです。
          </p>
          <br />
          <h3 data-i18n="section.home.recommended">注目の農地</h3>
          <div className="card-grid">
            <div className="card" onClick={() => alert('農地Aの詳細画面に遷移')}>
              <img src="https://placehold.jp/800x400?text=Farm+A" alt="農地A" />
              <div className="title">農地A</div>
              <div className="subtitle">
                予想ROI : 8%<br />
                洪水リスク：低
              </div>
            </div>
            <div className="card" onClick={() => alert('農地Bの詳細画面に遷移')}>
              <img src="https://placehold.jp/800x400?text=Farm+B" alt="農地B" />
              <div className="title">農地B</div>
              <div className="subtitle">
                予想ROI : 10%<br />
                洪水リスク：中
              </div>
            </div>
            <div className="card" onClick={() => alert('農地Cの詳細画面に遷移')}>
              <img src="https://placehold.jp/800x400?text=Farm+C" alt="農地C" />
              <div className="title">農地C</div>
              <div className="subtitle">
                予想ROI : 6%<br />
                病害虫リスク：低
              </div>
            </div>
          </div>
          <br />
          <h3 data-i18n="section.home.alerts">最新市場レポート</h3>
          <ul>
            <li>2025/01/31: 農地BエリアのNDVI指標が上昇傾向</li>
            <li>2025/01/29: 台風接近に伴う強風注意報 ( 地域X )</li>
            <li>2025/01/27: 農地Dにおける土壌pH改善の兆候検出</li>
            <li>2025/01/25: 農地Mで輪作効果向上が確認</li>
            <li>2025/01/20: 新規作物試験結果（トマト・レタス）を発表</li>
          </ul>
        </section>

        <section id="search">
          <h2 data-i18n="section.search.title">農地検索</h2>
          <TabContainer />
          <div id="simpleSearch">
            <div className="filter-area">
              <label htmlFor="regionGroup" data-i18n="section.search.regionGroup">
                地域グループ:
              </label>
              <select id="regionGroup" onChange={() => alert('地域グループが変更されました')}>
                <option value="">指定なし</option>
                <option value="Asia">Asia</option>
                <option value="Africa">Africa</option>
                <option value="Europe">Europe</option>
                <option value="NorthAmerica">North America</option>
                <option value="SouthAmerica">South America</option>
                <option value="Oceania">Oceania</option>
              </select>
              <label htmlFor="country">国:</label>
              <select id="country" onChange={() => alert('国が変更されました')}>
                <option value="">指定なし</option>
              </select>
              <label htmlFor="prefecture">
                都道府県/州:
              </label>
              <select id="prefecture">
                <option value="">指定なし</option>
              </select>
              <label htmlFor="regionDetail" data-i18n="section.search.regionDetail">
                地域詳細:
              </label>
              <input type="text" id="regionDetail" placeholder="例 : Tokyo, Kenya" />
              <label htmlFor="minScore" data-i18n="section.search.evalRange">
                評価スコア範囲:
              </label>
              <input type="number" id="minScore" placeholder="下限" min="0" max="100" />
              <input type="number" id="maxScore" placeholder="上限" min="0" max="100" />
            </div>
          </div>
          <div id="detailedSearch" style={{ display: 'none' }}>
            <div className="filter-area">
              <label htmlFor="soil" data-i18n="section.search.soil">
                土壌pH:
              </label>
              <select id="soil">
                <option value="">指定なし</option>
                <option value="low"> ~ 5.5 (酸性寄り)</option>
                <option value="medium">5.5 ~ 6.5 (中性)</option>
                <option value="high">6.5 ~ (アルカリ寄り)</option>
              </select>
              <label htmlFor="floodRisk" data-i18n="section.search.floodRisk">
                洪水リスク:
              </label>
              <select id="floodRisk">
                <option value="">指定なし</option>
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
              <label htmlFor="cropType" data-i18n="section.search.crop">
                作物:
              </label>
              <select id="cropType">
                <option value="">指定なし</option>
                <option value="rice">米</option>
                <option value="wheat">小麦</option>
                <option value="soy">大豆</option>
                <option value="tomato">トマト</option>
                <option value="lettuce">レタス</option>
                <option value="cucumber">キュウリ</option>
                <option value="pepper">ピーマン</option>
                <option value="cotton">綿</option>
              </select>
              <label htmlFor="waterSupply" data-i18n="section.search.irrigation">
                灌漑設備充実度:
              </label>
              <input type="number" id="waterSupply" placeholder="0 ~ 100" min="0" max="100" />
              <label htmlFor="accessibility" data-i18n="section.search.accessibility">
                交通アクセス利便性:
              </label>
              <input type="number" id="accessibility" placeholder="0 ~ 100" min="0" max="100" />
              <label htmlFor="cropDiversity" data-i18n="section.search.cropVariety">
                作付け多様性:
              </label>
              <input type="number" id="cropDiversity" placeholder="0 ~ 100" min="0" max="100" />
            </div>
          </div>
          <div className="filter-submit">
            <button className="btn" onClick={() => alert('検索ボタンが押されました')} data-i18n="section.search.search">
              検索
            </button>
          </div>
          <div id="map" className="map-placeholder"></div>
          <h3>検索結果</h3>
          <div className="card-grid" id="searchResults"></div>
        </section>

        <section id="mypage">
          <h2 data-i18n="section.mypage.title">投資ポートフォリオ</h2>
          <h3>投資中の農地</h3>
          <table>
            <thead>
              <tr>
                <th>農地名</th>
                <th>投資額</th>
                <th>現在価値</th>
                <th>予測ROI</th>
              </tr>
            </thead>
            <tbody id="investedFarmsTable"></tbody>
          </table>
          <br />
          <h3>ウォッチリスト</h3>
          <ul id="watchlist"></ul>
          <br />
          <h3>レポート一覧</h3>
          <ul className="list-group">
            <li className="list-group-item d-flex flex-column align-items-center">
              <a href="#" className="btn btn-secondary mb-2">2025/01/15 レポートダウンロード</a>
              <img src="https://placehold.jp/300x400?text=Report+Preview" alt="レポートプレビュー" className="img-fluid" />
            </li>
            <li className="list-group-item d-flex flex-column align-items-center">
              <a href="#" className="btn btn-secondary mb-2">2024/12/30 レポートダウンロード</a>
              <img src="https://placehold.jp/300x400?text=Report+Preview" alt="レポートプレビュー" className="img-fluid" />
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Home;