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

  const [activeSection, setActiveSection] = useState('home');
  const [currentImageYear, setCurrentImageYear] = useState(2020);

  const handleCardClick = (farmId: string) => {
    setActiveSection(`${farmId}Detail`);
  };
  
  const changeFarmAImage = (year: number) => {
    setCurrentImageYear(year);
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
      <section id="home" className={activeSection === 'home' ? 'active' : ''}>
          <h2 data-i18n="section.home.title">ダッシュボード</h2>
          <p data-i18n="section.home.text">
            ようこそ。SATSOILは最新の農地投資市場情報、注目案件および各種通知を提供する統合プラットフォームです。
          </p>
          <br />
          <h3 data-i18n="section.home.recommended">注目の農地</h3>
          <div className="card-grid">
          <div className="card" onClick={() => handleCardClick('farmA')}>
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
        {/* 農地A詳細セクション */}
        <section id="farmADetail" className={activeSection === 'farmADetail' ? 'active' : ''}>
          <h2 data-i18n="farmA.info">農地A 詳細情報</h2>
          <p data-i18n="farmA.info.place.owner" >所在地：北海道・札幌市 / 面積：2.3 ha / オーナー：〇〇ファーム<br />
             潜在能力スコア：82（最適な土壌pHおよび輪作効果を反映）</p>
          <div className="detail-container">
            <div className="detail-image-area">
              <h3 data-i18n="farmA.satelite.timelaps" >衛星タイムラプス</h3>
              <img 
                id="farmAImage" 
                src={`https://placehold.jp/800x400?text=FarmA+${currentImageYear}`} 
                alt={`FarmA ${currentImageYear}`} 
              />
              <br/>
              <div className="button-group">
                {[2020, 2021, 2022].map(year => (
                  <button 
                    key={year}
                    className={`btn btn-secondary ${currentImageYear === year ? 'active' : ''}`}
                    onClick={() => changeFarmAImage(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
            <div className="detail-info-area">
              <div className="risk-container">
                <h3 data-i18n="farmA.risk">リスク指標</h3>
                <p data-i18n="farmA.flood.risk">洪水リスク：低</p>
                <p data-i18n="farmA.elosion.risk">土壌浸食リスク：低</p>
                <p data-i18n="farmA.pest.risk">病害虫リスク：中</p>
              </div>
              <div className="ndvi-container">
                <h3 data-i18n="farmA.NDVI.trans">NDVI 推移</h3>
                <img src="https://placehold.jp/600x300?text=FarmA+NDVI+Graph" alt="FarmA NDVI Graph" />
                <p data-i18n="farmA.NDVI">平均 NDVI：0.65（比較的安定）</p>
              </div>
              <div className="simulation-container">
                <h3 data-i18n="farmA.simulation">投資シミュレーション</h3>
                <p id="farmASimulationResult" data-i18n="farmA.simulation.result">
                  基準ROI：8%<br />
                  輪作最適化効果：＋2%<br />
                  生産管理改善効果：＋2%<br />
                  先物価格調整：＋0.5%<br />
                  --------------<br />
                  予測ROI：12.5%
                </p>
                <br/>
                <div className="button-group">
                  <button className="btn" onClick={() => setActiveSection('ddReport')} data-i18n="DDreport">
                    DDレポート生成
                  </button>
                  <button className="btn btn-secondary" onClick={() => setActiveSection('investFlow')} data-i18n="investing">
                    投資手続きへ
                  </button>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <button className="btn" onClick={() => alert('ウォッチリストに追加しました')} data-i18n="addWatchList">
                  ウォッチリストに追加
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* DDレポートセクション */}
        <section id="ddReport" className={activeSection === 'ddReport' ? 'active' : ''}>
          <h2 data-i18n="DDreport.content">DDレポート</h2>
          <p data-i18n="DDreort.text"> こちらは、投資判断に必要な解析データと詳細な分析コメントをまとめたレポートです。</p>
          <div className="dd-report-container">
            <h3 data-i18n="DDreort.text1">1. 農地概要</h3>
            <p data-i18n="DDreort.text1.place">所在地：北海道・札幌市</p>
            <p data-i18n="DDreort.text1.square">面積：2.3 ha</p>
            <p data-i18n="DDreort.text1.owner">オーナー：〇〇ファーム</p>
            <p data-i18n="DDreort.text1.score">潜在能力スコア：82</p>

            <h3 data-i18n="DDreort.tex2.analysis">2. 衛星解析</h3>
            <p data-i18n="DDreort.tex2.NDVI">平均 NDVI：0.60～0.65（安定推移）</p>
            <p data-i18n="DDreort.tex2.floodLisk">洪水リスク：低～中</p>
            <div className="satellite-image">
              <img 
                src="https://placehold.jp/800x400?text=Satellite+Analysis+Summary" 
                alt="Satellite Analysis" 
                className="w-full"
              />
            </div>

            <h3 data-i18n="DDreort.tex3.data">3. 土壌・気候データ</h3>
            <p data-i18n="DDreort.tex3.ph">土壌pH：6.0～6.5 / 有機物量：高め</p>
            <p data-i18n="DDreort.tex3.rain">年間降水量：約1200mm / 日照時間：2000h</p>

            <h3 data-i18n="DDreort.tex4.risk">4. リスク評価と収益性</h3>
            <ul>
              <li data-i18n="DDreort.tex4.pest.risk">病害虫リスク：低～中</li>
              <li data-i18n="DDreort.tex4.soil.risk">土壌浸食リスク：低</li>
              <li data-i18n="DDreort.tex4.profit">収量予測：1000～1200 kg/ha</li>
              <li data-i18n="DDreort.tex4.price">価格変動：過去3年の変動±5%</li>
            </ul>

            <h3 data-i18n="DDreort.tex5.comment">5. 分析コメント</h3>
            <p data-i18n="DDreort.tex5.text">全体としてリスクは低水準にあり、輪作最適化と生産管理の徹底により収益性の向上が期待されます。
               商品先物価格および干ばつリスクを考慮した定期モニタリングを推奨いたします。</p>
          </div>
          <div className="button-group mt-4">
            <button 
              className="btn btn-secondary" 
              onClick={() => setActiveSection('farmADetail')}
              data-i18n="back"
            >
              戻る
            </button>
          </div>
        </section>
         {/* 投資手続きセクション */}
         <section id="investFlow" className={activeSection === 'investFlow' ? 'active' : ''}>
          <h2 data-i18n="secction.invest">投資手続き</h2>
          <p data-i18n="secction.invest.text"> 以下のステップに従い、投資手続きを進めてください。</p>
          <div className="investment-flow-container">
            <ol className="investment-steps">
              <li className="mb-4">
                <h4 data-i18n="secction.invest.identifie">本人確認</h4>
                <p data-i18n="secction.invest.identifie.text">身分証明書のアップロードおよび本人確認書類の提出が必要です。</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => alert('本人確認書類アップロード画面へ')}
                  data-i18n="secction.invest.upload"
                >
                  アップロード
                </button>
              </li>
              <li className="mb-4">
                <h4 data-i18n="secction.invest.contract">契約書類の確認</h4>
                <p data-i18n="secction.invest.contract.text">電子契約書の内容をご確認の上、電子署名を実行してください。</p>
                <button 
                  className="btn btn-secondary"
                  onClick={() => alert('電子署名画面へ')}
                  data-i18n="secction.invest.sign"
                >
                  電子署名
                </button>
              </li>
              <li className="mb-4">
                <h4 data-i18n="secction.invest.amount.setting">投資額設定</h4>
                <p data-i18n="secction.invest.criterion">適正投資額の目安：<strong data-i18n="secction.invest.criterion.amount">1,000,000円</strong></p>
                <div className="input-group">
                  <label htmlFor="investAmount" data-i18n="secction.invest.amount">投資額 (円):</label>
                  <input 
                    type="number" 
                    id="investAmount" 
                    defaultValue={1000000}
                    min={100000}
                    step={10000}
                    className="form-control"
                  />
                </div>
                <button 
                  className="btn btn-secondary mt-2"
                  onClick={() => alert('投資額を確定しました')}
                  data-i18n="secction.invest.confirm"
                >
                  確定
                </button>
              </li>
              <li className="mb-4">
                <h4 data-i18n="secction.invest.pay">お支払い</h4>
                <p data-i18n="secction.invest.pay.text">銀行振込、オンライン決済、クレジットカードなど各種決済に対応しております。</p>
                <button 
                  className="btn"
                  onClick={() => alert('決済画面へ')}
                  data-i18n="secction.invest.proceed"
                >
                  決済へ進む
                </button>
              </li>
            </ol>
          </div>
          <div className="button-group mt-4">
            <button 
              className="btn btn-secondary"
              onClick={() => setActiveSection('farmADetail')}
              data-i18n="secction.invest.cancel"
            >
              キャンセル
            </button>
            </div>
          </section>
      </main>
    </div>
  );
};

export default Home;