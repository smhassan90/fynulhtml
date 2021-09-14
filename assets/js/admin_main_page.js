const AllConstant = {
    baseURL: "http://localhost:8080"
};
var baseChannelResponse;
$(document).ready(function(){

    $('.menu-item').click(function(){
        $(".menu-item").parent().removeClass("active");
        $(this).parent().addClass("active");
    });

    $('#channel_master_menu').click(function(){
        getData("Channel","ID", "#channelTable");
        show_hide_section_tab("#channel_master");
    });
    $('#department_master_menu').click(function(){
        show_hide_section_tab("#department_master");
    });

    $('#btnAddChannel').click(function(){
        addChannel();
    });

    $(document).on("click", ".btnChannelDel", function(){
        var id = $(this).attr("data-id");
        var tablename = $(this).attr("data-tablename");
        var primarykey = $(this).attr("data-primarykey");

        //delete
        var url= AllConstant.baseURL + "/deleteAdminData";
        $.ajax({
            type: "GET",
            url: url,
            contentType: "application/json",
            data:{tablename:tablename, id:id, primarykey:primarykey},
            dataType: "text",
            success: function (data) {
                var deleteResponse = JSON.parse(data);
                if(deleteResponse.status==="200"){
                    generateTable()
                }else{
                    alert("Something went wrong while deleting!");
                }
            },
            error: function (data) {
                alert("Something went wrong while deleting!");
            }
        });
    });
});

function addChannel(){
    var url= AllConstant.baseURL + "/addChannel";
    var id = $('#inpChannelID').val();
    var name = $('#inpChannelName').val();
    $.ajax({
        type: "GET",
        url: url,
        data:{id:id, name:name},
        contentType: "application/json",
        dataType: "text",
        success: function (data) {
            var resp = JSON.parse(data);
            if(resp.status==="200"){
                refreshChannels();
                clearForm("Channel");
            }

        },
        error: function (data) {
            return "failed";
        }
    });
}

function refreshChannels(){
    getData();
}



function generateTable(tableData, primarykeyColumn, tablename){
    var tableHTML = "";
    if(tableData === undefined || tableData===null){
        tableHTML = "<p>No data found</p>";
    }else{
        var tableHeader = tableData;
        var id = "";
        if(tableData.length>0){
            tableHTML = "<table class=\"table table-responsive-md text-center\">\n" +
                "                                        <thead>\n" +
                "                                        <tr>\n";
                $.each(tableHeader, function(key, value){
                    $.each(value, function(key, value){
                        tableHTML+= "<th>"+key+"</th>";
                    });
                    return false;
                });

            tableHTML+="                                        </tr>\n" +
                "                                        </thead>\n" +
                "                                        <tbody>\n";

            $.each(tableData, function(key, value){
                tableHTML +=  "<tr>\n";
                id = "";
                $.each(value, function(key, value){
                    if(id!=="" && key===primarykeyColumn){
                        id=value;
                    }
                    tableHTML+= "<td>"+value+"</td>";
                });
                tableHTML +=  "                                          <td>\n" +
                "                                            <a data-tablename="+tablename+" data-id="+id+" data-primarykeycolumn = "+primarykeyColumn+" class=\"btnChannelDel danger p-0\" data-original-title=\"\" title=\"\">\n" +
                "                                              <i class=\" fa fa-trash-o font-medium-3 mr-2\"></i>\n" +
                "                                            </a>\n" +
                "                                          </td>\n";
                tableHTML +=  "</tr>\n";
            });


            tableHTML+="                          </tbody>\n" +
                "                                      </table>";
        }else{
            tableHTML = "<p>No data found</p>";
        }
    }
    return tableHTML;
}

function getData(tableName, primarykey, selector ){
    var url= AllConstant.baseURL + "/getAdminData";
    $.ajax({
        type: "GET",
        url: url,
        contentType: "application/json",
        data:{tableName:tableName},
        dataType: "text",
        success: function (data) {
            adminData = JSON.parse(data);
            var generatedHTML = generateTable(adminData,primarykey,tableName);
            $(selector).html(generatedHTML);
        },
        error: function (data) {
            return "failed";
        }
    });
}

function show_hide_section_tab($class_name) {
    $(".main-content").removeClass("active_block");
    $(".main-content").addClass("hide_block");

    $($class_name).removeClass("hide_block");
    $($class_name).addClass("active_block");
}
