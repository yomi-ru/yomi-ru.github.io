const LEVELS = [
    {
      id: 1,
      name: "1桁",
      href: "../levels/1digit/1digit.html"
    },
    {
      id: 2,
      name: "2桁",
      href: "../levels/2digit/2digit.html"
    },
    {
      id: 3,
      name: "3桁",
      href: "../levels/3digit/3digit.html"
    },
    {
      id: 36,
      name: "3-6桁",
      href: "../levels/3to6digit/3to6digit.html"
    },
    {
      id: 47,
      name: "4-7桁",
      href: "../levels/4to7digit/4to7digit.html"
    },
    {
      id: 58,
      name: "5-8桁",
      href: "../levels/5to8digit/5to8digit.html"
    },
    {
      id: 711,
      name: "7-11桁",
      href: "../levels/7to11digit/7to11digit.html"
    },
    {
      id: 713,
      name: "7-13桁",
      href: "../levels/7to13digit/7to13digit.html"
    },
    {
      id: 913,
      name: "9-13桁",
      href: "../levels/9to13digit/9to13digit.html"
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
          <p style="padding-top:18px; padding-bottom:10px; font-weight:bold;">
            ▶ 開く
          </p>
        </div>
      `).join("")}
    </div>
  `).join("");
  