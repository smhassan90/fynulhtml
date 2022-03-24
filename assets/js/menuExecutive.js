$(document).ready(function(){

    /*
    drawBarChart(token, " ", "Team Wise Net Sales Value (MTD)");
    drawBarChart(token, " ", "Team Wise Net Sales Value (YTD)");
    drawBarChart(token, " ", "GSM Net Sales Value");
    drawLineChart(token, " ", "Sales Trend");
    */


    var token = getCookie('token');
    if(token===null){
        self.location="index.html";
    }
    loginLog(token);
    $("#dashboard_menu").trigger('click');

    setBio(token);

    setLastTransactionDate();

    setSubOrdinatePerformanceTable(token);

    $("#dashboard_menu").trigger('click');

    
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

    $(document).on("click", ".person", function(){
        var positioncode = $(this).attr("data-positioncode");
        var url = AllConstant.baseURL + "/getRegionProgress";

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
                            '                                                                    <td class="text-truncate"><i class="fa fa-dot-circle-o font-medium-1 mr-1"></i> '+response[i].region+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].regionSupervisor+'</td>\n' +
                            '                                                                    <td class="text-truncate"> '+response[i].percent+'</td>\n' +
                            '                                                                    </tr>';
                    }

                }else{
                    html+="<tr><p>No Sale found</p></tr>";
                }
                $('.modal').modal('show');
                $('.ProgressRegionWise').html(html);
                $('#modalHeading').html(name);
            },
            error: function (data) {

            },
            timeout: 10000
        });
    });

    

}

function drawBarChart(token, type, title){
    var url = AllConstant.baseURL + "/getGSMNetSales";
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


//CHARTS

function drawBarChart(token, type, title){
    //var url = AllConstant.baseURL + "/getBarChartData";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token , type:type },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            new Chart($("#chart_"+type), {
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

function drawLineChart(token, type, title){
    //var url = AllConstant.baseURL + "/getlineChartData";
    $.ajax({
        type: "GET",
        url: url,
        data: {token:token , type:type },
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var response = JSON.parse(data);
            new Chart($("#linechart_"+type), {
                type: 'line',
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

var xValues = [100,200,300,400,500,600,700,800,900,1000];


//multiple line chart
new Chart("chart_TWNSValYTDAch", {
  type: "line",
  data: {
    labels: xValues,
    datasets: [{
        label: "FMCG01",
      data: [860,1140,1060,1060,1070,1110,1330,2210,7830,2478],
      borderColor: "red",
      fill: false
    },{
        label: "FMCG02",
      data: [1600,1700,1700,1900,2000,2700,4000,5000,6000,7000],
      borderColor: "green",
      fill: false
    },{
        label: "Pharma",
      data: [300,700,2000,5000,6000,4000,2000,1000,200,100],
      borderColor: "blue",
      fill: false
    },
    {
        label: "SF",
      data: [400,300,3000,7000,4000,2000,700,4000,3500,7500],
      borderColor: "orange",
      fill: false
    }
]
  },
  options: {
    legend: {display: true}
  }
});