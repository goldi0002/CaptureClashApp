'use strict';
$(document).ready(function () {
   NotiScript.GetNotifications(1);
});

const NotiScript = {
    GetNotifications: (user_seq) => {
       const _data = {
          "p_user_id": parseInt(user_seq)
       };
       ajaxRequest(
         supabase_url()+ "/get_notifications_for_user_with_user_info",
          "POST",
          _data,
          (success) => {
            hideLoader();
            console.log(success)
             $("#NotificationPanel").NotiJS({
                NcountElem: "#notification-count",
                notification_array:success
             });
             $.fn.NotiJS.notification_html();
          },
          (error) => {
             console.error(error);
          },
          null
       );
    }
};
 


(function ($) {
   $.fn.NotiJS = function (options) {
      var nSet = $.extend({
         NcountElem: "",
         notification_array: [],
         notificationId: ""
      }, options);
 
      return this.each(function () {
         var element = $(this);
 
         var filterNotificationsByType = function (type) {
            return nSet.notification_array.filter(function (item) {
               return item.notification_type === type;
            });
         };
 
         $.fn.NotiJS.notification_html = (function () {
            var result_html = `<h4 class="title">Today</h4>`;
            if (nSet.notification_array.length > 0) {
               for (var n = 0; n < nSet.notification_array.length; n++) {
                  let currentRecord = nSet.notification_array[n];
                  result_html += genrateNotificationHTML(currentRecord,n);
               }
            } else {
             result_html += '<span>No new notifications. Stay tuned for updates!</span>';
            }
            element.html(result_html);
         });
      });
   };
 
   function genrateNotificationHTML(notification,i) {
      var result_html = "";
      switch (notification.notification_type.toLowerCase()) {
         case NType.COMMENT:
            result_html += `
               <div class="notification">
                  <div class="media media-65">
                     <img class="rounded" src="/assets/images/post/pic1.png" alt="/">
                     <div class="notify bg-secondary">
                     <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="../../external.html?link=http://www.w3.org/2000/svg">
                        <path d="M6.5 0C2.90977 0 0 2.70156 0 6.03571C0 7.475 0.543359 8.79241 1.44727 9.82835C1.12988 11.2908 0.0685547 12.5938 0.0558594 12.6083C0 12.675 -0.0152344 12.7737 0.0177734 12.8607C0.0507812 12.9478 0.121875 13 0.203125 13C1.88652 13 3.14844 12.0772 3.77305 11.5085C4.60332 11.8654 5.525 12.0714 6.5 12.0714C10.0902 12.0714 13 9.36987 13 6.03571C13 2.70156 10.0902 0 6.5 0Z" fill="white"/>
                     </svg>
                     </div>
                  </div>
                  <div class="notification-content">
                     <small class="mb-1">${getTimeDifference(notification.created_at)}</small>
                     <div class="text-notify"><span class="text-primary" data-notification-sender-id="${notification.sender_id}" id="sender-name-${i}">${notification.sender_name}</span>
                     ${
                        notification.resource_type.toLowerCase() === "mention" ? " mentioned you in a comment:" :
                        (notification.notification_type.toLowerCase() === NType.COMMENT && notification.resource_type === NType.POST ?
                           " commented on your post:" : "")
                     }
                     <span class="text-primary">${notification.message}</span>
                     </div>
                     <small>“${notification.message}”</small>
                  </div>
               </div>
            `;
            break;
           case NType.LIKE:
                     result_html += `
                     <div class="notification">
                       <div class="media media-65">
                         <img class="rounded" src="/assets/images/post/pic2.png" alt="/">	
                         <div class="notify bg-red">
                           <svg width="15" height="15" viewBox="0 0 15 12" fill="none" xmlns="../../external.html?link=http://www.w3.org/2000/svg">
                             <path d="M13.544 0.820517C11.9386 -0.430353 9.55096 -0.205357 8.07735 1.1848L7.50022 1.72854L6.92308 1.1848C5.4524 -0.205357 3.06182 -0.430353 1.45639 0.820517C-0.383422 2.25621 -0.4801 4.83294 1.16635 6.38917L6.83519 11.7409C7.20139 12.0864 7.79611 12.0864 8.16231 11.7409L13.8311 6.38917C15.4805 4.83294 15.3839 2.25621 13.544 0.820517Z" fill="white"/>
                           </svg>
                         </div>
                       </div>
                       <div class="notification-content">
                         <small class="mb-1">${getTimeDifference(notification.created_at)}</small>
                         <div class="text-notify"><span class="text-primary" data-notification-sender-id="${notification.sender_id}" id="sender-name-${i}">${notification.sender_name} </span> liked your post</div>
                       </div>    
                        </div>`;
             break; 
            case NType.SUGGESTION:
             break;
            case NType.COMMUNITY:
               break;
         default:
            break;
      }
      return result_html;
   }
 
 })(jQuery);