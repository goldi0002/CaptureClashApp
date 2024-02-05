'use strict'
var lastPostCard;
var my_liked_post=[];
var page_no_g=1;
var page_lenth_g=30;
var lastPostCardReached = false;
var viewTrackerInitialized = false;
$(document).ready(()=>{
   if(getSessionData("USER_ID")!==null){
      HomeScriptFeature.BindSidebarUserInfo(true);
   }else{
      HomeScriptFeature.BindSidebarUserInfo(false);
   }
   HomeScriptFeature.getMyLikedPostIds();
   hideLoader();
   HomeScriptFeature.ClickEvents();
   function onLastPostCardReached() {
       if (!lastPostCardReached) {
         //   HomeScriptFeature.getAllpostsFromServer(page_no_g + 2, page_lenth_g);
       }
   }
   
   $(window).scroll(function () {
       var lastPostCardBottom = lastPostCard.position().top + lastPostCard.outerHeight(true);
       if ($(window).scrollTop() + $(window).height() >= lastPostCardBottom) {
           onLastPostCardReached();
       }
   });   
});
const HomeScriptFeature={
      ClickEvents:()=>{
         $(document).on('click','[id^="like-post-"]',function(e){
            if(getSessionData("USER_ID")==null){
                e.preventDefault();
                return;
            }
            var numericPart = this.id.match(/-(\d+)$/);
            if (numericPart) {
              var extractedNumber = numericPart[1];
              var _like_data={
                  p_resource_seq:parseInt(extractedNumber),
                  p_user_id: parseInt(getSessionData("USER_ID")),
                  p_resource_type:'POST',
                  p_post_seq:null
              }
              ajaxRequest(
               supabase_url() +"/save_or_update_like",
               "POST",
               _like_data,
               (succ)=>{
                  if(succ ==="deleted" || succ ==="inserted" ){
                     
                     var _data = {
                       is_like: succ === "inserted" ? true : false,
                       p_post_id: parseInt(extractedNumber),
                       is_dislike: succ === "deleted" ? true : false,
                       is_view:false,
                       is_comment:false
                     };
                     ajaxRequest(
                        supabase_url() +"/update_post_counts",
                        "POST",
                        _data,
                        (success)=>{
                             if(success){
                              var likeButton = $(this);
                              var likesCount = success[0].p_likes;
                                    if (likesCount > 0 && succ.trim().toLowerCase() === "deleted") {
                                       likeButton.find('.fa-heart').removeClass('fa-solid').addClass('fa-regular');
                                    }else if(likesCount > 0 && succ.trim().toLowerCase() === "inserted") {
                                       likeButton.find('.fa-heart').removeClass('fa-regular').addClass('fa-solid');
                                    }
                                    $(this).find('h6').html(formatNumber(likesCount));
                           }
                        },(error)=>{
                           console.error(error);
                        }
                     )         
                  }
               },(error)=>{
                  console.error(error);
               }
              )
            }
         });
         $(document).on('click','#log-out-btn',function(e){
            e.preventDefault();
            clearAllSessionData();
            window.location.href="/Auth/welcome.html";
         });
      },
      getMyLikedPostIds:()=>{
         ajaxRequest(
            supabase_url() +"/get_liked_post_ids",
            "POST",
            {
               "p_user_id":parseInt(getSessionData("USER_ID")),
               "p_resource_type":"POST"
            },
            (success)=>{
               if(success){
                  my_liked_post=success;
                  HomeScriptFeature.getAllpostsFromServer(page_no_g, page_lenth_g);
                  hideLoader();
               }
            },(error)=>{
               console.error(error);
            }
         )
      },
      BindSidebarUserInfo:(isTrew)=>{
         var _user_info_html=""
         if(isTrew){
            _user_info_html +=`
            <span>${getGreeting()}</span>
            <h5 class="name">${getSessionData("USER_FL_NAME")}</h5>
            `;
         }else{
            _user_info_html +=`
            <span>${getGreeting()}</span>
            <h5 class="name">Hey! Guest</h5>
            `;
         }
         $("#sidebar-user-info").html(_user_info_html);
      },
      getDeviceType:()=> {
         return /Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile/.test(navigator.userAgent) ? 'Mobile' : 'Desktop';
      },
      CheckPostIsLikes: (post_id) => {
         return my_liked_post.includes(post_id);
      },     
      getAllpostsFromServer:(page_no,page_lenth)=>{
         let _data={
            p_user_id:null,
            p_offset:page_no,
            p_limit:page_lenth
         }
          ajaxRequest(
            supabase_url() +"/get_posts",
            "POST",
            _data,
            (success)=>{
               HomeScriptFeature.BindPostHtml(success);
            },(error)=>{
               Aerror();
            }
         )
      },
      BindPostHtml:(post_data)=>{
         if(typeof post_data !== "undefined" && Array.isArray(post_data) && post_data.length>0){
             let post_html="";
            //  page_no_g = post_data.length + 10;
            //  page_lenth_g = page_lenth_g + 10;
             $.each(post_data,function(index,item){
                  post_html += `
                  <div class="post-card post-view-cls" data-post-index="${index}" data-post-id="post-card-${item.post_id}">
						<div class="top-meta">
							<div class="d-flex justify-content-between align-items-start">
								<a href="/Profile/user-profile.html" class="media media-40">
									<img class="rounded" src="/assets/images/stories/small/pic4.jpg" alt="/">
								</a>
								<div class="meta-content ms-3">
									<h6 class="title mb-0"><a href="/Profile/user-profile.html">${item.post_by_user_name}</a></h6>
									<ul class="meta-list">
										<li>
											<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="../../external.html?link=http://www.w3.org/2000/svg">
												<path d="M12.25 5.83331C12.25 9.91665 7 13.4166 7 13.4166C7 13.4166 1.75 9.91665 1.75 5.83331C1.75 4.44093 2.30312 3.10557 3.28769 2.121C4.27226 1.13644 5.60761 0.583313 7 0.583313C8.39239 0.583313 9.72774 1.13644 10.7123 2.121C11.6969 3.10557 12.25 4.44093 12.25 5.83331Z" stroke="black" stroke-opacity="0.6" stroke-linecap="round" stroke-linejoin="round"/>
												<path d="M7 7.58331C7.9665 7.58331 8.75 6.79981 8.75 5.83331C8.75 4.86681 7.9665 4.08331 7 4.08331C6.0335 4.08331 5.25 4.86681 5.25 5.83331C5.25 6.79981 6.0335 7.58331 7 7.58331Z" stroke="black" stroke-opacity="0.6" stroke-linecap="round" stroke-linejoin="round"/>
											</svg>	
											Bangkok, Thailand
										</li>
										<li>${getTimeDifference(item.posted_at)}</li>
									</ul>
								</div>
							</div>
							<a href="javascript:void(0);" class="item-content item-link" data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom1" aria-controls="offcanvasBottom">
								<svg width="15" height="14" viewBox="0 0 15 14" fill="none" xmlns="../../external.html?link=http://www.w3.org/2000/svg">
									<path d="M14.7566 4.93237L9.60021 0.182841C9.14886 -0.23294 8.4375 0.104591 8.4375 0.750465V3.25212C3.73157 3.30959 0 4.31562 0 9.07267C0 10.9927 1.1596 12.8948 2.4414 13.8893C2.84139 14.1996 3.41145 13.8101 3.26397 13.3071C1.93553 8.77542 3.89405 7.57236 8.4375 7.50264V10.25C8.4375 10.8969 9.14942 11.2329 9.60021 10.8176L14.7566 6.06761C15.0809 5.7688 15.0814 5.23158 14.7566 4.93237Z" fill="#E4BEAB"/>
								</svg>
							</a>
						</div>
						<p class="text-black">
							${item.content}
						</p>
						<div class="dz-media">
							<img src="${item.image_url}" alt="/">
							<div class="post-meta-btn">
								<ul>
									<li>
										<a href="javascript:void(0);" style="cursor: pointer;" class="action-btn bg-primary" data-post-index="${index}" id="like-post-${item.post_id}">
											<span class="like-count-heart-${index}">
                                    ${HomeScriptFeature.CheckPostIsLikes(item.post_id) ? 
                                       `<i class="fa-solid fa-heart fill-icon"></i>` : 
                                       `<i class="fa-regular fa-heart fill-icon"></i>`
                                     }
                                    </span>
											<h6 class="font-14 mb-0 ms-2" id="like-count-elem-index-${index}-item.post_id}">${formatNumber(item.likes)}</h6>
										</a>
									</li>
									<li>
										<a href="/Community/comment.html?cmt=${G_Crypto.encrypt("cm="+item.post_id)}" class="action-btn bg-secondary" id="comment-post-${item.post_id}">
											<span><i class="fa-solid fa-comment fill-icon"></i></span>
											<h6 class="font-14 mb-0 ms-2">${formatNumber(item.comments)}</h6>
										</a>
									</li>
                           <li>
										<a href="javascript:void(0);" class="action-btn bg-success">
											<span><i class="fa-solid fa-eye fill-icon"></i></span>
											<h6 class="font-14 mb-0 ms-2" data-logged-user-id="${getSessionData("USER_ID")}"
                                 data-p-ip-logged-user-address="${
                                    window.localStorage.getItem("ipAddress")
                                 }" data-logged-user-device-type="${
                                    HomeScriptFeature.getDeviceType()
                                 }" data-logged-user-browser-information="${getBrowserInfo()}" id="post-views-count-${index}">${formatNumber(item.view_count!=null ? item.view_count : 0)}</h6>
										</a>
									</li>
                           <li style="display:none;">
										<a href="javascript:void(0);" class="action-btn bg-secondary">
											<span style="color:blue;"><h6 class="font-14 mb-0">Vote</h6></span>
											<h6 class="font-14 mb-0 ms-2" >${formatNumber(item.vote_count!=null ? item.vote_count : 0)}</h6>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
                  `;
             });
             $("#post-area-section").append(post_html);
             $("#post_loader").show();
             lastPostCard = $(".post-card:last");
         }else{
            lastPostCardReached = true; 
            $("#post_loader").hide()
            $("#no-post-available-text").show();
         }
         if(getSessionData("USER_ID")!==null){
            $(window).scroll(function(){
               if (!viewTrackerInitialized) {
                   $('.post-view-cls').viewTracker({
                       apiUrl: supabase_url() + "/save_clash_post_view",
                       viewElem:'#post-views-count-'
                   });
                   viewTrackerInitialized = true;
               }
            });
         }
      }
}