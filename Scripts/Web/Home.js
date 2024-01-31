'use strict'
var my_liked_post=[];
$(document).ready(()=>{
   HomeScriptFeature.getMyLikedPostIds();
   hideLoader();
   HomeScriptFeature.ClickEvents();
});
const HomeScriptFeature={
      ClickEvents:()=>{
         $(document).on('click','[id^="like-post-"]',function(e){
            var numericPart = this.id.match(/-(\d+)$/);
            if (numericPart) {
              var extractedNumber = numericPart[1];
              var _like_data={
                  p_post_id:parseInt(extractedNumber),
                  p_user_id:4
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
                     };
                     ajaxRequest(
                        supabase_url() +"/update_post_counts",
                        "POST",
                        _data,
                        (success)=>{
                             if(success){
                              var likeButton = $(this);
                              var likesCount = success[0].p_likes;
                                    if (likesCount > 0 && succ==="deleted") {
                                       likeButton.find('.fa-solid').removeClass('fa-solid').addClass('fa-regular');
                                    }else if(likesCount > 0 && succ==="inserted") {
                                       likeButton.find('.fa-regular').removeClass('fa-regular').addClass('fa-solid');
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
      },
      getMyLikedPostIds:()=>{
         ajaxRequest(
            supabase_url() +"/get_liked_post_ids",
            "POST",
            {"p_user_id":4},
            (success)=>{
               if(success){
                  my_liked_post=success;
                  HomeScriptFeature.getAllpostsFromServer(0, 10);
               }
            },(error)=>{
               console.error(error);
            }
         )
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
             $.each(post_data,function(index,item){
                  post_html += `
                  <div class="post-card" id="post-card-${item.post_id}">
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
										<a href="/Community/comment.html" class="action-btn bg-secondary">
											<span><i class="fa-solid fa-comment fill-icon"></i></span>
											<h6 class="font-14 mb-0 ms-2">${formatNumber(item.comments)}</h6>
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
                  `;
             });
             $("#post-area-section").html(post_html);
         }else{

         }
         
      }
}