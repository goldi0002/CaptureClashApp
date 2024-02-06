new Vue({
  el: "#app",
  data: {
    comments: [],
    liked_comments: [],
    newCommentText: "",
    replyingToComment: false,
    replyParentCommentSeq: null,
    likesCountRefs: {},
    activeCommentSeqs: [],
    showChild: {},
    typingLogId: null,
    typingTimeout: null,
    isTyping: false,
    whoIStyping:[],
  },
  computed: {
    htmlOfTyping() {
      // Customize the HTML based on the user's typing status
      // return this.isTyping ? `<p>${getSessionData("USER_FL_NAME")} is typing....</p>` : '';
    },
  },
  methods: {
    pushNewCommentInExisingComments(is_commentReply) {
      const _get_last_Comment = {
        _post_id: parseInt(getDecryptQueryStringParameter("cmt").split("=")[1]),
        _user_id: parseInt(getSessionData("USER_ID")),
      };
    
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
        "Content-Type": "application/json",
      };
    
      const getCommentsUrl = supabase_url() + "/get_last_comment_by_post_and_user";
    
      const updateCommentArray = (targetArray, newItem) => {
        const existingIndex = targetArray.findIndex(comment => comment.comment_seq === newItem.comment_seq);
        if (existingIndex !== -1) {
          targetArray.splice(existingIndex, 1);
        }
        targetArray.push(newItem);
      };
    
      const fetchNewComments = () => {
        axios.post(getCommentsUrl, _get_last_Comment, { headers }).then((response) => {
          const newComment = response.data;
          const commentExists = this.comments.some(comment => comment.comment_seq === newComment.comment_seq);
          if(commentExists){
             fetchNewComments();
          }else{
          if (!is_commentReply) {
            updateCommentArray(this.comments, {
              ...newComment,
              child_comments: Array.isArray(newComment.child_comments) ? newComment.child_comments : [],
            });
          } else {
            const parentComment = this.comments.find(comment => comment.comment_seq === this.replyParentCommentSeq);
    
            if (parentComment) {
              updateCommentArray(parentComment.child_comments || [], {
                ...newComment,
                child_comments: Array.isArray(newComment.child_comments) ? newComment.child_comments : [],
              });
            }
          }
          if (!commentExists) {
            return;
          }
          fetchNewComments();
         }
        }).catch((error) => {
          console.log(error);
        });
      };
      fetchNewComments();
    },
    getTypingLogs() {
      const getTypingLogsUrl = supabase_url() + "/get_typing_logs_by_resource_seq";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
      };
      const _typing_log_data = {
        p_resource_seq: parseInt(getDecryptQueryStringParameter("cmt").split("=")[1]),
        p_resource_type: "POST",
      };
    
      const fetchNewTypingLogs = () => {
        axios.post(getTypingLogsUrl, _typing_log_data, { headers }).then((response) => {
          const typingLogs = response.data;
          this.whoIStyping = [];
          if (typingLogs.length > 0) {
            this.whoIStyping = typingLogs.filter((typingLog) => typingLog.p_user_id !== parseInt(getSessionData("USER_ID")));
          }
          this.typingTimeout = setTimeout(fetchNewTypingLogs, 1000);
        }).catch((error) => {
          console.log(error);
        });
      };
      fetchNewTypingLogs();
    },    
    async submitComment() {
      const postCommentUrl = supabase_url() + "/update_or_save_comment";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
        "Content-Type": "application/json",
      };
      if (this.newCommentText.trim() !== "") {
        if (this.replyingToComment) {
          const newReply = {
            _comment_text: this.newCommentText,
            _comment_seq: null,
            _post_id: getDecryptQueryStringParameter("cmt").split("=")[1],
            _user_id: parseInt(getSessionData("USER_ID")),
            _parent_comment_id: this.replyParentCommentSeq,
          };
          try {
            await axios.post(postCommentUrl, newReply, { headers });
            this.my_liked_comments(); // Fetch liked comments after comment submission
            this.pushNewCommentInExisingComments(true);
          } catch (error) {
            console.error("Error posting reply:", error);
          }
        } else {
          const newComment = {
            _comment_text: this.newCommentText,
            _comment_seq: null,
            _post_id: getDecryptQueryStringParameter("cmt").split("=")[1],
            _user_id: parseInt(getSessionData("USER_ID")),
            _parent_comment_id: null,
          };

          try {
            await axios.post(postCommentUrl, newComment, { headers });

            // this.comments.push(newComment);
            var _data = {
              is_like: false,
              p_post_id: parseInt(
                getDecryptQueryStringParameter("cmt").split("=")[1]
              ),
              is_dislike: false,
              is_view: false,
              is_comment: true,
            };
            const url = supabase_url() + "/update_post_counts";
            axios
              .post(url, _data, { headers })
              .then((response) => {
                console.log(response);
              })
              .catch((error) => {
                console.log(error);
              });
            this.my_liked_comments(); // Fetch liked comments after comment submission
            this.pushNewCommentInExisingComments(false);
          } catch (error) {
            console.error("Error posting comment:", error);
          }
        }
        this.newCommentText = ""; // Clear the input field after posting the comment
      }
    },
    my_liked_comments() {
      const likeCommentUrl =
        supabase_url() + "/get_likes_comments_id_by_post_id";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
        "Content-Type": "application/json",
      };
      const _my_liked_comments_d = {
        p_user_id: parseInt(getSessionData("USER_ID")),
        p_resource_type: "COMMENT",
        p_resource_seq: parseInt(
          getDecryptQueryStringParameter("cmt").split("=")[1]
        ),
      };

      try {
        axios
          .post(likeCommentUrl, _my_liked_comments_d, { headers })
          .then((suc) => {
            this.$set(this, "liked_comments", suc.data);
            console.log(this.liked_comments);
          })
          .catch((ee) => {
            console.log(ee);
          });
      } catch (error) {
        console.log(error);
      }
    },
    replyCommentByCommentSeq(parentCommentSeq) {
      this.replyingToComment = true;
      this.replyParentCommentSeq = parentCommentSeq;
      this.newCommentText = ""; // Clear the input field
      this.$nextTick(() => {
        this.$refs.commentInput.focus(); // Set focus to the input field
      });
    },
    likeComment(commentSeq) {
      const likeCommentUrl = supabase_url() + "/save_or_update_like";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
      };
      const _like_data = {
        p_resource_seq: parseInt(commentSeq),
        p_user_id: parseInt(getSessionData("USER_ID")),
        p_resource_type: "COMMENT",
        p_post_seq: parseInt(
          getDecryptQueryStringParameter("cmt").split("=")[1]
        ),
      };

      axios
        .post(likeCommentUrl, _like_data, { headers })
        .then((res) => {
          if (res.status == 200) {
            if (res.data == "inserted" || res.data == "deleted") {
              this.my_liked_comments();
              if (res.data == "inserted") {
                this.updateLikesCount(res.data, commentSeq);
              } else if (res.data == "deleted") {
                this.updateLikesCount(res.data, commentSeq);
              } else {
                alert(
                  "Hii Sorry! Something went wrong please refresh your page & try again."
                );
              }
              const index = this.activeCommentSeqs.indexOf(commentSeq);
              if (index === -1) {
                this.activeCommentSeqs.push(commentSeq);
              } else {
                this.activeCommentSeqs.splice(index, 1);
              }
              //   console.log(res.data);
              //    // Refresh liked comments after liking/unliking
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    updateLikesCount(likeAction, commentSeq) {
      const liId = `liLikesCount-${commentSeq}`;
      const liElement = document.getElementById(liId);
      if (liElement) {
        const currentLikesCount = liElement.dataset.likeCount;
        const currentLikesCountNumber = parseInt(currentLikesCount);
        const newLikesCount =
          currentLikesCountNumber + (likeAction === "inserted" ? 1 : -1);
        liElement.dataset.likeCount = newLikesCount;
        const formattedLikes = formatNumber(newLikesCount);
        liElement.textContent = `${formattedLikes} Like`;
      }
    },
    isButtonActive(commentSeq) {
      const isAlreadyLiked =
        this.liked_comments &&
        this.liked_comments.length > 0 &&
        this.liked_comments.includes(commentSeq);
      return isAlreadyLiked;
    },
    showChildComments(commentSeq) {
      const liChildCommentId = `liChildComments-${commentSeq}`;
      const liChildCommentElements =
        document.getElementsByClassName(liChildCommentId);
      let displayStyle = "none";
      if (!this.showChild[commentSeq]) {
        displayStyle = "flex"; // or any other desired value, assuming you're using display: flex
      }
      for (const element of liChildCommentElements) {
        element.style.display = displayStyle;
      }
      this.$set(this.showChild, commentSeq, !this.showChild[commentSeq]);
    },
    getComments() {
      const getCommentsUrl = supabase_url() + "/get_comments_by_post_id";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
      };
      const requestData = {
        _post_id: getDecryptQueryStringParameter("cmt").split("=")[1],
      };

      axios
        .post(getCommentsUrl, requestData, { headers })
        .then((response) => {
          this.comments = response.data.map((comment) => ({
            ...comment,
            child_comments: comment.child_comments || [],
          }));
        })
        .catch((error) => {
          console.error("Error fetching comments:", error);
        });
    },
    saveTypingLogs() {
      const saveTypingLogsUrl = supabase_url() + "/save_typing_log";
      const headers = {
        Authorization: "Bearer " + supabase_KEY(),
        apikey: supabase_KEY(),
      };
    
      const _typing_log_data = {
        p_user_id: parseInt(getSessionData("USER_ID")),
        p_resource_seq: parseInt(getDecryptQueryStringParameter("cmt").split("=")[1]),
        p_resource_type: "POST",
        p_log_message: getSessionData("USER_FL_NAME") + " " + "is typing....",
      };
    
      axios
        .post(saveTypingLogsUrl, _typing_log_data, { headers })
        .then((response) => {
          this.typingLogId = response.data;
          this.isTyping = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    deleteTypingLog() {
      if (this.typingLogId) {
        const deleteTypingLogUrl = `${supabase_url()}/delete_typing_log`;
        const headers = {
          Authorization: "Bearer " + supabase_KEY(),
          apikey: supabase_KEY(),
        };
        const _ld={
          p_typing_logs_seq:parseInt(this.typingLogId)
        };

        axios
          .post(deleteTypingLogUrl,_ld, { headers })
          .then(() => {
            console.log("Typing log deleted");
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    startTyping() {
      if (!this.isTyping) {
        this.saveTypingLogs();
      }
    },
    stopTyping() {
      clearTimeout(this.typingTimeout);
      this.deleteTypingLog();
      this.isTyping = false;
    },    
  },
  mounted() {
    this.getComments();
    this.getTypingLogs()
    this.my_liked_comments();
  },
});
