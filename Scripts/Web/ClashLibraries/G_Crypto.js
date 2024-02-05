
const supabase_key =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0YmRocXdhZnZtaGF1Y3ZrZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTc0NzQsImV4cCI6MjAxOTU3MzQ3NH0.fuLEZWkK5vj9AJaClHEF3V-9wiAN7WbIJsXugKDUc18";
const IMDB_key="2b593d40e6c26c525e32831dd6d4bee7";

const Version = "1.0";
const G_Crypto = (function (e) {
  const key = new TextEncoder().encode("abcdefghijklmnopqrstuvwxyz012345$GAURAVROHIT");
  return {
    encrypt: (input) => btoa(String.fromCharCode(...new Uint8Array([...new TextEncoder().encode(input)].map((byte, index) => (byte + key[index % key.length]) % 256)))),
    decrypt: (input) => new TextDecoder().decode(new Uint8Array([...Uint8Array.from(atob(input), (e) => e.charCodeAt(0))].map((byte, index) => (byte - key[index % key.length] + 256) % 256))),
    Version: Version,
  };
})(jQuery);

  
function getTimeDifference(e) {
  let n = new Date(e),
    r = new Date() - n;
  for (let o of [
    { name: "year", duration: 31536e6 },
    { name: "month", duration: 2592e6 },
    { name: "day", duration: 864e5 },
    { name: "hour", duration: 36e5 },
    { name: "minute", duration: 6e4 },
    { name: "second", duration: 1e3 },
  ]) {
    let t = Math.floor(r / o.duration);
    if (t > 0) {
      if ("day" === o.name && t < 2) return "1 day ago";
      return `${t} ${o.name}${t > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
}
const ajaxRequest = (url, method, data, successCallback, errorCallback, key) => {
  const headers = {
    "content-type": "application/json",
    apikey: key || supabase_key,
    Authorization: key ? `Bearer ${key}` : `Bearer ${supabase_key}`,
  };

  const settings = {
    url,
    method,
    data: JSON.stringify(data),
    headers,
  };

  $.ajax(settings).done(data => successCallback(data)).fail(error => errorCallback(error));
};
const supabase_url=()=>{
   return "https://ytbdhqwafvmhaucvkfwa.supabase.co/rest/v1/rpc";
}
const supabase_KEY=()=>{
  return supabase_key;
}
const showLoader=(timeout)=>{
  if(timeout){
    jQuery('#preloader').fadeOut(timeout);
  }else{
   jQuery('#preloader').show();
  }
}
const hideLoader=()=>{
    jQuery('#preloader').hide();
}
const imgBB_key=()=>{
  return IMDB_key;
}
const NType = {
  LIKE: 'like',
  COMMENT: 'comment',
  COMMUNITY: 'community',
  SUGGESTION: 'suggestion',
  POST: 'post'
};
const ajaxIMDBPost = (url, method, data,progressCallback) => {
	const settings = {
    url,
    method,
    processData: false,
    contentType: false,
    data: data,
    xhr: function () {
      var xhr = new window.XMLHttpRequest();
      xhr.upload.addEventListener(
        "progress",
        function (e) {
          if (e.lengthComputable) {
            var percent = (e.loaded / e.total) * 100;
            progressCallback(percent);
          }
        },
        false
      );
      return xhr;
    },
  };
	return $.ajax(settings);
};
const SESSION_KEYS = {
  USER_NAME: {
    key: "userName",
    defaultValue: "Guest",
  },
  USER_ID: {
    key: "userId",
    defaultValue: null,
  },
  IS_LOGGED_IN: {
    key: "isLoggedIn",
    defaultValue: false,
  },
  USER_EMAIL: {
    key: "userEmailAddress",
    defaultValue: "",
  },
  IS_ADMIN: {
    key: "isAdmin",
    defaultValue: false,
  },
  IS_GUEST: {
    key: "isGuest",
    defaultValue: true,
  },
  USER_FL_NAME:{
    key:"userFirstLastName",
    defaultValue:null
  }
};
const setSessionData = (key, value) => {
  const sessionKey = SESSION_KEYS[key];
  if (sessionKey) {
    localStorage.setItem(sessionKey.key, JSON.stringify(value));
  }
};
const getSessionData = (key) => {
  const sessionKey = SESSION_KEYS[key];
  if (sessionKey) {
    const storedValue = localStorage.getItem(sessionKey.key);
    return storedValue ? JSON.parse(storedValue) : sessionKey.defaultValue;
  }
  return null;
};
const clearSessionData = (key) => {
   const sessionKey = SESSION_KEYS[key];
    if (sessionKey) {
      localStorage.removeItem(sessionKey.key);
    }
};
const clearAllSessionData = () => {
  Object.keys(SESSION_KEYS).forEach((key) => {
      clearSessionData(key);
  });
  setDefaultValues();
};
if(getSessionData("USER_ID")==null){
  window.location.href="/Auth/welcome.html"
};
const setDefaultValues = () => {
  Object.keys(SESSION_KEYS).forEach((key) => {
      const sessionKey = SESSION_KEYS[key];
      setSessionData(key, sessionKey.defaultValue);
  });
};
const Aerror=()=>{
  $("#toastContent").html("Something went wrong..")
  toast.show();
  setTimeout(() => {
      toast.hide();
  }, 2000);
}
const formatNumber=(value)=> {
  if (value >= 1000 && value < 1000000) {
      return (value / 1000).toFixed(1) + 'k';
  } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
  } else {
      return value.toString();
  }
}

(function ($) {
  $.fn.viewTracker = function (options) {
    var settings = $.extend(
      {
        apiUrl: "",
        offsetPercentage: 50,
        debounceTime: 200, // Adjust the debounce time as needed
        viewElem: ""
      },
      options
    );
    return this.each(function () {
      var $post = $(this);
      var viewLogged = false;

      function isElementInCenter(el) {
        var rect = el.getBoundingClientRect();
        var centerY = window.innerHeight / 2;
        return rect.top <= centerY && rect.bottom >= centerY;
      }

      function logView() {
        if (!viewLogged && isElementInCenter($post[0])) {
          var numpartPost = $post.data("post-id").match(/-(\d+)$/);
          if (numpartPost) {
            var current_view_post_id = numpartPost[1];
            var current_view_post_indes=$post.data("post-index");
            var current_post_view_data={
              "p_user_id":parseInt($(settings.viewElem + current_view_post_indes).data("logged-user-id")),
              "p_post_id":parseInt(current_view_post_id),
              "p_ip_address":$(settings.viewElem + current_view_post_indes).data("p-ip-logged-user-address"),
              "p_device_type":$(settings.viewElem + current_view_post_indes).data("logged-user-device-type"),
              "p_browser_info":$(settings.viewElem + current_view_post_indes).data("logged-user-browser-information"),
              "p_country":"",
              "p_city":""
            };
            ajaxRequest(
              settings.apiUrl,
              "POST",
              current_post_view_data,
              (resp)=>{
                if(resp){
                  var _data = {
                    is_like: false,
                    p_post_id: parseInt(current_view_post_id),
                    is_dislike:false,
                    is_view:true,
                    is_comment:false
                  };
                  ajaxRequest(
                    supabase_url()+"/update_post_counts",
                    "POST",
                    _data,
                    (suc)=>{
                      var current_post_views=suc[0].p_views;
                      $(settings.viewElem + current_view_post_indes).html(formatNumber(current_post_views));
                    },(erj)=>{
                      console.log("error while updating count");
                    }
                  );
                }else{
                  console.log("post already viewd");
                }
              },(rej)=>{
                console.log("something went wrong: please try again:" + rej);
              }
            )
          }else{
            console.log("numeric part not found");
          }
        }else{
          console.log("element not in center");
        }
      }
      var debouncedLogView = $.debounce(settings.debounceTime, logView);
      $(window).on("scroll", function () {
        debouncedLogView();
      });
      logView();
    });
  };
  $.debounce = function (interval, func) {
      var lastCallTime;
      return function () {
          var now = Date.now();
          if (!lastCallTime || now - lastCallTime >= interval) {
              lastCallTime = now;
              func.apply(this, arguments);
          }
      };
  };
})(jQuery);
function getBrowserInfo() {
  var userAgent = navigator.userAgent;
  var browserName, browserVersion;
  if (/Chrome/.test(userAgent)) {
      browserName = 'Google Chrome';
  } else if (/Firefox/.test(userAgent)) {
      browserName = 'Mozilla Firefox';
  } else if (/Safari/.test(userAgent)) {
      browserName = 'Apple Safari';
  } else if (/MSIE|Trident/.test(userAgent)) {
      browserName = 'Internet Explorer';
  } else {
      browserName = 'Unknown';
  }
  if (/Edge/.test(userAgent)) {
      browserVersion = userAgent.match(/Edge\/(\S+)/)[1];
  } else if (/Chrome/.test(userAgent)) {
      browserVersion = userAgent.match(/Chrome\/(\S+)/)[1];
  } else if (/Firefox/.test(userAgent)) {
      browserVersion = userAgent.match(/Firefox\/(\S+)/)[1];
  } else if (/Safari/.test(userAgent)) {
      browserVersion = userAgent.match(/Version\/(\S+)/)[1];
  } else if (/MSIE|Trident/.test(userAgent)) {
      browserVersion = userAgent.match(/(?:MSIE|rv:)(\S+)/)[1];
  } else {
      browserVersion = 'Unknown';
  }
  var operatingSystem = navigator.platform;
  return "BrowserName: " + browserName + ",BrowserVersion:" + browserVersion + ",OperatingSystem: " + operatingSystem + ",UserAgent:" + userAgent;
}
function getGreeting() {
  var currentDate = new Date();
  var currentHour = currentDate.getHours();

  if (currentHour >= 5 && currentHour < 12) {
      return "Good morning!";
  } else if (currentHour >= 12 && currentHour < 18) {
      return "Good afternoon!";
  } else {
      return "Good evening!";
  }
}
const getDecryptQueryStringParameter = (paramName) => {
  var queryString = window.location.href.split('?')[1];
  if (queryString) {
    var params = queryString.split('&');
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      if (param[0] === paramName) {
        return G_Crypto.decrypt(param[1]);
      }
    }
    console.error(`Parameter "${paramName}" not found in the query string.`);
    return null; // Handle parameter not found as needed
  }
  console.error("No query string found.");
  return null; // Handle no query string as needed
}