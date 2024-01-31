var isValid=false;
var textBoxId="";
var keyupId="";
$(document).ready(function(){
    hideLoader();
});
$(document).on('click','#aRegister',function(){
    checkValidation();
    if(isValid){
        return;
    }
    
    var _regiObj={
        "p_active_flag": "Y",
         "p_email": $('#email').val(), 
         "p_first_name":$('#firstName').val().trim(),
          "p_last_name": $('#lastName').val().trim(),
           "p_password": $('#password').val().trim(),
            "p_user_name": $('#userName').val().trim()
    };
    var otp=generateOTP();
    window.localStorage.setItem('_regiObj',_regiObj);
    window.location.href='/Settings/otp-confirm.html';
});

function checkValidation(){
    $('.error').hide();
    if($('#firstName').val()=="" && $('#userName').val()=="" && $('#email').val()=="" && $('#password').val()==""){
        $('.error').show();
        isValid=true;
    }
    if($('#firstName').val()==""){
        $('#spnfirstName').show();
        isValid=true;
    }
    if($('#userName').val()==""){
        $('#spnuserName').show();
        isValid=true;
    }
    if($('#email').val()==""){
        $('#spnemail').text('Email field is required').show();
        isValid=true;
    }
    else{
        var emailRegex =/^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;
        if (!emailRegex.test($('#email').val())) {
            $('#spnemail').text('Please enter a valid email address.').show();
        } else {
            $('#spnemail').hide();
        }
        isValid=true;
    }
    if($('#password').val()==""){
        $('#spnpassword').show(); 
        isValid=true;
    }
}

$(document).on('focus','input',function(){
    textBoxId=$(this).attr('id');
    keyupId='#'+textBoxId
    console.log('#'+textBoxId);
});

$(document).on('keyup',keyupId,function(){
    if($('#'+textBoxId).val()!=''){
        $('#spn'+textBoxId).hide();
    }
});

function clearFields(){
    $('#firstName').val('');
    $('#userName').val('');
    $('#email').val('');
    $('#password').val('');
    $('#lastName').val('');
}

function generateOTP() {
    var digits = '0123456789';
    var OTP = '';
    for (var i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}