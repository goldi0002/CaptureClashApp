$(document).ready(function(){
    hideLoader();
});

$(document).on('click','#btnLogin',function(){
    var _loginObj={
        "user_name": $('#txtUserName').val().trim(), 
        "user_password": $('#txtPassword').val().trim()
    };

    ajaxRequest(supabase_url()+'/check_user_credentials',
    'POST',
    _loginObj,
    (succ)=>{
        if(succ){
            window.location.href='/index.html'
        }
        else{
            $('#spnMessage').html('Invalid login credential');
        }
    },
    (error)=>{
        console.log(error);
    }
    )

});