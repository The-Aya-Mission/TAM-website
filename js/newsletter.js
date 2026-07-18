/* On-brand Mailchimp signup: posts via JSONP so visitors never leave the site. */
(function(){
  var URL = "https://theayamission.us12.list-manage.com/subscribe/post-json?u=309b4cf0ce01b37b69f2729e6&id=7d96311c9c&f_id=00246ae9f0";
  document.querySelectorAll("form.news-form").forEach(function(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var email = form.querySelector('input[name="EMAIL"]').value.trim();
      var fname = (form.querySelector('input[name="FNAME"]') || {value:""}).value.trim();
      var hp = form.querySelector('input[name^="b_"]').value; // honeypot
      var msg = form.querySelector(".news-msg");
      var btn = form.querySelector("button, input[type=submit]");
      if (!email) return;
      btn.disabled = true; msg.textContent = "One moment..."; msg.className = "news-msg";
      var cb = "mcCallback" + Date.now();
      window[cb] = function(data){
        btn.disabled = false;
        var clean = String(data.msg || "").replace(/<[^>]*>/g, "").replace(/^\d+\s*-\s*/, "");
        if (data.result === "success") {
          msg.textContent = "You're in. Welcome to the mission.";
          msg.className = "news-msg ok";
          form.reset();
          if (window.gtag) gtag("event", "newsletter_signup");
        } else {
          msg.textContent = clean || "Something went wrong. Please try again.";
          msg.className = "news-msg err";
        }
        delete window[cb]; s.remove();
      };
      var s = document.createElement("script");
      s.src = URL + "&EMAIL=" + encodeURIComponent(email)
                  + (fname ? "&FNAME=" + encodeURIComponent(fname) : "")
                  + "&b_309b4cf0ce01b37b69f2729e6_7d96311c9c=" + encodeURIComponent(hp)
                  + "&c=" + cb;
      s.onerror = function(){ btn.disabled = false; msg.textContent = "Connection issue. Please try again."; msg.className = "news-msg err"; delete window[cb]; s.remove(); };
      document.body.appendChild(s);
    });
  });
})();
