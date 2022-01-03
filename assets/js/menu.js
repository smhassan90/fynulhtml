$(document).ready(function(){
    var token = getCookie('token');
    if(token===null){
        self.location="adminPanelLogin.html";
    }
    var url = AllConstant.baseURL + "/getCYPBarChartData";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            new Chart($("#bar-chart-grouped"), {
                type: 'bar',
                data: response,
                options: {
                    title: {
                        display: true,
                        text: 'Comparison'
                    }
                }
            });
        },
        error: function (data) {

        }
    });

    function setBio(token) {
        var url = AllConstant.baseURL + "/getBIO";
        $.ajax({
            type: "GET",
            url: url,
            data: {token:token },
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                $('#bio').html(data);
            },
            error: function (data) {

            }
        });
    }

    setBio(token);

    setDropDown("ReportingMonths");
    setDropDown("Partners");
    setDropDown("Products");

    setCard("getCardData", "YTD");
    setCard("getCardData", "MTD");

    setCard("getUCC", "YTD");
    setCard("getUCC", "MTD");

    setCard("getAverageAndRequiredMonthly", "YTD");

    setSubOrdinatePerformanceTable(token);

    $('#btnShowDetail').click(function(){
        var month = $('.performance_reportingmonths_select').val();
        var token = getCookie('token');
        var positionCode = $('.performance_partners_select').val();
        var products = $('.performance_products_select').val();
        var url = AllConstant.baseURL + "/getProductPerformance";

        $.ajax({
            type: "GET",
            url: url,
            data: {token:token, position_code:positionCode, month:month,products:products },
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                var response = JSON.parse(data);

                if(response!=='' && response!== undefined ){
                    var html = '';
                    if(response.length>0){

                        for(var i=0 ; i<response.length ; i++){

                            html += '<tr>\n' +
                                '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o '+classStatus+' font-medium-1 mr-1"></i> '+statusText+'</td>\n' +
                                '                                                                    <td class="text-truncate">\n' +
                                '                                                                        <span class="avatar avatar-xs">\n' +
                                '                                                                            <img class="box-shadow-2" src="../app-assets/img/portrait/small/'+img+'.png" alt="avatar">\n' +
                                '                                                                        </span>\n' +
                                '                                                                        <span>'+response[i].groupOn+'</span>\n' +
                                '                                                                    </td>\n' +
                                '                                                                    <td class="text-truncate">RS '+response[i].TP_SALE_VALUE+'</td>\n' +
                                '                                                                    <td class="text-truncate">RS '+response[i].target+'</td>\n' +
                                '                                                                    <td class="text-truncate">'+response[i].percentage+'%</td>\n' +
                                '                                                                    <td>\n' +
                                '                                                                        <div class="progress" style="height: 8px;">\n' +
                                '                                                                            <div class="progress-bar progress-bar-striped bg-'+classStatus+'" role="progressbar" aria-valuenow="25" aria-valuemin="20" aria-valuemax="100" style="width:'+response[i].percentage+'%"></div>\n' +
                                '                                                                        </div>\n' +
                                '                                                                        <ngb-progressbar type="'+classStatus+'" [value]="'+response[i].percentage+'" [striped]="true" class="progress-bar-md bg-gradient-x-'+classStatus+'"></ngb-progressbar>\n' +
                                '                                                                    </td>\n' +
                                '                                                                </tr>';
                        }

                    }else{
                        html+="<tr><p>No Sale found</p></tr>";
                    }
                    $('.SPOProgress').html(html);

                }
            },
            error: function (data) {

            }
        });
    });
});


function setDropDown(type){
    var token= getCookie('token');

    var url = AllConstant.baseURL + "/get"+type;

    $.ajax({
        type: "GET",
        url: url,
        data: {token:token},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);

            if(response.status==="200"){
                populateDropDown('performance', type.toLowerCase(), response.keyValueList);
            }else{
                alert("Something went wrong in populating dropdown!");
            }
        },
        error: function (data) {

        }
    });
}

function setCard(api, type){
    var token= getCookie('token');

    var url = AllConstant.baseURL + "/"+api;

    $.ajax({
        type: "GET",
        url: url,
        data: {token:token, type:type},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);

            if(response.status==="200"){
                if(api==="getCardData"){
                    $('#'+type+'_TP_VALUE').html(response.achTPValue);
                    $('#'+type+'_TP_VALUE_DETAIL').html(type +" TP Value");

                    $('#'+type+'_TP_TARGET').html(response.targetTPValue);
                    $('#'+type+'_TP_TARGET_DETAIL').html(type +" TP Target");

                    $('#'+type+'_TP_PERC').html(response.TPValuePerc+"%");
                    $('#'+type+'_TP_PERC_DETAIL').html(type+" TP Percentage");
                }else if(api==="getUCC"){
                    $('#'+type+'_ACH_UCC').html(response.number);
                    $('#'+type+'_ACH_UCC_DETAIL').html(response.text + " ACH UCC");
                }else if(api==="getAverageAndRequiredMonthly"){
                    $('#MTD_AVERAGE_MONTHLY').html(response.achieved);
                    $('#MTD_AVERAGE_MONTHLY_DETAIL').html("Average Monthly Achieved");

                    $('#MTD_REQUIRED_MONTHLY').html(response.required);
                    $('#MTD_REQUIRED_MONTHLY_DETAIL').html("Average Monthly Required");
                }
            }
        },
        error: function (data) {

        }
    });

    $('.btnLogout').click(function(){
        clearCookies();
        self.location="adminPanelLogin.html";
    });


}
function setSubOrdinatePerformanceTable(token){
    var url = AllConstant.baseURL + "/getSPOProgress";

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

                        html += '<tr>\n' +
                            '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                            '                                                                    <td class="text-truncate">RS '+response[i].mtdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate">RS '+response[i].mtdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].mtdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate">RS '+response[i].ytdTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate">RS '+response[i].ytdAch+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].ytdPerc+'%</td>\n' +
                            '                                                                    <td class="text-truncate">RS '+response[i].FYTarget+'</td>\n' +
                            '                                                                    <td class="text-truncate">'+response[i].balance+'</td>\n' +
                            '                                                                </tr>';
                    }

                }else{
                    html+="<tr><p>No Sale found</p></tr>";
                }

                $('.SPOProgress').html(html);

        },
        error: function (data) {

        }
    });
}


