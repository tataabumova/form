$(function() {
    // Prototype for location selectmenu
    $.widget( "custom.locationselectmenu", $.ui.selectmenu, {
        _renderItem: function( ul, item ) {
            var options;
            if(item.element.attr( "data-html" )){
                options = { html: item.element.attr( "data-html" ), style: "padding-left: 43px;"}
            }else{
                options = { html: item.label, style: "padding-left: 54px;"}
            }
            var li = $( "<li>", options);

            return li.appendTo( ul );
        }
    });
    // Variables
    var datepicker_elem = $("#datepicker");
    var date_calendar_elem = $("#date_calendar");
    var age_slider_range = $( "#age-slider-range" );
    var exp_slider_range = $( "#exp-slider-range" );
    var language_link = $('#add_language_link');
    var language_popup = $("#language_popup");
	var curr_date = new Date();

    $( "#looking_for" ).selectmenu({
        open: function( event, ui ) {
            $('#looking_for-menu').mouseover();
        }
    });
    $( "#location" ).locationselectmenu({
        open: function( event, ui ) {
            $('#location-menu').mouseover();
        },
        create: function( event, ui ) {
            $("#location-button>.ui-selectmenu-text").html('<i class="flaticon-mappointer5"></i><span class="country">Russia</span><span class="city">Moscow</span><span class="okrug">SVO</span>');
        },
        select: function( event, ui ) {
            if(ui.item.element.data('html')){
                $("#location-button>.ui-selectmenu-text").html(ui.item.element.data('html'));
            }else{
                $("#location-button>.ui-selectmenu-text").html(ui.item.label);
            }
        }
    });
    $( "#type" ).selectmenu({
        open: function( event, ui ) {
            $('#type-menu').mouseover();
        }
    });
    datepicker_elem.datepicker({
    	dateFormat: 'dd.mm.yy',
    	"onSelect": function (dateText, inst) {
            date_calendar_elem.html(dateText);
    	},
        prevText: "",
        nextText: ""
    });

    // Set default
    datepicker_elem.datepicker("setDate", curr_date);
    date_calendar_elem.html(('0' + curr_date.getDate()).slice(-2) + "." + ('0' + (curr_date.getMonth() + 1)).slice(-2) + "." + curr_date.getFullYear())
    $( "#sex" ).selectmenu();
    $( "#citizenship" ).selectmenu();
    $( "#visas" ).selectmenu();

    // Age slider
    age_slider_range.slider({
        range: true,
        min: 21,
        max: 30,
        values: [ 21, 25 ],
        slide: function( event, ui ) {
            first_slider.attr('data-content', ui.values[0]);
            last_slider.attr('data-content', ui.values[1]);
        }
    });
    var first_slider = age_slider_range.find('.ui-slider-handle:first-of-type');
    var last_slider = age_slider_range.find('.ui-slider-handle:last-of-type');
    first_slider.attr('data-content', age_slider_range.slider("values", 0));
    last_slider.attr('data-content', age_slider_range.slider("values", 1));

    // Experience slider
    exp_slider_range.slider({
        range: true,
        min: 0,
        max: 6,
        values: [ 0, 3 ],
        slide: function( event, ui ) {
            exp_first_slider.attr('data-content', ui.values[0]);
            exp_last_slider.attr('data-content', ui.values[1]);
        }
    });
    var exp_first_slider = exp_slider_range.find('.ui-slider-handle:first-of-type');
    var exp_last_slider = exp_slider_range.find('.ui-slider-handle:last-of-type');
    exp_first_slider.attr('data-content', exp_slider_range.slider("values", 0));
    exp_last_slider.attr('data-content', exp_slider_range.slider("values", 1));

    date_calendar_elem.click(function(){
        $("input[type='text']").click();
    });

    var dialog = language_popup.dialog({
        dialogClass: 'language_popup_dialog',
        autoOpen: false,
        height: 185,
        width: 220,
        modal: true,
        closeOnEscape: true,
        draggable: false,
        position: { my: "left top", at: "left bottom+15", of: language_link },
        resizable: false
    });

    language_link.click(function(event){
        event.preventDefault();

        dialog.dialog("open");
        $('#language_scrollbar').mouseover();

        // Choose all checked languages
        var value = "", elem;
        language_popup.find("input[type='checkbox']").prop('checked', '');
        $("#language_group").find('div.language_elem').each(function(){
            value = $(this).data('value');
            if(value){
                elem = language_popup.find('input[value="' + value + '"]');
                if(elem.length){
                    elem.prop('checked', 'checked');
                }
            }
        });
    });

    language_popup.find("input[type='checkbox']").on('click', function(){
        if($(this).is(':checked')){
            $('<div class="language_elem" data-value="' + $(this).val() + '">' + $(this).val() + '<span class="remove">x</span></div>').insertBefore(language_link);
        }else{
            var elem = $("#language_group").find('div.language_elem[data-value="' + $(this).val() + '"]');
            if(elem.length){
                elem.remove();
            }
        }
    });

    language_popup.find("input[name='search']").keyup(function(event){
        event.preventDefault();
        var curr_value = $(this).val();
        if(curr_value){
            var curr_checkbox_value, checkbox_elem;
            language_popup.find("input[type='checkbox']+label").each(function(){
                checkbox_elem = language_popup.find("#" + $(this).prop('for'));
                if(checkbox_elem.length) {
                    curr_checkbox_value = checkbox_elem.val().toLowerCase();
                    if (curr_checkbox_value.indexOf(curr_value.toLowerCase()) > -1) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                    $('#language_scrollbar').mouseover();
                }
            });
        }else{
            language_popup.find("input[type='checkbox']+label").show();
        }
    });

    $(document).on('click', 'div.ui-widget-overlay.ui-front', function(e){
        dialog.dialog("close");
        language_popup.find("input[name='search']").val("");
        language_popup.find("input[name='search']").keyup();
    });

    $('#language_scrollbar').slimScroll({
        height: '120px',
        railVisible: true,
        alwaysVisible: true,
        color: '#ffcc00',
        railColor: 'rgba(34,38,69,0.1)',
        railOpacity: 1,
        opacity: 1,
        size: '6px',
        railSize: '4px',
        distance: '0px'
    });

    $('#looking_for-menu').slimScroll({
        height: '145px',
        railVisible: true,
        alwaysVisible: true,
        color: '#ffcc00',
        railColor: 'rgba(34,38,69,0.1)',
        railOpacity: 1,
        opacity: 1,
        size: '6px',
        railSize: '4px',
        distance: '7px',
        railDistance: '8px'
    });

    // Joke :)
    var counter;
    $('.search').data('counter', 0).click(function() {
        counter = $(this).data('counter');
        $(this).data('counter', counter + 1);

    });

    $(".search").click(function() {
        if (counter == 2) {
            $('.search').html("Хватит кликать");
            $(".search").addClass("click_search");
        }
    })

    $(document).on("click", '.remove', function(){
        $(this).closest('div').remove();
    });

});
