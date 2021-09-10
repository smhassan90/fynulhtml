const AllConstant = {
    baseURL: "http://localhost:8080"
};

$(document).ready(function(){
    $('#btnLogin').click(function(){
        var id = $('#inputID').val();
        var pass = $('#inputPass').val();
        var staffType = 3;
        var url = AllConstant.baseURL + "/loginServer";

        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');

        if(id !== "" && pass !== "" ){
            $.ajax({
                type: "GET",
                url: url,
                data: {username:id, password:pass, staffType: staffType},
                contentType: "application/json",
                dataType: "text",
                success: function (data) {
                    const loginResponse = JSON.parse(data);
                    if(loginResponse.statusCode !== undefined){
                        if(loginResponse.statusCode === "200"){
                            alert("Successful login");
                        }else if(loginResponse.statusCode === "404"){
                            alert("Invalid username or password");
                        }
                    }
                },
                error: function (data) {
                    alert(data)
                }
            });
        }
    });
});