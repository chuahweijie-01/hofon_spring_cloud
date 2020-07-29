$(function () {
  $(".list-group-tree").on('click', "[data-toggle=collapse]", function () {
    $(this).toggleClass('in')
    $(this).next(".list-group.collapse").collapse('toggle');
    return false;
  })

  $("#tableSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#myTable tr").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  $("#custom-button").on('click', function () {
    $("#real-file").trigger("click");
  })

  $("#real-file").on("change", function () {
    if ($("#real-file").val()) {
      $("#custom-text").text($("#real-file").val().match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1]);
    } else {
      $("#custom-text").text("圖檔尚未選擇");
    }
  });

  $('#password, #confirmed_password').on('keyup', function () {
    if (!$('#password').val() || !$('#confirmed_password').val()) {
      $('#message').html('請輸入密碼').css('color', 'red');
    } else if ($('#password').val() == $('#confirmed_password').val()) {
      $('#message').html('密碼一致').css('color', 'green');
    } else {
      $('#message').html('密碼不一致').css('color', 'red');
    }
  });

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

  $('#deleteCompany').on('click', function (e) {
    e.preventDefault();
    var data = {};
    data.title = "title";
    data.message = "message";

    $.ajax({
      type: 'DELETE',
      data: JSON.stringify(data),
      contentType: 'application/json',
      url: '/api/company/' + data,
      success: function (data) {
        console.log(data)
      }
    })
  });
});

