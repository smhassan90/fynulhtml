$(document).ready(function(){

    var token = getCookie('token');
    if(token===null){
        self.location="index.html";
    }
    loginLog(token);
    $("#dashboard_menu").trigger('click');

    setBio(token);

    setLastTransactionDate();

    setSubOrdinatePerformanceTable(token);

    $(document).on("click", ".person", function(){
        var positioncode = $(this).attr("data-positioncode");
        var url = AllConstant.baseURL + "/getSPOProgressProductWise";

        $.ajax({
            type: "GET",
            url: url,
            data: {token:token, position_code:positioncode},
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                var response = JSON.parse(data);
                var html="";
                var name = "";
                if(response.length>0){

                    for(var i=0 ; i<response.length ; i++){
                        if(response[i].personName!==null && response[i].personName!=='undefined' && response[i].personName!==''){
                            name = response[i].personName ;
                        }
                        html += '<tr data-positionCode="'+response[i].position_code+'" >\n' +
                            '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].mtdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].mtdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].mtdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].ytdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].ytdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].ytdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].FYTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].balance+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].CMA+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].RMA+'</td>\n' +
                            '                                                                </tr>';
                    }

                }else{
                    html+="<tr><p>No Sale found</p></tr>";
                }
                $('.modal').modal('show');
                $('.SPOProgressSKUWise').html(html);
                $('#modalHeading').html(name);
                //var table = $('.table').DataTable();
                // table.columns.adjust();
            },
            error: function (data) {

            },
            timeout: 10000
        });
    });

});

function setSubOrdinatePerformanceTable(token){
    var url = AllConstant.baseURL + "/getTeamProgress";

    $.ajax({
        type: "GET",
        url: url,
        data: {token:token},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            var html="";
            if(response.length>0){

                for(var i=0 ; i<response.length ; i++){
                    if(response[i].FYTarget == "0" && response[i].ytdAch == "0"){
                        continue;
                    }
                    if(response[i].position_code.includes("ASM")){
                        html +='<tr data-positionCode="'+response[i].position_code+'" class="person font-weight-bold">\n';
                    }else{
                        html += '<tr data-positionCode="'+response[i].position_code+'" class="person">\n';
                    }


                    html+='                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].mtdTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].mtdAch+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].mtdPerc+'%</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].ytdTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].ytdAch+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].ytdPerc+'%</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].FYTarget+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].balance+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].CMA+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].RMA+'</td>\n' +

                        '                                                                </tr>';
                }

            }else{
                html+="<tr><p>No Sale found</p></tr>";
            }

            $('.teamProgress').html(html);

        },
        error: function (data) {

        },
        timeout: 10000
    });
}

function setLastTransactionDate(){
    var url = AllConstant.baseURL + "/getLastTransactionDate";
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            $('#last_transaction_date').html("Secondary sales till : "+data);
        },
        error: function (data) {

        },
        timeout: 10000
    });
}
function setBio(token) {
    var url = AllConstant.baseURL + "/getBIO";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            if(data.includes("|")){
                if(data.split("|")[0].trim()==="null"){
                    clearCookies();
                    self.location="index.html";
                }
            }
            $('#bio').html(data);
        },
        error: function (data) {

        },
        timeout: 10000
    });
}


function loginLog(token){
    var url = AllConstant.baseURL + "/loginLog";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
        },
        error: function (data) {
        },
        timeout: 10000
    });
}

