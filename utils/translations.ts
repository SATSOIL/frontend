export const translations = {
    ja: {
      "logo": "SATSOIL",
      "nav.home": "ダッシュボード",
      "nav.search": "農地検索",
      "nav.mypage": "投資ポートフォリオ",
      "section.home.title": "ダッシュボード",
      "section.home.recommended": "注目の農地",
      "section.home.alerts": "最新市場レポート",
      "section.search.title": "農地検索",
      "section.search.regionGroup": "地域グループ:",
      "section.search.regionDetail": "地域詳細:",
      "section.search.evalRange": "評価スコア範囲:",
      "section.search.soil": "土壌pH:",
      "section.search.floodRisk": "洪水リスク:",
      "section.search.crop": "作物:",
      "section.search.irrigation": "灌漑設備充実度:",
      "section.search.accessibility": "交通アクセス利便性:",
      "section.search.cropVariety": "作付け多様性:",
      "section.search.search": "検索",
      "section.detail.simulation": "投資シミュレーション",
      "section.detail.ddReport": "DDレポート生成",
      "section.detail.investFlow": "投資手続きへ",
      "section.ddReport.title": "DDレポート",
      "section.ddReport.back": "戻る",
      "section.investFlow.title": "投資手続き",
      "section.mypage.title": "投資ポートフォリオ"
    },
    en: {
      "logo": "SATSOIL",
      "nav.home": "Dashboard",
      "nav.search": "Farm Search",
      "nav.mypage": "Investment Portfolio",
      "section.home.title": "Dashboard",
      "section.home.recommended": "Featured Farms",
      "section.home.alerts": "Latest Market Reports",
      "section.search.title": "Farm Search",
      "section.search.regionGroup": "Region Group:",
      "section.search.regionDetail": "Region Detail:",
      "section.search.evalRange": "Evaluation Score Range:",
      "section.search.soil": "Soil pH:",
      "section.search.floodRisk": "Flood Risk:",
      "section.search.crop": "Crop:",
      "section.search.irrigation": "Irrigation Infrastructure:",
      "section.search.accessibility": "Transport Accessibility:",
      "section.search.cropVariety": "Crop Variety Potential:",
      "section.search.search": "Search",
      "section.detail.simulation": "Investment Simulation",
      "section.detail.ddReport": "Generate DD Report",
      "section.detail.investFlow": "Proceed to Investment",
      "section.ddReport.title": "DD Report",
      "section.ddReport.back": "Back",
      "section.investFlow.title": "Investment Process",
      "section.mypage.title": "Investment Portfolio"
    }
  };
  
export const updateLanguage = (lang: keyof typeof translations) => {
    const elems = document.querySelectorAll("[data-i18n]");
    elems.forEach(elem => {
        const key = elem.getAttribute("data-i18n");
        if (key && key in translations[lang]) {
        elem.textContent = translations[lang][key as keyof typeof translations["ja"]];
        }
    });
};