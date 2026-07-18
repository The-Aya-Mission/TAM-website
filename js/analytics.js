/* Google Analytics 4: set GA_ID to the site's measurement ID (G-XXXXXXXXXX) to enable.
   Until then this file is a no-op. */
const GA_ID = "G-L116ZRRNTY";
if (GA_ID) {
  const s = document.createElement("script");
  s.async = true; s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ dataLayer.push(arguments); };
  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });
  document.addEventListener("click", function(e){
    const a = e.target.closest("a"); if (!a) return;
    const h = a.href || "";
    if (a.classList.contains("btn-donate") || h.indexOf("donate.html") > -1) gtag("event","donate_click",{link_url:h});
    else if (h.indexOf("apply.theayamission.org") > -1) gtag("event","app_outbound",{link_url:h,link_text:(a.textContent||"").trim().slice(0,60)});
    else if (h.indexOf("mailchi.mp") > -1) gtag("event","newsletter_click");
    else if (h.indexOf("brikl.store") > -1) gtag("event","merch_click");
  });
}
