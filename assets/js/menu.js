$(document).ready(function(){

    var token = getCookie('token');
    if(token===null){
        self.location="index.html";
    }
  //  loginLog(token);
    $("#dashboard_menu").trigger('click');
    drawBarChart(token, "groupon", "SKU wise Sale comparison on months");
    drawBarChart(token, "ucc", "UCC comparison on months");
    drawBarChart(token, "productivity", "Sale achieved comparison months");

    setBio(token);

    setDropDown("ReportingMonths");
    setDropDown("Partners");
    setDropDown("Products");

    setCard("getCardData", "YTD");
    setCard("getCardData", "MTD");

    setCard("getUCC", "YTD");
    setCard("getUCC", "MTD");

    setCard("getAverageAndRequiredMonthly", "YTD");
    setLastTransactionDate();

    setSubOrdinatePerformanceTable(token);

    setUCCTable(token);
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
                                '                                                                            <img class="box-shadow-2" src="./app-assets/img/portrait/small/'+img+'.png" alt="avatar">\n' +
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

            },
            timeout: AllConstant.timeout
        });
    });
    $('#btnShowUCC').click(function(){
        $('.ucc_table').html("");
        $('.shopCount').html("0");
        createUCCTable(token);
    });
    $('#btnShowStrategy').click(function () {
        var url = AllConstant.baseURL + "/getStrategyDescription";
        $(".strategy_div").addClass("toggle_div");
        $.ajax({
            type: "GET",
            url: url,
            data: {token:token},
            contentType: "application/json",
            dataType: "text",
            success: function (data) {
                var response = JSON.parse(data);

                if(response.status==="200"){
                    $('#person_id').html(response.empID);
                    $('#person_name').html(response.name);
                    $('#person_team').html(response.team);
                    $('#person_region').html(response.region);
                    setStrategyStatus('productivity_status',response.productivityStatus);
                    setStrategyStatus('ucc_status',response.uccStatus);
                    setStrategyStatus('strategic_contribution_status',response.strategicStatus);

                    $(".strategy_div").removeClass("toggle_div");

                }else{
                    alert("Something went wrong in populating dropdown!");
                }
            },
            error: function (data) {

            },
            timeout: AllConstant.timeout
        });
    });

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
            timeout: AllConstant.timeout
        });
    });

});
function setStrategyStatus(selector, status){
    if(status === 1){
        $('#'+selector).html('Acceptable');
        $('#'+selector).addClass('successStatus');
        $('#'+selector).addClass('btn-outline-success');
    }else if(status===2){
        $('#'+selector).html('Average');
        $('#'+selector).addClass('warningStatus');
        $('#'+selector).addClass('btn-outline-warning');
    }else if(status===3.){
        $('#'+selector).html('Low Performance');
        $('#'+selector).addClass('errorStatus');
        $('#'+selector).addClass('btn-outline-danger');

    }
}


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

        },
        timeout: AllConstant.timeout
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

        },
        timeout: AllConstant.timeout
    });

    $('.btnLogout').click(function(){
        clearCookies();
        self.location="index.html";
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

            $('.SPOProgress').html(html);

        },
        error: function (data) {

        },
        timeout: AllConstant.timeout
    });
}
function createUCCTable(token){
    var url = AllConstant.baseURL + "/getUCCTable";

    var reportingMonth = $('#ucc_month_select').val();
    var token = getCookie('token');
    var positionCode = $('#ucc_partners_select').val();
    var productGroup = $('#ucc_products_select').val();

    $.ajax({
        type: "GET",
        url: url,
        data: { token:token, positionCode:positionCode, productGroup:productGroup, reportingMonth:reportingMonth},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            var html="";
            $('.shopCount').html(response.length);
            if(response.length>0){

                for(var i=0 ; i<response.length ; i++){

                    html += '<tr class="ucc_row">\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].customerNumber+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].customerName+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].sectionCode+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].sectionName+'</td>\n' +
                        '<td class="text-truncate">RS '+response[i].tpValue+'</td>' +

                        '                                                                </tr>';
                }

            }else{
                html+="<tr><p>No UCC found</p></tr>";
            }

            $('.ucc_table').html(html);

        },
        error: function (data) {

        },
        timeout: AllConstant.timeout
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
        timeout: AllConstant.timeout
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
        timeout: AllConstant.timeout
    });
}


function drawBarChart(token, type, title){
    var url = AllConstant.baseURL + "/getCYPBarChartData";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token , type:type },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            new Chart($("#barchart_"+type), {
                type: 'bar',
                data: response,
                options: {
                    title: {
                        display: true,
                        text: title
                    }
                }
            });
        },
        error: function (data) {
        },
        timeout: AllConstant.timeout
    });
}
function setUCCTable(token){
    var url = AllConstant.baseURL + "/UCCUniverseAchievement";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            var html="";
            if(response.length>0){

                for(var i=0 ; i<response.length ; i++){
                    if(response[i].totalCustomers == "0" && response[i].ucc == "0"){
                        continue;
                    }
                    if(response[i].position_code.includes("ASM")){
                        html +='<tr data-positionCode="'+response[i].position_code+'" class="person font-weight-bold">\n';
                    }else{
                        html += '<tr data-positionCode="'+response[i].position_code+'" class="person">\n';
                    }


                    html+='                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].name+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].totalCustomers+'</td>\n' +
                        '                                                                    <td class="text-truncate"> '+response[i].ucc+'</td>\n' +
                        '                                                                    <td class="text-truncate">'+response[i].coverage+'%</td>\n' +

                        '                                                                </tr>';
                }

            }else{
                html+="<tr><p>No UCC found</p></tr>";
            }

            $('.ucc_universe_detail').html(html);

        },
        error: function (data) {
        },
        timeout: AllConstant.timeout
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
        timeout: AllConstant.timeout
    });
}
$(document).on("click", ".warningStatus", function(){
    swal("Average!", "You need to improve the performance", "warning");
});
$(document).on("click", ".successStatus", function(){
    swal("Acceptable!", "Good Work! Keep it up!", "success");
});
$(document).on("click", ".errorStatus", function(){
    swal("Low Performance!", "You are on the danger line. Desperately need improvement!", "error");
});

