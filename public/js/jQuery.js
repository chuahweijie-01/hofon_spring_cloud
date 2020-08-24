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
    $('#real-file').trigger('click');
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#real-file').on('change', function () {
    if ($('#real-file').val()) {
      $('#custom-text').text($('#real-file').val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    } else {
      $('#custom-text').text('圖檔尚未選擇');
    }
  });

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#custom-button2').on('click', function () {
    $('#real-file2').trigger('click');
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $('#real-file2').on('change', function () {
    if ($('#real-file2').val()) {
      $('#custom-text2').text($('#real-file2').val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    } else {
      $('#custom-text2').text('圖檔尚未選擇');
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
    const invoice = $('#invoice')[0];
    var opt = {
      margin: 0.5,
      filename: 'AUJX458.pdf',
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
  $('.publish_status_group').mousedown('click', function () {

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
        $("html, body").animate({scrollTop: 0}, 500);
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
        $("html, body").animate({scrollTop: 0}, 500);
      })

    }
  });

  $("#status_message").on("click", () => {
    $("#status_message").fadeOut(400);
  });

  $('#order_status').on('click', () => {
    $('#order_status').text('交易已完成').removeClass('btn-warning').addClass('btn-success');
  })

  $('#increase_limit').on('click', () => {
    $('#reach_minimum').text('');
    $('#result_limit').val(parseInt($('#result_limit').val()) + 1);
  })

  $('#decrease_limit').on('click', () => {
    var value = parseInt($('#result_limit').val()) - 1;
    if (value >= 8) $('#result_limit').val(value);
    else $('#reach_minimum').text('* 已到達產品下限數目');
  })

});

