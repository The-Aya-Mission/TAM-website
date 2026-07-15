/* The Aya Mission — operations app integration.
   The app is a separate service; this file only links to it and reads its public API.
   Swap APP_BASE to https://apply.theayamission.org once the subdomain is set up. */
const APP_BASE = "https://apply.theayamission.org";

/* Point every <a data-app-href="/path"> at the app */
document.querySelectorAll("[data-app-href]").forEach(a => {
  a.href = APP_BASE + a.getAttribute("data-app-href");
});

function esc(s){ const d=document.createElement("div"); d.textContent=s==null?"":String(s); return d.innerHTML; }
function fmtDate(iso){
  if(!iso) return "";
  const d = new Date(iso + "T12:00:00");
  return isNaN(d) ? esc(iso) : d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"});
}
function fmtRange(a,b){
  if(!a) return "";
  if(!b || b===a) return fmtDate(a);
  const da=new Date(a+"T12:00:00"), db=new Date(b+"T12:00:00");
  if(!isNaN(da)&&!isNaN(db)&&da.getMonth()===db.getMonth()&&da.getFullYear()===db.getFullYear())
    return da.toLocaleDateString("en-US",{month:"long",day:"numeric"})+"–"+db.getDate()+", "+db.getFullYear();
  return fmtDate(a)+" – "+fmtDate(b);
}
function spots(n){
  if(n==null) return "";
  if(n<=0) return '<span class="app-spots full">Currently filled — more spots may open</span>';
  return '<span class="app-spots">'+n+(n===1?" spot":" spots")+" left</span>";
}

/* Upcoming ceremonies — target: <div class="grid cols-3" id="app-events"></div> */
const evEl = document.getElementById("app-events");
if (evEl) {
  fetch(APP_BASE + "/api/public/events")
    .then(r => { if(!r.ok) throw 0; return r.json(); })
    .then(events => {
      const list = (Array.isArray(events)?events:[]).filter(e => !e.private);
      evEl.innerHTML = list.length ? list.map(e => `
        <div class="card">
          <h3>${esc(e.name)}</h3>
          <p>${[e.site, e.location].filter(Boolean).map(esc).join(" · ")}</p>
          <p>${fmtRange(e.startDate, e.endDate)}${(e.applicationsOpen||e.opensAt||e.applyOpens) ? "<br>Applications open "+fmtDate(e.applicationsOpen||e.opensAt||e.applyOpens) : ""}${e.spotsLeft!=null ? "<br>"+spots(e.spotsLeft) : ""}</p>
          <a class="btn dark" href="${APP_BASE}/apply.html?event=${encodeURIComponent(e.id)}">Apply for This Ceremony</a>
        </div>`).join("")
      : `<div class="card" style="grid-column:1/-1"><h3>New Dates Coming Soon</h3>
           <p>Upcoming events are posted here as they're scheduled, along with the date applications open. Check back soon.</p></div>`;
    })
    .catch(() => {
      evEl.innerHTML = `<div class="card" style="grid-column:1/-1"><h3>Apply for a Ceremony</h3>
        <p>See upcoming ceremony weekends and begin your application on our secure intake portal.</p>
        <a class="btn dark" href="${APP_BASE}/apply.html">Open the Application Portal</a></div>`;
    });
}

/* Volunteer opportunities — target: <div class="grid cols-3" id="app-opportunities"></div> */
const opEl = document.getElementById("app-opportunities");
if (opEl) {
  fetch(APP_BASE + "/api/public/opportunities")
    .then(r => { if(!r.ok) throw 0; return r.json(); })
    .then(ops => {
      const list = Array.isArray(ops) ? ops : (ops && Array.isArray(ops.opportunities) ? ops.opportunities : []);
      opEl.innerHTML = list.length ? list.map(o => `
        <div class="card">
          <h3>${esc(o.title)}</h3>
          <p>${esc(o.description)}</p>
          <p>${[o.location,o.when].filter(Boolean).map(esc).join(" · ")}${o.spotsLeft!=null ? "<br>"+spots(o.spotsLeft) : ""}</p>
          <a class="btn dark" href="${APP_BASE}/volunteer.html">Volunteer for This</a>
        </div>`).join("")
      : `<div class="card" style="grid-column:1/-1"><h3>Join the Volunteer Roster</h3>
           <p>No open roles this second — but retreats staff up fast. Register once and we'll reach out when the next cohort needs you.</p>
           <a class="btn dark" href="${APP_BASE}/volunteer.html">Register to Volunteer</a></div>`;
    })
    .catch(() => {
      opEl.innerHTML = `<div class="card" style="grid-column:1/-1"><h3>Volunteer With Us</h3>
        <p>Register on our volunteer portal and we'll match you to upcoming retreat weekends.</p>
        <a class="btn dark" href="${APP_BASE}/volunteer.html">Register to Volunteer</a></div>`;
    });
}
