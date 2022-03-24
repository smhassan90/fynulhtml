

$(document).ready(function(){
    var token = getCookie('token');
    if(token!==null && token !== '' && token !== 'undefined'){
        self.location="menu.html";
    }
    $('#btnLogin').click(function(){
        var id = $('#inputID').val();
        var pass = $('#inputPass').val();
        var staffType = 3;
        var url = AllConstant.baseURL + "/loginServerAttempt";

       // var encrypted = CryptoJS.AES.encrypt(AllConstant.baseString, pass).toString();

        if(id !== "" && pass !== "" ){
            $.ajax({
                type: "GET",
                url: url,
                data: {username:id, password:pass},
                contentType: "application/json",
                dataType: "text",
                success: function (data) {
                    const loginResponse = JSON.parse(data);
                    if(loginResponse.statusCode !== undefined){
                        if(loginResponse.statusCode === "200"){
                            setCookie('token', loginResponse.token,365);
                            setCookie('positionCode', loginResponse.positionCode,365);
                            swal("Successfully!", loginResponse.employee.NAME+", You are logged in", "success").done();
                            if(loginResponse.designation_id){
                                self.location="menuExecutive.html";
                            }else{
                                self.location="menu.html";
                            }

                        }else if(loginResponse.statusCode === "404"){
                            swal("Error!", "Invalid username or password!", "error").done();
                        }
                    }
                },
                error: function (data) {
                    swal("Error!", "Something went wrong!", "error").done();
                }
            });
        }
    });
});