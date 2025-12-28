const LEVELS = [
    {
      id: 1,
      name: "1桁",
      desc: "まずは英語読み上げ算を学んでみましょう。",
      href: "../levels/1digit/1digit.html"
    },
    {
      id: 2,
      name: "2桁",
      desc: "1桁が簡単すぎるように感じたらここに進みましょう。",
      href: "../levels/2digit/2digit.html"
    },
    {
      id: 3,
      name: "3桁",
      desc: "初級の問題の中でも難しめの問題を用意しました。",
      href: "../levels/3digit/3digit.html"
    },
    {
      id: 713,
      name: "7-13桁",
      desc: "全国大会上位レベルの読み上げ算。",
      href: "../levels/7to13digit/7to13digit.html"
    },
  ];
  
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }
  
  const root = document.getElementById("cards");
  
  const groups = chunkArray(LEVELS, 3);
  
  root.innerHTML = groups.map(group => `
    <div class="cards dashboard-row">
      ${group.map(level => `
        <div class="card"
             style="height:auto; padding:20px; cursor:pointer;"
             onclick="location.href='${level.href}'">
          <h3 style="padding-top:10px;">${level.name}</h3>
          <p style="padding-top:10px; padding-bottom:0;">
            ${level.desc}
          </p>
          <p style="padding-top:18px; padding-bottom:10px; font-weight:bold;">
            ▶ 開く
          </p>
        </div>
      `).join("")}
    </div>
  `).join("");
  