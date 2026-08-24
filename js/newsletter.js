/* Newsletter sign-up.
   This used to post straight to Mailchimp's public subscribe URL. That URL works from anything
   that can make a web request, browser or not, so scripts were adding junk contacts to the list
   all day. It now posts to our own server, which holds the Mailchimp key, checks the sign-up,
   and adds the person from its side. Nothing here reveals a Mailchimp address any more.

   Three quiet checks travel with every sign-up: a signed token the server issues when the page
   loads (so a script cannot post without asking first, and cannot reuse one), the time between
   the page loading and the form being sent (a person takes seconds, a script takes none), and
   two hidden fields that only an automated filler will touch. */
(function () {
  var API = APP_BASE; // shared constant from app.js, which loads first on every page
  var TOKEN = null;

  // Hold the submit buttons for the first 2 seconds after load. The server refuses
  // instant submissions as bot traffic; this makes that floor unbeatable by an honest
  // visitor using autofill, who would otherwise see a success that never happened.
  var READY_AT = Date.now() + 2000;
  document.querySelectorAll("form.news-form button[type=submit], form.news-form input[type=submit]").forEach(function (b) {
    b.disabled = true;
    setTimeout(function () { b.disabled = false; }, 2000);
  });

  fetch(API + "/api/public/form-token")
    .then(function (r) { return r.json(); })
    .then(function (d) { TOKEN = d.token; })
    .catch(function () { /* the server decides what to do with a missing token */ });

  document.querySelectorAll("form.news-form").forEach(function (form) {
    // A second honeypot, added here so the markup on every page stays as it is.
    var hp2 = document.createElement("div");
    hp2.setAttribute("aria-hidden", "true");
    hp2.style.cssText = "position:absolute;left:-5000px";
    hp2.innerHTML = '<label>Company<input type="text" name="company" tabindex="-1" autocomplete="off" value=""></label>';
    form.appendChild(hp2);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.querySelector('input[name="EMAIL"]').value.trim();
      var fname = (form.querySelector('input[name="FNAME"]') || { value: "" }).value.trim();
      var lname = (form.querySelector('input[name="LNAME"]') || { value: "" }).value.trim();
      var hp = (form.querySelector('input[name^="b_"]') || { value: "" }).value;
      var msg = form.querySelector(".news-msg");
      var btn = form.querySelector("button, input[type=submit]");
      // A real name is asked for now. Scripts fill one box and move on, and a list of people
      // with names is worth far more to us than a list of addresses.
      if (!fname || !lname) {
        msg.textContent = "Please enter your first and last name.";
        msg.className = "news-msg err";
        (fname ? form.querySelector('input[name="LNAME"]') : form.querySelector('input[name="FNAME"]')).focus();
        return;
      }
      if (!email) return;
      btn.disabled = true;
      msg.textContent = "One moment...";
      msg.className = "news-msg";

      // Where this visit came from, so a sign-up can be attributed to the thing that produced it.
      var q = new URLSearchParams(window.location.search);
      fetch(API + "/api/public/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          firstName: fname,
          lastName: lname,
          website: hp,
          company: hp2.querySelector("input").value,
          utm_source: q.get("utm_source") || "",
          utm_medium: q.get("utm_medium") || "",
          utm_campaign: q.get("utm_campaign") || "",
          formToken: TOKEN
        })
      })
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          btn.disabled = false;
          if (res.ok && res.d && res.d.ok) {
            msg.textContent = res.d.duplicate ? "You are already on the list. Thank you." : "You're in. Welcome to the mission.";
            msg.className = "news-msg ok";
            form.reset();
            if (window.gtag) gtag("event", "newsletter_signup");
          } else {
            msg.textContent = (res.d && res.d.error) || "Something went wrong. Please try again.";
            msg.className = "news-msg err";
          }
        })
        .catch(function () {
          btn.disabled = false;
          msg.textContent = "Connection issue. Please try again.";
          msg.className = "news-msg err";
        });
    });
  });
})();
