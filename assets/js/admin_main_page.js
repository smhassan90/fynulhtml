$(document).ready(function(){

    $('.menu-item').click(function(){
        $(".menu-item").parent().removeClass("active");
        $(this).parent().addClass("active");
    });

    $('#channel_master_menu').click(function(){
        show_hide_section_tab("#channel_master");
    });
    $('#department_master_menu').click(function(){
        show_hide_section_tab("#department_master");
    });


});

function show_hide_section_tab($class_name) {
    $(".main-content").removeClass("active_block");
    $(".main-content").addClass("hide_block");

    $($class_name).removeClass("hide_block");
    $($class_name).addClass("active_block");
}
