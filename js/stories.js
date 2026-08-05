/* Live story bank from the operations app. Falls back to hardcoded quotes if unreachable. */
(function(){
  function esc2(s){ var d=document.createElement("div"); d.textContent=s==null?"":String(s); return d.innerHTML; }
  function att(st){
    if (st.byline) return esc2(st.byline);
    var who = st.anonymous ? "" : (st.name || "");
    var mil = [st.rank, st.service].filter(Boolean).join(", ");
    var parts = [who, mil, st.state].filter(Boolean);
    return esc2(parts.join(" · ")) || "A veteran in our community";
  }
  function card(st, i){
    var full = String(st.story || "");
    var long = full.length > 240;
    var shown = long ? full.slice(0, 220).replace(/\s+\S*$/, "") + "..." : full;
    var p0 = st.photos && st.photos[0];
    var purl = p0 ? (typeof p0 === "string" ? p0 : p0.url) : "";
    if (purl && purl.charAt(0) === "/") purl = APP_BASE + purl;
    var photo = purl ? '<div class="photo-taped" style="max-width:200px; margin:16px auto 0"><img src="' + esc2(purl) + '" alt="Photo shared with this story" loading="lazy"></div>' : "";
    return '<div class="card story-card">'
      + '<p class="quote" data-full="' + esc2(full) + '">"' + esc2(shown) + '"</p>'
      + (long ? '<button class="read-more" type="button">Read more</button>' : "")
      + '<p class="quote-by">' + att(st) + '</p>'
      + photo + '</div>';
  }
  function wire(el){
    el.querySelectorAll(".read-more").forEach(function(btn){
      btn.addEventListener("click", function(){
        var q = btn.parentElement.querySelector(".quote");
        q.innerHTML = '"' + q.getAttribute("data-full").replace(/&/g,"&amp;").replace(/</g,"&lt;") + '"';
        btn.remove();
      });
    });
  }
  var FALLBACK = [
    {byline:"SGT Michael Telles", story:"The Aya Mission opened doors for me so that I could unpack all the trauma from combat."},
    {byline:"SSG Ulises Lopez, Co-Founder & Executive Director, on his own first ceremony", story:"I felt the weight of the world leaving my shoulders. Although the pain still lingers, I am hopeful for the future."},
    {byline:"SGT Andrew \"Doc\" Lunsford", story:"I feel that I can love my family more deeply. I feel like a new man."}
  ];
  var PAGE = 6;
  function shuffle(a){
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function showWall(list){
    var wall = document.getElementById("story-wall");
    if (!wall) return;
    var pool = shuffle(list.slice());
    var shown = 0;
    function renderMore(){
      var batch = pool.slice(shown, shown + PAGE);
      shown += batch.length;
      wall.insertAdjacentHTML("beforeend", batch.map(card).join(""));
      wire(wall);
      var btn = document.getElementById("more-stories");
      if (btn) btn.style.display = (shown < pool.length) ? "" : "none";
    }
    wall.innerHTML = "";
    renderMore();
    wall.classList.add("stories-in");
    var btn = document.getElementById("more-stories");
    if (btn) btn.addEventListener("click", renderMore);
  }
  fetch(APP_BASE + "/api/public/stories")
    .then(function(r){ if(!r.ok) throw 0; return r.json(); })
    .then(function(data){
      var list = (data && Array.isArray(data.stories)) ? data.stories.slice() : [];
      if (!list.length) { showWall(FALLBACK); return; }
      list.sort(function(a,b){ return String(b.at||"").localeCompare(String(a.at||"")); });

      showWall(list);

      var words = document.getElementById("live-words");
      if (words) {
        var short3 = list.filter(function(s){ return String(s.story||"").length <= 260; }).slice(0,3);
        if (short3.length === 3) { words.innerHTML = short3.map(card).join(""); wire(words); }
      }

      var imp = document.getElementById("live-words-impact");
      if (imp && list.length >= 3) {
        var pool = list.slice(); var pick = [];
        while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
        imp.innerHTML = pick.map(card).join(""); wire(imp);
      }
    })
    .catch(function(){ showWall(FALLBACK); });
})();
