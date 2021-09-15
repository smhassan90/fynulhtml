const AllConstant = {
    baseURL: "http://localhost:8080"
};

$(document).ready(function(){

    $('.menu-item').click(function(){
        $(".menu-item").parent().removeClass("active");
        $(this).parent().addClass("active");

        //In menu item data-tablename should be there. Table Name from Class name
        var tablename = $(this).attr("data-tablename");
        //Primary Key column name should be in data-primarykeycolumn in menu item
        var primarykey = $(this).attr("data-primarykeycolumn");

        //This is the id of section form.
        var selectorMainForm = getFormMainDivSelectorFromTableName(tablename);

        //Request to get Data for below table. In response it will populate table.
        getData(tablename,primarykey);

        show_hide_section_tab(selectorMainForm);
    });



    /*
    btnDel class should be assign to delete button
     */
    $(document).on("click", ".btnDel", function(){
        var id = $(this).attr("data-id");
        var tablename = $(this).attr("data-tablename");
        var primarykey = $(this).attr("data-primarykeycolumn");
        var selectorId = "#";
        selectorId+=$(this).attr("data-selectorid");

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
                    getData(tablename,primarykey);
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



/*
It will generate HTML Table from data. It will dynamically create columns and rows according to json.
 */
function generateTable(tableData, primarykeyColumn, tablename){
    var tableHTML = "";
    var selectorid = getSelectorFromTableName(tablename);

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
                    if(id==="" && key===primarykeyColumn){
                        id=value;
                    }
                    tableHTML+= "<td>"+value+"</td>";
                });
                tableHTML +=  "                                          <td>\n" +
                    '                                            <a data-selectorid="'+selectorid+'" data-tablename="'+tablename+'" data-id="'+id+'" data-primarykeycolumn = "'+primarykeyColumn+'" class=\"btnDel danger p-0\" data-original-title=\"\" title=\"\">\n' +
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

/*
selector to show data below form. HTML table
 */
function getSelectorFromTableName(tablename){
    var selectorid = "#";
    selectorid +=tablename.toLowerCase();
    selectorid +="_div_content";
    return selectorid;
}

/*
Selector of main div which is hidden initially. It contains form and below data HTML table
 */
function getFormMainDivSelectorFromTableName(tablename){
    var selectorid = "#";
    selectorid +=tablename.toLowerCase();
    selectorid +="_main_form";
    return selectorid;
}

/*
This will call an API and get the data.
 */
function getData(tableName, primarykey ){
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

            var selector = getSelectorFromTableName(tableName);

            $(selector).html(generatedHTML);
        },
        error: function (data) {
            return "failed";
        }
    });
}

/*
Selected blue mark on side bar is due to this function.
 */
function show_hide_section_tab($class_name) {
    $(".main-content").removeClass("active_block");
    $(".main-content").addClass("hide_block");

    $($class_name).removeClass("hide_block");
    $($class_name).addClass("active_block");
}
