
const supabase_key =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0YmRocXdhZnZtaGF1Y3ZrZndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5OTc0NzQsImV4cCI6MjAxOTU3MzQ3NH0.fuLEZWkK5vj9AJaClHEF3V-9wiAN7WbIJsXugKDUc18";
const IMDB_key="2b593d40e6c26c525e32831dd6d4bee7";
var Version = "1.0",
  G_Crypto = (function (e) {
    var n = new TextEncoder().encode("abcdefghijklmnopqrstuvwxyz012345$GAURAVROHIT");
    return {
      encrypt: function e(r) {
        for (
          var o = new TextEncoder().encode(r),
            t = new Uint8Array(o.length),
            a = 0;
          a < o.length;
          a++
        )
          t[a] = o[a] ^ n[a % n.length];
        return btoa(String.fromCharCode(...t));
      },
      decrypt: function e(r) {
        for (
          var o = Uint8Array.from(atob(r), (e) => e.charCodeAt(0)),
            t = new Uint8Array(o.length),
            a = 0;
          a < o.length;
          a++
        )
          t[a] = o[a] ^ n[a % n.length];
        return new TextDecoder().decode(t);
      },
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
  USER_PROFILE_IMAGE:{
    key:"user_profile_imageURL",
    defaultValue:""
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