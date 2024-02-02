$(document).ready(function(){
    hideLoader();
});

$(document).on('click','#btnLogin',function(){
    var _loginObj={
        "user_name": $('#txtUserName').val().trim(), 
        "user_password": $('#txtPassword').val().trim()
    };
    ajaxRequest(supabase_url() + '/check_user_credentials',
    'POST',
    _loginObj,
    (succ)=>{
        if(succ.user_exists){
            let user_id=succ.user_id;
            ajaxRequest(
                supabase_url()+"/get_user_details",
                "POST",
                {"p_user_id":parseInt(user_id)},
                (success)=>{
                    console.log(success);
                    setSessionData("USER_NAME",success[0].p_user_name)
                    setSessionData("USER_ID",success[0].p_user_seq);
                    setSessionData("IS_LOGGED_IN",true);
                    setSessionData("USER_EMAIL",success[0].p_email);
                    setSessionData(
                      "USER_FL_NAME",
                      success[0].p_first_name.trim() +
                        " " +
                        success[0].p_last_name.trim()
                    );
                    window.location.href='/index.html'
                },(ero)=>{

                }
            )
         
        }
        else{
            $('#spnMessage').html('Invalid login credential');
            event.preventDefault();
        }
    },
    (error)=>{
        console.log(error);
    }
    )

});