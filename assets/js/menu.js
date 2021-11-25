$(document).ready(function(){
    var token = getCookie('token');
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

    setDropDown("ReportingMonths");
    setDropDown("Partners");
    setDropDown("Products");
    setCard("YTD_SALE", "YTD Sale");
    setCard("MTD_PERC", "MTD Percentage");
    setCard("YTD_CYP", "YTD CYP");


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
                            var img = '';
                            var classStatus='';
                            var statusText = '';
                            var groupOn = response[i].groupOn;
                            if(groupOn.toLowerCase().includes('sathi')){
                                img='sathi';
                            }else if(groupOn.toLowerCase().includes('do ')){
                                img='do';
                            }else if(groupOn.toLowerCase().includes('touch delay')){
                                img='touch_delay';
                            }else if(groupOn.toLowerCase().includes('touch ribbed')){
                                img='touch_ribbed';
                            }else if(groupOn.toLowerCase().includes('touch dotted')){
                                img='touch_dotted';
                            }
                            if(response[i].percentage<15){
                                classStatus = 'danger';
                                statusText = 'Danger';
                            }else if(response[i].percentage<70){
                                classStatus = 'warning';
                                statusText = 'Work Harder';
                            }else {
                                classStatus = 'success';
                                statusText = 'Best';
                            }

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
                    $('#performanceDetail').html(html);

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

function setCard(type, detail){
    var token= getCookie('token');

    var url = AllConstant.baseURL + "/getCardData";

    $.ajax({
        type: "GET",
        url: url,
        data: {token:token, type:type},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);

            if(response.status==="200"){
                $('#'+type+'_NUMBER').html(response.number);
                $('#'+type+'_DETAIL').html(detail);
            }else{
                alert("Something went wrong in populating dropdown!");
            }
        },
        error: function (data) {

        }
    });
}


