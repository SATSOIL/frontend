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

const INVESTED_FARMS = [
  { id: 1, name: '農地A', amount: 1500000, currentValue: 1620000, roi: '+8%' },
  { id: 2, name: '農地B', amount: 2000000, currentValue: 2160000, roi: '+8%' },
  { id: 3, name: '農地C', amount: 1200000, currentValue: 1296000, roi: '+8%' },
];

interface SearchResult {
  name: string;
  region: string;
  soilPH: number;
  soilScore: number;
  rotationScore: number;
  potential: number;
  risk: string;
  crop: string;
  roi: string;
  waterSupply: number;
  accessibility: number;
  cropDiversity: number;
  img: string;
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

  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  type CountryName = 'America' | 'Japan' | 'China' | 'Russia';
  type RegionsType = {
    [K in CountryName]: string[];
  };
  
  const handleSearch = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const crops = ["Rice", "Wheat", "Soybean", "Tomato", "Lettuce", "Cucumber", "Pepper", "Cotton"];
    const risks = ["Low", "Medium", "High"];
    const countries: CountryName[] = ["America", "Japan", "China", "Russia"];
    const regions: RegionsType = {
      America: ["California", "Texas", "New York"],
      Japan: ["Hokkaido", "Ibaraki", "Kumamoto"],
      China: ["Beijing", "Shanghai", "Guangdong"],
      Russia: ["Moscow", "Saint Petersburg", "Siberia"]
    };
  
    const dummyData: SearchResult[] = letters.map((letter, i) => {
      const soilPH = Number((Math.random() * 3 + 5).toFixed(1));
      const soilScore = Math.max(0, 100 - Math.abs(6.5 - soilPH) * 20);
      const rotationScore = Math.floor(Math.random() * 51) + 50;
      const potentialScore = Math.floor((soilScore + rotationScore) / 2);
      const crop = crops[i % crops.length];
      const country = countries[Math.floor(Math.random() * countries.length)];
      const region = regions[country][Math.floor(Math.random() * regions[country].length)];
      
      let roi;
      switch(crop) {
        case "Rice": roi = "8%"; break;
        case "Wheat": roi = "10%"; break;
        case "Soybean": roi = "12%"; break;
        case "Tomato": roi = "9%"; break;
        case "Lettuce": roi = "8%"; break;
        case "Cucumber": roi = "9%"; break;
        case "Pepper": roi = "10%"; break;
        case "Cotton": roi = "11%"; break;
        default: roi = "8%";
      }
  
      return {
        name: `Farm ${letter}`,
        region: `${country} - ${region}`,
        soilPH,
        soilScore,
        rotationScore,
        potential: potentialScore,
        risk: risks[i % risks.length],
        crop,
        roi,
        waterSupply: Math.floor(Math.random() * 51) + 50,
        accessibility: Math.floor(Math.random() * 51) + 50,
        cropDiversity: Math.floor(Math.random() * 51) + 50,
        img: `https://placehold.jp/800x400?text=Farm+${letter}`
      };
    });
  
    setSearchResults(dummyData);
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

  const [watchlist, setWatchlist] = useState<string[]>([]);

  // ウォッチリストに追加する関数
  const addToWatchlist = (farmName: string) => {
    if (!watchlist.includes(farmName)) {
      setWatchlist([...watchlist, farmName]);
      alert(`${farmName}をウォッチリストに追加しました`);
    } else {
      alert('この農地は既にウォッチリストに追加されています');
    }
  };

  // ウォッチリストから削除する関数
  const removeFromWatchlist = (farmName: string) => {
    setWatchlist(watchlist.filter(name => name !== farmName));
    alert(`${farmName}をウォッチリストから削除しました`);
  };

 
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

        <section id="search" className={activeSection === 'search' ? 'active' : ''}>
          <h2 data-i18n="section.search.title">農地検索</h2>
          <TabContainer />
          
          {/* Updated simple search UI */}
          <div id="simpleSearch" className="card p-4 mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label htmlFor="regionGroup" data-i18n="section.search.regionGroup">地域グループ:</label>
                <select id="regionGroup" className="form-select">
                  <option value="" data-i18n="section.search.region.none">指定なし</option>
                  <option value="Asia">Asia</option>
                  <option value="Africa">Africa</option>
                  <option value="Europe">Europe</option>
                  <option value="NorthAmerica">North America</option>
                  <option value="SouthAmerica">South America</option>
                  <option value="Oceania">Oceania</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="country" data-i18n="simplesearch_country">Country:</label>
                <select id="country" className="form-select">
                  <option value="" data-i18n="simplesearch_country_nonassign">指定なし</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="prefecture" data-i18n="simplesearch_state">Prefecture/State:</label>
                <select id="prefecture" className="form-select">
                  <option value="" data-i18n="simplesearch_state_nonassign">指定なし</option>
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="regionDetail" data-i18n="section.search.regionDetail">地域詳細:</label>
                <input type="text" id="regionDetail" placeholder="例 : Tokyo, Kenya" className="form-control"/>
              </div>
              <div className="col-md-3">
                <label htmlFor="minScore" data-i18n="section.search.evalRange">評価スコア範囲:</label>
                <input type="number" id="minScore" className="form-control" min="0" max="100" defaultValue="1"/>
              </div>
            </div>
          </div>
        
          {/* Updated detailed search UI */}
          <div id="detailedSearch" className="card p-4 mb-4" style={{ display: 'none' }}>
            <div className="row g-3">
              <div className="col-md-2">
                <label htmlFor="soil" data-i18n="section.search.soil">土壌pH:</label>
                <select id="soil" className="form-select">
                  <option value=""  data-i18n="section.soil.ph">指定なし</option>
                  <option value="low"> ~ 5.5 </option>
                  <option value="medium">5.5 ~ 6.5 </option>
                  <option value="high">6.5 ~ </option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="floodRisk" data-i18n="section.search.floodRisk">洪水リスク:</label>
                <select id="floodRisk" className="form-select">
                  <option value="" data-i18n="section.flood.lisk">指定なし</option>
                  <option value="low" data-i18n="section.flood_low">低</option>
                  <option value="medium" data-i18n="section.flood_middle">中</option>
                  <option value="high" data-i18n="section.flood_high">高</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="cropType" data-i18n="section.search.crop">作物:</label>
                <select id="cropType" className="form-select">
                  <option value="" data-i18n="section.search.crop_none">指定なし</option>
                  <option value="rice" data-i18n="section.search.crop_rice">米</option>
                  <option value="wheat" data-i18n="section.search.crop_flowr">小麦</option>
                  <option value="soy" data-i18n="section.search.crop_soy">大豆</option>
                  <option value="tomato" data-i18n="section.search.crop_tomato">トマト</option>
                  <option value="lettuce" data-i18n="section.search.crop_lettuce">レタス</option>
                  <option value="cotton" data-i18n="section.search.crop_cotton">綿</option>
                </select>
              </div>
              <div className="col-md-2">
                <label htmlFor="waterSupply" data-i18n="section.search.irrigation">灌漑設備充実度:</label>
                <input type="number" id="waterSupply" placeholder="0 ~ 100" min="0" max="100" className="form-control"/>
              </div>
              <div className="col-md-2">
                <label htmlFor="accessibility" data-i18n="section.search.accessibility">交通アクセス利便性:</label>
                <input type="number" id="accessibility" placeholder="0 ~ 100" min="0" max="100" className="form-control"/>
              </div>
              <div className="col-md-2">
                <label htmlFor="cropDiversity" data-i18n="section.search.cropVariety">作付け多様性:</label>
                <input type="number" id="cropDiversity" placeholder="0 ~ 100" min="0" max="100" className="form-control"/>
              </div>
            </div>
          </div>
        
          {/* Updated simple search UI filter-submit */}
          <div className="filter-submit mb-4 text-center">
            <button 
              className="btn btn-primary btn-lg rounded-pill"
              onClick={handleSearch}  // ここにハンドラーを追加
            >
              Search
            </button>
          </div>
        
          <div id="map" ref={mapRef}></div>
          <h3 data-i18n="section.search.result">検索結果</h3>
          <div className="search-results">
            {searchResults.length === 0 ? (
              <p>No farms found matching your criteria.</p>
            ) : (
              <div className="card-grid">
                {searchResults.map((farm, index) => (
                  <div 
                    key={index} 
                    className="card" 
                    onClick={() => handleCardClick(farm.name)}
                  >
                    <img src={farm.img} alt={farm.name} />
                    <div className="title">{farm.name}</div>
                    <div className="subtitle">
                      Region: {farm.region}<br />
                      Expected ROI: {farm.roi} / Risk Level: {farm.risk}<br />
                      Soil pH: {farm.soilPH} (Score: {farm.soilScore})<br />
                      Main Crop: {farm.crop}<br />
                      Potential Score: {farm.potential}<br />
                      Irrigation: {farm.waterSupply} / Access: {farm.accessibility} / 
                      Crop Diversity: {farm.cropDiversity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 投資ポートフォリオセクション */}
        <section id="mypage" className={activeSection === 'mypage' ? 'active' : ''}>
          <h2>投資ポートフォリオ</h2>
          <div className="portfolio-container">
            <h3>投資中の農地</h3>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>農地名</th>
                    <th>投資額</th>
                    <th>現在価値</th>
                    <th>予測ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {INVESTED_FARMS.map(farm => (
                    <tr key={farm.id}>
                      <td>{farm.name}</td>
                      <td>{farm.amount.toLocaleString()}円</td>
                      <td>{farm.currentValue.toLocaleString()}円</td>
                      <td>{farm.roi}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <br />
          <h3 data-i18n="section.mypage.watchlist">ウォッチリスト</h3>
            <ul className="watchlist">
              {watchlist.map((farmName, index) => (
                <li key={index} className="watchlist-item">
                  <span>{farmName}</span>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeFromWatchlist(farmName)}
                  >
                    削除
                  </button>
                </li>
              ))}
              {watchlist.length === 0 && (
                <li className="watchlist-empty">ウォッチリストは空です</li>
              )}
            </ul>          
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
            </div>
          </div>
          <div style={{marginTop: '10px'}}>
          <button 
            className="btn" 
            onClick={() => addToWatchlist('農地A')} 
            data-i18n="addWatchList"
            disabled={watchlist.includes('農地A')}
          >
            {watchlist.includes('農地A') ? 'ウォッチリスト追加済み' : 'ウォッチリストに追加'}
          </button>
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