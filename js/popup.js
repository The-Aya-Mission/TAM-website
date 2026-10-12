/* Stay-in-touch dialog. Shows once after a delay, remembers "no" for 30 days,
   never returns once somebody subscribes. Injected at load (hidden) so
   newsletter.js, which runs after this file, binds the form like any other. */
(function () {
  if (location.pathname.indexOf("contact") > -1) return;          // already reaching out
  try {
    if (localStorage.getItem("tam_subscribed")) return;
    var d = +localStorage.getItem("tam_popup_dismissed_at") || 0;
    if (Date.now() - d < 30 * 24 * 3600 * 1000) return;
  } catch (e) { return; }                                         // storage blocked: never nag

  var DELAY = window.TAM_POPUP_DELAY || 15000;

  var wrap = document.createElement("div");
  wrap.id = "tam-popup";
  wrap.setAttribute("hidden", "");
  wrap.innerHTML =
    '<div class="popup-overlay" data-close></div>' +
    '<div class="popup-note" role="dialog" aria-modal="true" aria-labelledby="popup-title">' +
      '<button class="popup-x" type="button" aria-label="Close" data-close>&times;</button>' +
      '<h2 id="popup-title">Stay close</h2>' +
      '<p>One email a month. Ceremony dates, veteran stories, and ways to help. Unsubscribe anytime.</p>' +
      '<form class="news-form" novalidate>' +
        '<input type="text" name="FNAME" autocomplete="given-name" placeholder="First name" aria-label="First name" required>' +
        '<input type="text" name="LNAME" autocomplete="family-name" placeholder="Last name" aria-label="Last name" required>' +
        '<input type="email" name="EMAIL" autocomplete="email" placeholder="Your email address" aria-label="Email address" required>' +
        '<div aria-hidden="true" style="position:absolute; left:-5000px"><input type="text" name="b_309b4cf0ce01b37b69f2729e6_7d96311c9c" tabindex="-1" value=""></div>' +
        '<button type="submit" class="btn gold">Get the Monthly Update</button>' +
        '<p class="news-msg" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<p class="popup-alt">Have a question instead? <a href="' + APP_BASE + '/contact.html">Send us a message</a></p>' +
    '</div>';
  document.body.appendChild(wrap);

  var prevFocus = null;
  function close(markDismissed) {
    wrap.setAttribute("hidden", "");
    if (markDismissed) { try { localStorage.setItem("tam_popup_dismissed_at", String(Date.now())); } catch (e) {} }
    if (prevFocus && prevFocus.focus) prevFocus.focus();
  }
  wrap.querySelectorAll("[data-close]").forEach(function (el) {
    el.addEventListener("click", function () { close(true); });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !wrap.hasAttribute("hidden")) close(true);
  });
  // once subscribed, remember forever and close gently
  wrap.querySelector("form").addEventListener("submit", function () {
    var watch = setInterval(function () {
      var m = wrap.querySelector(".news-msg");
      if (m && m.classList.contains("ok")) {
        clearInterval(watch);
        try { localStorage.setItem("tam_subscribed", "1"); } catch (e) {}
        setTimeout(function () { close(false); }, 2200);
      }
    }, 300);
    setTimeout(function () { clearInterval(watch); }, 20000);
  });

  setTimeout(function () {
    wrap.removeAttribute("hidden");
    prevFocus = document.activeElement;
    var first = wrap.querySelector("input[name=FNAME]");
    if (first) first.focus();
    if (window.gtag) gtag("event", "popup_shown");
  }, DELAY);
})();
