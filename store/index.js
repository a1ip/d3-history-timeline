import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)

const store = () => new Vuex.Store({
  state: {
    timelineTitle: "",
    chartData: [],
    selectedPeoples: [],
    peoples: [],
    currentX: 0,
    currentY: 9,
    testAPIResult: [
      { title: "Bauhaus Weimarer", category: "organization", start: 1919, end: 1923, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/Van-de-Velde-Bau_in_Weimar_%28Draufsicht%29.jpg" },
      { title: "Bauhaus Dessau",   category: "organization", start: 1925, end: 1932, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Bauhaus.JPG" },
      { title: "Bauhaus Berlin",   category: "organization", start: 1932, end: 1933, events: [], imageUrl: "http://via.placeholder.com/90x100" },
      { title: "Nationalsozialistische Deutsche Arbeiterpartei",   category: "organization", start: 1920, end: 1945, events: [], imageUrl: "https://upload.wikimedia.org/wikipedia/commons/f/fc/NSDAP-Logo.svg"},
      { title: "Walter Adolph Georg Gropius", category: "people", start: 1883, end: 1969,
        events: [
          {start: 1919, content: "Become the first principal of Bauhaus"},
          {start: 1925, content: "『国際建築』"},
          {start: 1926, content: "Dessau's school building"},
          {start: 1928, content: "Leave the principal position of Bauhaus"},
          {start: 1911, content: "Married with Alma Maria Mahler-Werfel"}
        ], 
        birth: "1883.5.18",
        dead: "1969.7.5",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/6/61/1955_01-Oct_HansGConrad_Portrait-WalterGropius_HfGUlm-Opening.jpg" },
      { title: "Johannes Itten", category: "people", start: 1888, end: 1967, 
        events: [
          {start: 1919, content: "Become a Meister of Bauhaus"},
          {start: 1923, content: "Fired from Bauhaus"},
          {start: 1926, content: "'Itten Schule' established"}
        ],
        birth: "1888.11.11",
        dead: "1967.5.27",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/5/57/Itten001.jpg"},
      { title: "Moholy-Nagy László", category: "people", start: 1895, end: 1946,
        events: [
          {start: 1923, content: "Become professor of Bauhaus"},
          {start: 1925, content: "'Malerei, Fotografie, Film' released"},
          {start: 1937, content: "Exile to USA"}
        ],
        birth: "1895.7.20",
        dead: "1946.11.24",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/82/Laszlo_Moholy-Nagy_-_photography_from_NARA_-_281845.jpg" },
      { title: "Hannes Meyer", category: "people", start: 1889, end: 1954, 
        events: [],
        birth: "1889.11.18",
        dead: "1954.7.19",
        imageUrl: "http://via.placeholder.com/90x100"},
      {
        title: "Wassily Kandinsky", category: "people", start: 1866, end: 1944,
        events: [
          {start: 1911, content: "『青騎士』結成"},
          {start: 1922, content: "instructor at Bauhaus"},
        ],
        birth: "1866.12.4",
        dead: "1944.12.13",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/8/8a/Vassily-Kandinsky.jpeg"
      },
      {
        title: "Alma Maria Mahler-Werfel", category: "people", start: 1879, end: 1964,
        events: [
          {start: 1902, content: "Married with Gustav Mahler"},
          {start: 1911, content: "Married with Walter Adolph Georg Gropius"}
        ],
        birth: "1879.8.31",
        dead: "1964.12.11",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/96/Alma_Mahler_1899.jpg" 
      },
      {
        title: "Gustav Mahler", category: "people", start: 1860, end: 1911,
        events: [
          {start: 1902, content: "Married with Alma Maria Mahler-Werfel"}
        ],
        birth: "1860.7.7",
        dead: "1911.5.18",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Gustav_Mahler_1909.jpg/800px-Gustav_Mahler_1909.jpg"
      },
      {
        title: "Le Corbusier", category: "people", start: 1887, end: 1965, 
        events: [
          {start: 1931, content: "Villa Savoye"}
        ],
        birth: "1887.10.6",
        dead: "1965.8.27",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/2/23/Le_Corbusier_1933.JPG"
      },
      { title: "その他のアニメ作品", 
        category: "organization", start: 1920, end: 0, events: [
          {start: 1998, content: "カウボーイビバップ"},
          {start: 2001, content: "カウボーイビバップ 天国の扉"},
          {start: 2011, content: "魔法少女まどか☆マギカ"}
        ], imageUrl: "" },
      { title: "手塚治虫", category: "people", start: 1928, end: 1989, 
        events: [],
        birth: "1928.11.3",
        dead: "1989.2.9",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Osamu_Tezuka_1951_Scan10008-2.JPG/200px-Osamu_Tezuka_1951_Scan10008-2.JPG"},
      { title: "宮崎駿", category: "people", start: 1941, end: 0, 
        events: [
          {start: 1979, content: "ルパン三世 カリオストロの城"},
          {start: 1984, content: "風の谷のナウシカ"},
          {start: 1986, content: "天空の城ラピュタ"},
          {start: 1987, content: "となりのトトロ"},
          {start: 1989, content: "魔女の宅急便"},
          {start: 1992, content: "紅の豚"},
          {start: 1995, content: "On Your Mark〜ジブリ実験劇場"},
          {start: 1997, content: "もののけ姫"},
          {start: 2001, content: "千と千尋の神隠し"},
          {start: 2004, content: "ハウルの動く城"},
          {start: 2008, content: "崖の上のポニョ"},
          {start: 2013, content: "風立ちぬ"},
        ],
        birth: "1941.1.5",
        dead: "",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Hayao_Miyazaki.jpg"
      },
      { 
        title: "高畑勲", category: "people", start: 1935, end: 2018, 
        events: [
          {start: 1968, content: "太陽の王子 ホルスの大冒険"},
          {start: 1972, content: "パンダコパンダ"},
          {start: 1973, content: "パンダコパンダ 雨ふりサーカスの巻	"},
          {start: 1981, content: "じゃりン子チエ"},
          {start: 1982, content: "セロ弾きのゴーシュ"},
          {start: 1987, content: "柳川堀割物語"},
          {start: 1988, content: "火垂るの墓"},
          {start: 1991, content: "おもひでぽろぽろ"},
          {start: 1994, content: "平成狸合戦ぽんぽこ"},
          {start: 1999, content: "ホーホケキョ となりの山田くん"},
          {start: 2013, content: "かぐや姫の物語"},
        ],
        birth: "1935.10.29",
        dead: "2018.4.5",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b6/Isao_Takahata.jpg"
      },
      { 
        title: "押井守", category: "people", start: 1951, end: 0, 
        events: [
          {start: 1983, content: "うる星やつら オンリー・ユー"},
          {start: 1984, content: "うる星やつら2 ビューティフル・ドリーマー"},
          {start: 1984, content: "機動警察パトレイバー the Movie"},
          {start: 1990, content: "MAROKO 麿子"},
          {start: 1993, content: "機動警察パトレイバー 2 the Movie"},
          {start: 1995, content: "GHOST IN THE SHELL / 攻殻機動隊（"},
          {start: 1997, content: "GHOST IN THE SHELL / 攻殻機動隊 インターナショナル・ヴァージョン"},
          {start: 2004, content: "イノセンス"},
          {start: 2008, content: "GHOST IN THE SHELL / 攻殻機動隊2.0、スカイ・クロラ The Sky Crawlers"},
          {start: 2015, content: "劇場版 ニルスのふしぎな旅"},
          {start: 1987, content: "紅い眼鏡/The Red Spectacles"},
          {start: 1985, content: "天使のたまご"},
          {start: 1991, content: "ケルベロス-地獄の番犬"},
          {start: 1992, content: "トーキング・ヘッド"},
          {start: 2001, content: "アヴァロン"},
          {start: 2003, content: "KILLERS キラーズ"},
          {start: 2006, content: "立喰師列伝、女立喰師列伝 ケツネコロッケのお銀 -パレスチナ死闘編-"},
          {start: 2007, content: "真・女立喰師列伝"},
          {start: 2009, content: "ASSAULT GIRLS"},
          {start: 2010, content: "28 1/2 妄想の巨人（"},
          {start: 2014, content: "THE NEXT GENERATION -パトレイバー"},
          {start: 2015, content: "THE NEXT GENERATION -パトレイバー - 首都決戦、東京無国籍少女"},
          {start: 2016, content: "GARM WARS The Last Druid"},
        ],
        birth: "1951.8.8",
        dead: "",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bc/Mamoru_Oshii_-_Lucca_Comics_%26_Games_2015.JPG"
      },
      { 
        title: "富野由悠季", category: "people", start: 1941, end: 0, 
        events: [
          {start: 1972, content: "海のトリトン"},
          {start: 1975, content: "勇者ライディーン"},
          {start: 1975, content: "ラ・セーヌの星"},
          {start: 1977, content: "無敵超人ザンボット３"},
          {start: 1978, content: "無敵鋼人ダイターン３"},
          {start: 1979, content: "機動戦士ガンダム"},
          {start: 1980, content: "伝説巨神イデオン"},
          {start: 1981, content: "機動戦士ガンダム 劇場版、機動戦士ガンダムⅡ 哀・戦士編"},
          {start: 1982, content: "機動戦士ガンダムⅢ めぐりあい宇宙編、戦闘メカ ザブングル、The IDEON （伝説巨神イデオン）接触篇/発動篇（"},
          {start: 1983, content: "聖戦士ダンバイン、ザブングル グラフィティ"},
          {start: 1984, content: "重戦機エルガイム"},
          {start: 1985, content: "機動戦士Zガンダム"},
          {start: 1986, content: "機動戦士ZZガンダム"},
          {start: 1988, content: "機動戦士ガンダム 逆襲のシャア"},
          {start: 1991, content: "機動戦士ガンダムF91"},
          {start: 1993, content: "機動戦士Vガンダム"},
          {start: 1996, content: "バイストン・ウェル物語 ガーゼィの翼"},
          {start: 1998, content: "ブレンパワード"},
          {start: 1999, content: "∀ガンダム"},
          {start: 2002, content: "劇場版 ∀ガンダム I 地球光/II 月光蝶、OVERMANキングゲイナー"},
          {start: 2005, content: "リーンの翼、機動戦士Ζガンダム 星を継ぐ者、機動戦士ΖガンダムII 恋人たち、"},
          {start: 2006, content: "機動戦士ΖガンダムIII 星の鼓動は愛"},
          {start: 2009, content: "リング・オブ・ガンダム"},
          {start: 2014, content: "ガンダム Gのレコンギスタ"},
        ],
        birth: "1941.11.5",
        dead: "",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/95/Tomino_Yoshiyuki_%22The_World_of_Gundam%22_at_Opening_Ceremony_of_the_28th_Tokyo_International_Film_Festival_%2822417922672%29.jpg"
      },
      { 
        title: "庵野秀明", category: "people", start: 1960, end: 0, 
        events: [
          {start: 1990, content: "ふしぎの海のナディア"},
          {start: 1995, content: "新世紀エヴァンゲリオン"},
          {start: 1998, content: "彼氏彼女の事情"},
          {start: 1997, content: "新世紀エヴァンゲリオン劇場版 シト新生、新世紀エヴァンゲリオン劇場版 Air/まごころを、君に"},
          {start: 2007, content: "ヱヴァンゲリヲン新劇場版:序"},
          {start: 2009, content: "ヱヴァンゲリヲン新劇場版:破"},
          {start: 2012, content: "ヱヴァンゲリヲン新劇場版:Q"},
          {start: 1988, content: "トップをねらえ！"},
          {start: 2004, content: "Re:キューティーハニー"},
          {start: 1998, content: "ラブ＆ポップ"},
          {start: 2000, content: "式日"},
          {start: 2004, content: "キューティーハニー"},
          {start: 2016, content: "シン・ゴジラ"},
        ],
        birth: "1960.5.22",
        dead: "",
        imageUrl: "https://upload.wikimedia.org/wikipedia/commons/9/91/Godzilla_Resurgence_World_Premiere_Red_Carpet-_Anno_Hideaki_%2828526527191%29.jpg"
      },
      {
        title: "永野護", category: "people", start: 1960, end: 0,
        events: [
          {start: 1984, content: "『重戦機エルガイム』メカデザイン・キャラクターデザイン担当"},
          {start: 1986, content: "『ファイブスター物語』連載開始"}
        ],
        birth: "1960.1.21",
        dead: "",
        imageUrl: "https://pbs.twimg.com/profile_images/3525837671/005454891e0df68746085fbecc7f5ceb_400x400.jpeg"
      },
      { 
        title: "Yuto Ogi", category: "people", start: 1983, end: 0, 
        events: [], 
        birth: "1983.11.24",
        dead: "",
        imageUrl: ""
      },
    ],
    sampleData: [
      {title: "Bauhaus", peoples: ["Walter Adolph Georg Gropius", "Johannes Itten", "Moholy-Nagy László", "Hannes Meyer"]},
      {title: "Japanese Anime Director", peoples:[ "手塚治虫", "宮崎駿", "高畑勲", "押井守", "富野由悠季", "庵野秀明", "永野護"]}
    ]
  },
  getters: {
    timelineTitle: state => state.timelineTitle,
    chartData: state => state.chartData,
    sampleData: state => state.sampleData,
    // chartData: function(state){
    //   return state.chartData.concat(state.peoples)
    // },
    selectedPeoples: state => state.selectedPeoples,
    peopleNames: function(state){
      return state.testAPIResult
        .filter((row)=>{
          if (row.category === "people"){ return true; }
        })
        .map((row) => {
          return {name: row.title}
        })
    },
    eventData: function(state){
      var list = state.chartData.map(function(row, i){
        return row.events.map(function(event){
          return {
            title: row.title,
            content: event.content,
            top: row.top,
            start: event.start,
            baseIndex: i
          }
        });
      })
      // flatten Array
      return Array.prototype.concat.apply([], list);
    },
    birthData: function(state){
      return state.chartData.map(function(row){
        return {
          start: row.start,
          birth: row.birth
        };
      });
    },
    deatData: function(state){
      return state.chartData.map(function(row){
        return row.dead;
      });
    },
    areaStartYear: function(state){
      // 全データにおける歴史開始年の最小値を求める, -10ぶんをマージン
      return Math.min.apply(null, state.chartData.map(function(row){ return row.start })) - 10;
    },
    areaEndYear: function(state){
      // 全データにおける歴史終了年の最大値を求める. +10年ぶんをマージン
      return Math.max.apply(null, state.chartData.map(function(row){ return row.end })) + 10;;
    },
    areaPeriod: function(state, getters) {
      return getters.areaEndYear - getters.areaStartYear;
    }
  },
  mutations: {
    // addSelectedPeoples(state, people){
    //   state.selectedPeoples.push(people)
    // },
    getPeoples(state, peoples){
      state.peoples = peoples
      // state.chartData = state.chartData.concat(state.peoples)
      state.chartData = peoples
    }
  },
  actions: {
    // addSelectedPeoplesAsync({commit, state}, people){
    //   commit("addSelectedPeoples", people)
    //   this._actions.getPeoplesAsync({commit, state}, [people.name])
    // },
    getPeoplesAsync({commit, state}, peoples){
      var ret = peoples.map((peopleName) => {
        var index = state.testAPIResult.findIndex((row) => {
          if (row.title === peopleName){ return true }
        })
        return state.testAPIResult[index];
      })
      commit("getPeoples", ret)
    }
  }
})

export default store