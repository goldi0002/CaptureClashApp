$(document).ready(()=>{
  hideLoader();
  CreatePostFeatures.PageEvents()
});
const CreatePostFeatures={
      PageEvents:()=>{
         $(".post-visibility").on('click',function(e){
            e.preventDefault();
               let check_visibility=$(this).data('visibility').toLowerCase();
               if(check_visibility){
                    let result_html = "";
                   switch(check_visibility){
                      case "friends":
                        result_html += `
                        <a href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEnd1" aria-controls="offcanvasEnd1">
                            <svg class="me-1" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="../../external.html?link=http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2124 7.76241C14.2124 10.4062 12.0489 12.5248 9.34933 12.5248C6.6507 12.5248 4.48631 10.4062 4.48631 7.76241C4.48631 5.11865 6.6507 3 9.34933 3C12.0489 3 14.2124 5.11865 14.2124 7.76241ZM2 17.9174C2 15.47 5.38553 14.8577 9.34933 14.8577C13.3347 14.8577 16.6987 15.4911 16.6987 17.9404C16.6987 20.3877 13.3131 21 9.34933 21C5.364 21 2 20.3666 2 17.9174ZM16.1734 7.84875C16.1734 9.19506 15.7605 10.4513 15.0364 11.4948C14.9611 11.6021 15.0276 11.7468 15.1587 11.7698C15.3407 11.7995 15.5276 11.8177 15.7184 11.8216C17.6167 11.8704 19.3202 10.6736 19.7908 8.87118C20.4885 6.19676 18.4415 3.79543 15.8339 3.79543C15.5511 3.79543 15.2801 3.82418 15.0159 3.87688C14.9797 3.88454 14.9405 3.90179 14.921 3.93246C14.8955 3.97174 14.9141 4.02253 14.9396 4.05607C15.7233 5.13216 16.1734 6.44206 16.1734 7.84875ZM19.3173 13.7023C20.5932 13.9466 21.4317 14.444 21.7791 15.1694C22.0736 15.7635 22.0736 16.4534 21.7791 17.0475C21.2478 18.1705 19.5335 18.5318 18.8672 18.6247C18.7292 18.6439 18.6186 18.5289 18.6333 18.3928C18.9738 15.2805 16.2664 13.8048 15.5658 13.4656C15.5364 13.4493 15.5296 13.4263 15.5325 13.411C15.5345 13.4014 15.5472 13.3861 15.5697 13.3832C17.0854 13.3545 18.7155 13.5586 19.3173 13.7023Z" fill="#130F26"/>
                            </svg>
                          Friends
                          <i class="fa-solid fa-angle-down ms-2"></i>
                        </a>
                        `;
                        break;
                      case "public":
                        result_html += `
                        <a href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEnd1" aria-controls="offcanvasEnd1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="me-1" viewBox="0 0 24 24" id="public">
                                <path fill="none" style="fill:none !important"d="M0 0h24v24H0V0z" />
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                            </svg>
                          Public
                          <i class="fa-solid fa-angle-down ms-2"></i>
                        </a>
                        `;
                        break;
                      case "me":
                        result_html += `
                        <a href="javascript:void(0);" data-bs-toggle="offcanvas" data-bs-target="#offcanvasEnd1" aria-controls="offcanvasEnd1">
                             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class=""me-1 xmlns="../../external.html?link=http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M16.9229 10.2C16.5089 10.2 16.1729 9.86401 16.1729 9.45001V7.30301C16.1729 5.20701 14.4679 3.50201 12.3719 3.50201H12.3559C11.3429 3.50201 10.3939 3.89201 9.67688 4.60301C8.95488 5.31701 8.55588 6.27001 8.55188 7.28601V9.45001C8.55188 9.86401 8.21588 10.2 7.80188 10.2C7.38788 10.2 7.05188 9.86401 7.05188 9.45001V7.30301C7.05788 5.86301 7.61488 4.53401 8.61988 3.53801C9.62588 2.54101 10.9539 1.96401 12.3749 2.00201C15.2949 2.00201 17.6729 4.38001 17.6729 7.30301V9.45001C17.6729 9.86401 17.3369 10.2 16.9229 10.2Z" fill="black"/>
                                <path  d="M8.542 10.1288C6.864 10.1288 5.5 11.4928 5.5 13.1708V17.4598C5.5 19.1378 6.864 20.5018 8.542 20.5018H16.183C17.86 20.5018 19.225 19.1378 19.225 17.4598V13.1708C19.225 11.4928 17.86 10.1288 16.183 10.1288H8.542ZM16.183 22.0018H8.542C6.037 22.0018 4 19.9648 4 17.4598V13.1708C4 10.6658 6.037 8.62878 8.542 8.62878H16.183C18.688 8.62878 20.725 10.6658 20.725 13.1708V17.4598C20.725 19.9648 18.688 22.0018 16.183 22.0018Z" fill="black"/>
                                <path  d="M12.3623 17.1756C11.9483 17.1756 11.6123 16.8396 11.6123 16.4256V14.2046C11.6123 13.7906 11.9483 13.4546 12.3623 13.4546C12.7763 13.4546 13.1123 13.7906 13.1123 14.2046V16.4256C13.1123 16.8396 12.7763 17.1756 12.3623 17.1756Z" fill="black"/>
                             </svg>
                            Only me
                            <i class="fa-solid fa-angle-down ms-2"></i>
                         </a>
                        `;
                        break;
                        break;
                   }
                   $("#post-audience").html(result_html).attr({
                    'data-key-algo-visibility': check_visibility === "friends" ? "FR" : (check_visibility === "public" ? "PB" : (check_visibility === "me" ? "M" : "")),
                    'data-visibility': check_visibility
                   });
                   $('#offcanvasEnd1').offcanvas('toggle');
               }
         });
         $("#spnDeleteUploadImage").on('click',function(e){
            e.preventDefault();
            alert("delete working")
         });
         $("#btnSavePost").on('click',function(e){
                let post_display_url= $("#uploded-image").attr('src');
                let post_title = $("#uploded-image").data("image-title");
                let post_thumb_url=$("#uploded-image").data("thumb-url");
                let post_id=$("#uploded-image").data("image-id");
                let post_image_delete_url=$("#uploded-image").data("image-delete-url");
               
                let _post_data={
                    p_user_id:2,
                    p_content:$("#post-content").val().trim(),
                    p_caption:"",
                    p_is_private:$("#post-audience").data("key-algo-visibility") === "M"  ? true : false,
                    p_image_url:post_display_url,
                    p_video_url:null,
                    p_tag_users:[],
                    p_hashtag:[],
                    p_post_id:0,
                    p_is_frineds:$("#post-audience").data("key-algo-visibility").toLowerCase() === "fr" ? true  : false
                }

                if(_post_data){
                      ajaxRequest(
                        supabase_url() +"/save_or_update_post",
                        "POST",
                        _post_data,
                        (success)=>{
                              if(success){
                                   window.location.href = "/Home.html";
                              }else{
                                $("#toastContent").html("Something went wrong..")
                                toast.show();
                                setTimeout(() => {
                                    toast.hide();
                                }, 2000);
                              }
                        },(error)=>{
                            $("#toastContent").html("Something went wrong..")
                                toast.show();
                                setTimeout(() => {
                                    toast.hide();
                                }, 2000);
                        }
                      )
                }
         });
    },
    UploadFileToServer: (file) => {
        var apiKey = imgBB_key(); // Replace with your ImgBB API key
        var apiUrl = "https://api.imgbb.com/1/upload";
        var formData = new FormData();
        formData.append("image", file);
        formData.append("key", apiKey);
        var xhr = new XMLHttpRequest();
        // $(".image-handler-3").show();
        xhr.upload.addEventListener("progress", function (event) {
          if (event.lengthComputable) {
            var percentComplete = (event.loaded / event.total) * 100;
            // document.getElementById("progressBar").style.width =
            //   percentComplete + "%";
            // Update the progress UI here, for example, display a progress bar
            console.log("Upload Progress: " + percentComplete + "%");
          }
        });
        xhr.onload = function () {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
             $("#uploded-image").attr({
              'src':response.data.display_url,
              'data-thumb-url':response.data.thumb.url,
              'data-image-id':response.data.id,
              'data-image-title':response.data.title,
              'data-image-delete-url':response.data.delete_url
             });
             $("#liUploadImge").show();
            console.log(response);
            $("#toastContent").html("Uploaded Successfully please continue.")
            toast.show();
            setTimeout(() => {
                toast.hide();
            }, 2000);
          } else {
            console.log("Error uploading image. Status: " + xhr.status);
          }
        };
        xhr.onerror = function () {
            $("#toastContent").html("Network error during image upload")
            toast.show();
            setTimeout(() => {
                toast.hide();
            }, 2000);
        };
        xhr.open("POST", apiUrl, true);
        xhr.send(formData);
        
    },
}
function validateMedia() {
    var mediaInput = $('#mediaInput')[0];
    if (mediaInput.files.length > 0) {
        var file = mediaInput.files[0]
        var fileType = mediaInput.files[0].type;
        var fileSize = mediaInput.files[0].size; // in bytes
        var maxSizeVideo = 25 * 1024 * 1024; // 30 MB for videos
        var maxSizeImage = 1 * 1024 * 1024; // 5 MB for images
        var check_upload_document=true;
        if (fileType.startsWith('image/') && fileSize > maxSizeImage) {
            toast.show()
            $("#toastContent").html("Image file size exceeds 25 MB limit.")
            toast.show()
            mediaInput.value = '';
            check_upload_document=false
        // } else if (fileType.startsWith('video/') && fileSize > maxSizeVideo) {
        //     $("#toastContent").html("Video file size exceeds 25 MB limit.")
        //     toast.show()
        //     mediaInput.value = '';
        //     check_upload_document=false
        } else if (!fileType.startsWith('image/') && fileType.startsWith('video/')) {
            $("#toastContent").html("Invalid file format. Please use PNG, JPEG, or video mp4 files.")
            toast.show()
            mediaInput.value = '';
            check_upload_document=false
        }
        if(!check_upload_document){
            return false;
        }else{
            CreatePostFeatures.UploadFileToServer(file)
        }
    }
}
function openMediaInput(event) {
    event.preventDefault(); // Prevent the default behavior of the anchor tag
    document.getElementById('mediaInput').click(); // Programmatically click the hidden file input
}

