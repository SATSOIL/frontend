'use client';

import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import TabContainer from './components/TabContainer';
import { updateLanguage } from '../utils/translations';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import dynamic from 'next/dynamic';

const MapWithPolygon = dynamic(() => import('./components/MapWithPolygon'), { ssr: false });

function dmsToDecimal(degrees: number, minutes: number, seconds: number): number {
  return degrees + (minutes/60) + (seconds/3600);
}

const Home: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<'ja' | 'en'>('ja');
  const mapRef = useRef<HTMLDivElement>(null);
  const handleSetLanguage = (lang: string) => {
    if (lang === 'ja' || lang === 'en') {
      setCurrentLang(lang);
    } else {
      console.warn(`Unsupported language: ${lang}`);
    }
  };

  useEffect(() => {
    updateLanguage(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      
      if (mapRef.current) {
        const map = L.map(mapRef.current).setView([43.0621, 141.3544], 6);
  
        // 衛星画像タイルレイヤーを追加
        L.tileLayer(
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri'
          }
        ).addTo(map);
  
        // リサイズ対応
        const resizeObserver = new ResizeObserver(() => {
          map.invalidateSize();
        });
        resizeObserver.observe(mapRef.current);
  
        return () => {
          resizeObserver.disconnect();
          map.remove();
        };
      }
    };
  
    initMap();
  }, []);

  return (
    <div>
      <Header setLanguage={handleSetLanguage} />
      <main>
        <section id="home" className="active">
          <h2 data-i18n="section.home.title">ダッシュボード</h2>
          <p data-i18n="section.home.text">
            ようこそ。SATSOILは最新の農地投資市場情報、注目案件および各種通知を提供する統合プラットフォームです。
          </p>
          <br />
          <h3 data-i18n="section.home.recommended">注目の農地</h3>
          <div className="card-grid">
            <div className="card">
              <MapWithPolygon 
                polygonCoordinates={[
                  [dmsToDecimal(43, 1, 44), dmsToDecimal(141, 38, 45)],
                  [dmsToDecimal(43, 2, 13), dmsToDecimal(141, 38, 16)],
                  [dmsToDecimal(43, 1, 53), dmsToDecimal(141, 37, 36)],
                  [dmsToDecimal(43, 1, 23), dmsToDecimal(141, 38, 4)],
                ]}
                style={{ height: '400px', width: '350px' }}
              />
              <div className="title" data-i18n="section.card_grid_1">農地A</div>
              <div className="subtitle" data-i18n="section.card_grid_sub1">
                予想ROI : 8%<br />
                洪水リスク：低
              </div>
            </div>
            <div className="card">
              <MapWithPolygon 
                polygonCoordinates={[
                  [dmsToDecimal(43, 51, 14), dmsToDecimal(144, 31, 4)],
                  [dmsToDecimal(43, 51, 14), dmsToDecimal(144, 30, 26)],
                  [dmsToDecimal(43, 51, 30), dmsToDecimal(144, 30, 26)],
                  [dmsToDecimal(43, 51, 30), dmsToDecimal(144, 31, 4)],
                ]}
                style={{ height: '400px', width: '350px' }}
              />
              <div className="title" data-i18n="section.card_grid_2">農地B</div>
              <div className="subtitle" data-i18n="section.card_grid_sub2">
                予想ROI : 10%<br />
                洪水リスク：中
              </div>
            </div>
            <div className="card">
              <MapWithPolygon 
                polygonCoordinates={[
                  [dmsToDecimal(43, 50, 0), dmsToDecimal(144, 30, 24)],
                  [dmsToDecimal(43, 52, 0), dmsToDecimal(144, 30, 24)],
                  [dmsToDecimal(43, 52, 0), dmsToDecimal(144, 33, 40)],
                  [dmsToDecimal(43, 50, 0), dmsToDecimal(144, 33, 40)],
                ]}
                style={{ height: '400px', width: '350px' }}
              />
              <div className="title" data-i18n="section.card_grid_3">農地C</div>
              <div className="subtitle" data-i18n="section.card_grid_sub3">
                予想ROI : 6%<br />
                病害虫リスク：低
              </div>
            </div>
          </div>
          <br />
          <h3 data-i18n="section.home.alerts">最新市場レポート</h3>
          <ul>
            <li data-i18n="section.home.alerts_t1">2025/01/31: 農地BエリアのNDVI指標が上昇傾向</li>
            <li data-i18n="section.home.alerts_t2">2025/01/29: 台風接近に伴う強風注意報 ( 地域X )</li>
            <li data-i18n="section.home.alerts_t3">2025/01/27: 農地Dにおける土壌pH改善の兆候検出</li>
            <li data-i18n="section.home.alerts_t4">2025/01/25: 農地Mで輪作効果向上が確認</li>
            <li data-i18n="section.home.alerts_t5">2025/01/20: 新規作物試験結果（トマト・レタス）を発表</li>
          </ul>
        </section>

        <section id="search">
          <h2 data-i18n="section.search.title">農地検索</h2>
          <TabContainer />
          <div id="simpleSearch">
            <div className="filter-area flex flex-row items-center gap-4 p-4">
              <div className="flex flex-col">
                <label htmlFor="regionGroup" data-i18n="section.search.regionGroup">
                  地域グループ:
                </label>
                <select id="regionGroup" className="w-full p-2 border rounded">
                  <option value="" data-i18n="section.search.region.none">指定なし</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="NorthAmerica">North America</option>
                  <option value="SouthAmerica">South America</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="country" data-i18n="simplesearch_country">Country:</label>
                <select id="country" className="w-full p-2 border rounded">
                  <option value="" data-i18n="simplesearch_country_nonassign">指定なし</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="prefecture" data-i18n="simplesearch_state">Prefecture/State:</label>
                <select id="prefecture" className="w-full p-2 border rounded">
                  <option value="" data-i18n="simplesearch_state_nonassign">指定なし</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label htmlFor="regionDetail" data-i18n="section.search.regionDetail">
                  地域詳細:
                </label>
                <input 
                  type="text" 
                  id="regionDetail" 
                  placeholder="例 : Tokyo, Kenya" 
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Updated evaluation score range to display elements horizontally */}
              <div className="flex items-center gap-2">
                <label htmlFor="minScore" data-i18n="section.search.evalRange">
                  評価スコア範囲:
                </label>
                <select className="p-2 border rounded">
                  <option data-i18n="section.evalRange.lower">下限</option>
                </select>
                <input
                  type="number"
                  id="minScore"
                  className="w-16 p-2 border rounded"
                  min="0"
                  max="100"
                  defaultValue="1"
                />
              </div>
            </div>
          </div>
          <div id="detailedSearch" style={{ display: 'none' }}>
            <div className="filter-area">
              <label htmlFor="soil" data-i18n="section.search.soil">
                土壌pH:
              </label>
              <select id="soil">
                <option value=""  data-i18n="section.soil.ph">指定なし</option>
                <option value="low"> ~ 5.5 </option>
                <option value="medium">5.5 ~ 6.5 </option>
                <option value="high">6.5 ~ </option>
              </select>
              <label htmlFor="floodRisk" data-i18n="section.search.floodRisk">
                洪水リスク:
              </label>
              <select id="floodRisk">
                <option value="" data-i18n="section.flood.lisk">指定なし</option>
                <option value="low" data-i18n="section.flood_low">低</option>
                <option value="medium" data-i18n="section.flood_middle">中</option>
                <option value="high" data-i18n="section.flood_high">高</option>
              </select>
              <label htmlFor="cropType" data-i18n="section.search.crop">
                作物:
              </label>
              <select id="cropType">
                <option value="" data-i18n="section.search.crop_none">指定なし</option>
                <option value="rice" data-i18n="section.search.crop_rice">米</option>
                <option value="wheat" data-i18n="section.search.crop_flowr">小麦</option>
                <option value="soy" data-i18n="section.search.crop_soy">大豆</option>
                <option value="tomato" data-i18n="section.search.crop_tomato">トマト</option>
                <option value="lettuce" data-i18n="section.search.crop_lettuce">レタス</option>
                <option value="cotton" data-i18n="section.search.crop_cotton">綿</option>
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
            <button className="btn" data-i18n="section.search.search">
              検索
            </button>
          </div>
          {/* Leaflet map initialization area for 農地検索 */}
          <div
            id="map"
            ref={mapRef}
            style={{ height: '300px', width: '100%', background: 'none' }}
          ></div>
          <h3 data-i18n="section.search.result">検索結果</h3>
          <div className="card-grid" id="searchResults"></div>
        </section>

        <section id="mypage">
          <h2 data-i18n="section.mypage.title">投資ポートフォリオ</h2>
          <h3 data-i18n="section.mypage.subtitle">投資中の農地</h3>
          <table>
            <thead>
              <tr>
                <th data-i18n="section.mypage.t1">農地名</th>
                <th data-i18n="section.mypage.t2">投資額</th>
                <th data-i18n="section.mypage.t3">現在価値</th>
                <th data-i18n="section.mypage.t4">予測ROI</th>
              </tr>
            </thead>
            <tbody id="investedFarmsTable"></tbody>
          </table>
          <br />
          <h3 data-i18n="section.mypage.watchlist">ウォッチリスト</h3>
          <ul id="watchlist"></ul>
          <br />
          <h3 data-i18n="section.mypage.reportlist">レポート一覧</h3>
          <ul className="list-group">
            <li className="list-group-item d-flex flex-column align-items-center">
              <a href="#" className="btn btn-secondary mb-2" data-i18n="section.reportdownload.1">2025/01/15 レポートダウンロード</a>
              <img src="https://placehold.jp/300x400?text=Report+Preview" alt="レポートプレビュー" className="img-fluid" />
            </li>
            <li className="list-group-item d-flex flex-column align-items-center">
              <a href="#" className="btn btn-secondary mb-2" data-i18n="section.reportdownload.2">2024/12/30 レポートダウンロード</a>
              <img src="https://placehold.jp/300x400?text=Report+Preview" alt="レポートプレビュー" className="img-fluid" />
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Home;