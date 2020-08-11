$(function () {
  //SIDE MENU DROP DOWN
  $(".list-group-tree").on('click', "[data-toggle=collapse]", function () {
    $(this).toggleClass('in')
    $(this).next(".list-group.collapse").collapse('toggle');
    return false;
  })

  //FRONT-END SEARCH
  $("#tableSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  //CUSTOMIZE FILE HANDLE BUTTON
  $("#custom-button").on('click', function () {
    $("#real-file").trigger("click");
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $("#real-file").on("change", function () {
    if ($("#real-file").val()) {
      $("#custom-text").text($("#real-file").val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    } else {
      $("#custom-text").text("圖檔尚未選擇");
    }
  });

  //CUSTOMIZE FILE HANDLE BUTTON
  $("#custom-button2").on('click', function () {
    $("#real-file2").trigger("click");
  })

  //CUSTOMIZE FILE HANDLE BUTTON
  $("#real-file2").on("change", function () {
    if ($("#real-file2").val()) {
      $("#custom-text2").text($("#real-file2").val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    } else {
      $("#custom-text2").text("圖檔尚未選擇");
    }
  });

  //PASSWORD SIMILIARITY CHECK
  $('#password, #confirmed_password').on('keyup', function () {
    if (!$('#password').val() || !$('#confirmed_password').val()) {
      $('#message').html('請輸入密碼').css('color', 'red');
    } else if ($('#password').val() == $('#confirmed_password').val()) {
      $('#message').html('密碼一致').css('color', 'green');
    } else {
      $('#message').html('密碼不一致').css('color', 'red');
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
});

