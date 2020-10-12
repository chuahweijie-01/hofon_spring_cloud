$(function () {
  //SIDE MENU DROP DOWN
  $('.list-group-tree').on('click', '[data-toggle=collapse]', function () {
    $(this).toggleClass('in')
    $(this).next('.list-group.collapse').collapse('toggle');
    return false;
  })

  //FRONT-END SEARCH
  $('#tableSearch').on('keyup', function () {
    var value = $(this).val().toLowerCase();
    $('#myTable tr').filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#custom-button').on('click', function () {
    $('#upload_file').trigger('click');
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#upload_file').on('change', function () {
    var total_file = document.getElementById('upload_file').files.length;
    $('#preview').empty();
    for (var i = 0; i < total_file; i++) {
      $('#preview').append("<img src='" + URL.createObjectURL(event.target.files[i]) + "' width=\"125\" height=\"125\">");
    }
  });

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#custom-button2').on('click', function () {
    $('#upload_bank_file').trigger('click');
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#upload_bank_file').on('change', function () {
    var total_file = document.getElementById("upload_bank_file").files.length;
    $('#preview_bank').empty();
    for (var i = 0; i < total_file; i++) {
      $('#preview_bank').append("<img src='" + URL.createObjectURL(event.target.files[i]) + "' width=\"125\" height=\"125\">");
    }
  });

  //PASSWORD SIMILIARITY CHECK
  $('#password, #confirmed_password').on('keyup', function () {
    if (!$('#password').val() || !$('#confirmed_password').val()) {
      $('#message').html('Please Enter Your Password Again').css({ 'font-weight': 'Bold', 'color': '#CC0000' });
    } else if ($('#password').val() == $('#confirmed_password').val()) {
      $('#message').html('Password Matched').css({ 'font-weight': 'Bold', 'color': '#007E33' });
    } else {
      $('#message').html('Password Not Matched').css({ 'font-weight': 'Bold', 'color': '#CC0000' });
    }
  });

  //PDF DOWNLOAD FOR ORDER
  $('#download').on('click', function () {
    var fullDate = new Date();
    var twoDigitMonth = fullDate.getMonth() + "";
    if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;
    var twoDigitDate = fullDate.getDate() + "";
    if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
    var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();

    const invoice = $('#invoice')[0];
    var opt = {
      margin: 0.5,
      filename: currentDate + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().from(invoice).set(opt).save();
  });

  //SAME ADDRESS
  $('#same_address').on('click', function () {
    if ($('#same_address').is(':checked')) {
      $('#company_address_another').val($('#company_address').val());
    } else {
      $('#company_address_another').val('');
    }
  })

  //TOOLTIP
  $('[data-toggle="tooltip"]').tooltip();

  //PUBLISH STATUS
  $('.publish_status_group').on('click', function () {

    var publish_status_id = '#' + $(this).attr('id');
    var product_id = $(publish_status_id).data('product_id');
    var category_id = $(publish_status_id).data('category_id');

    if ($(publish_status_id).text() === '未發佈') {
      $.ajax({
        type: "POST",
        url: `/api/product/publish/${product_id}/${category_id}`
      }).done((result) => {
        $(publish_status_id).text('已發佈').removeClass('btn-warning').addClass('btn-success');
        $("#status_message").click();
      }).fail((err) => {
        $("#status_message").show();
        $('#status_message').addClass('alert alert-danger alert-dismissible').html('<a class="close" aria-label="close">&times;</a><strong>該產品屬性已超過可以發佈的產品上限</strong>');
        $("html, body").animate({ scrollTop: 0 }, 500);
      })
    } else {
      $.ajax({
        type: "POST",
        url: `/api/product/unpublish/${product_id}`
      }).done((result) => {
        $(publish_status_id).text('未發佈').removeClass('btn-success').addClass('btn-warning');
        $("#status_message").click();
      }).fail((err) => {
        $("#status_message").show();
        $('#status_message').addClass('alert alert-danger alert-dismissible').html('<a class="close" aria-label="close">&times;</a><strong>暫時無法設定該產品的發佈狀態</strong>');
        $("html, body").animate({ scrollTop: 0 }, 500);
      })

    }
  });

  //USER ACTIVATION
  $('.user_activation').on('click', function () {

    var user_activation_id = '#' + $(this).attr('id');
    var user_id = $(user_activation_id).data('user_id');

    if ($(user_activation_id).text() === '凍結中') {
      $.ajax({
        type: "POST",
        url: `/api/user/${user_id}/reactive`
      }).done((result) => {
        $(user_activation_id).text('激活中').removeClass('btn-primary').addClass('btn-success');
        $("#status_message").click();
      }).fail((err) => {
        $("#status_message").show();
        $('#status_message').addClass('alert alert-danger alert-dismissible').html('<a class="close" aria-label="close">&times;</a><strong>該用戶無法被激活</strong>');
        $("html, body").animate({ scrollTop: 0 }, 500);
      })
    } else {
      $.ajax({
        type: "POST",
        url: `/api/user/${user_id}/deactive`
      }).done((result) => {
        $(user_activation_id).text('凍結中').removeClass('btn-success').addClass('btn-primary');
        $("#status_message").click();
      }).fail((err) => {
        $("#status_message").show();
        $('#status_message').addClass('alert alert-danger alert-dismissible').html('<a class="close" aria-label="close">&times;</a><strong>該用戶無法被凍結</strong>');
        $("html, body").animate({ scrollTop: 0 }, 500);
      })

    }
  });

  $("#status_message").on("click", () => {
    $("#status_message").fadeOut(400);
  });

  $('#increase_limit').on('click', () => {
    $('#reach_minimum').text('');
    $('#result_limit').val(parseInt($('#result_limit').val()) + 1);

  })

  $('#decrease_limit').on('click', () => {
    var value = parseInt($('#result_limit').val()) - 1;
    if (value >= 8) $('#result_limit').val(value);
    else $('#reach_minimum').text('* 已到達產品下限數目');
  })

  $('#change_company_logo').on('click', () => {

    var image_path = $('#custom-text').data('image_path');

    if ($('#change_company_logo').is(':checked')) {
      $('#custom-button').removeAttr("disabled");
      $('#custom-text').text('圖檔尚未選擇');
    } else {
      $('#custom-button').prop("disabled", true);
      $('#custom-text').text(image_path);
    }
  })

});

