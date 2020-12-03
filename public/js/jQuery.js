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
            $('#message').html('請輸入密碼').css({ 'font-weight': 'Bold', 'color': '#CC0000' });
        } else if ($('#password').val() == $('#confirmed_password').val()) {
            $('#message').html('密碼符合').css({ 'font-weight': 'Bold', 'color': '#007E33' });
        } else {
            $('#message').html('密碼不符合').css({ 'font-weight': 'Bold', 'color': '#CC0000' });
        }
    });

    //PDF DOWNLOAD FOR ORDER
    $('#download').on('click', function () {
        var fullDate = new Date();
        var twoDigitMonth = fullDate.getMonth() + 1 + "";
        if (twoDigitMonth.length == 1) twoDigitMonth = "0" + twoDigitMonth;
        var twoDigitDate = fullDate.getDate() + "";
        if (twoDigitDate.length == 1) twoDigitDate = "0" + twoDigitDate;
        var currentDate = twoDigitDate + "/" + twoDigitMonth + "/" + fullDate.getFullYear();

        const invoice = $('#invoice')[0];
        var opt = {
            margin: 0.5,
            filename: currentDate + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 6 },
            pagebreak: { mode: 'avoid-all' },
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

    $('#revenueDateTimePicker').datetimepicker({
        startView: 4,
        minView: 3,
        maxView: 4,
        format: 'mm/yyyy',
        language: 'zh-TW'
    }).on('change', () => {
        var dateInfo = $('#revenueDate').val().split(/\//g);
        var month = dateInfo[0];
        var year = dateInfo[1];
        $.ajax({
            type: "GET",
            url: `/api/dashboard/revenuestatistic/month/?year=${year}&month=${month}`
        }).done((result) => {
            var randomColor = [];

            for (var i in "<%= revenueMonth%>") {
                randomColor.push(rgbColorGenerator());
            }

            function rgbColorGenerator() {
                var r = Math.floor(Math.random() * 255);
                var g = Math.floor(Math.random() * 255);
                var b = Math.floor(Math.random() * 255);
                return "rgb(" + r + "," + g + "," + b + ")";
            }

            function getLabelArray() {
                var analysisString = result.revenueMonth + '';
                return analysisString.split(',')
            }
            function getDataArray() {
                var scoreString = result.revenueMonthlyReport + '';
                return scoreString.split(',')
            }

            $('#revenueMonthlyReport').remove();

            var revenueCanvasParent = document.getElementById('revenueCanvasParent');
            revenueCanvasParent.innerHTML = '&nbsp;';
            $('#revenueCanvasParent').append('<canvas id="revenueMonthlyReport"></canvas>');

            var barChart = document.getElementById('revenueMonthlyReport').getContext('2d');
            var barChart = new Chart(barChart, {
                type: 'bar',
                data: {
                    labels: getLabelArray(),
                    datasets: [
                        {
                            label: "收入",
                            backgroundColor: randomColor,
                            data: getDataArray(),
                        }
                    ]
                },
                options: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: new Date().getFullYear() + " 年度 每月收入 ( 臺幣, TWD )"
                    }
                }
            });
        })
    })

    $('#orderDateTimePicker').datetimepicker({
        startView: 4,
        minView: 3,
        maxView: 4,
        format: 'mm/yyyy',
        language: 'zh-TW'
    }).on('change', () => {
        var dateInfo = $('#orderDate').val().split(/\//g);
        var month = dateInfo[0];
        var year = dateInfo[1];
        $.ajax({
            type: "GET",
            url: `/api/dashboard/orderstatistic/?year=${year}&month=${month}`
        }).done((result) => {

            function getLabelArray() {
                var analysisString = result.orderDay + '';
                return analysisString.split(',')
            }
            function getDataArray() {
                var scoreString = result.orderDailyReport + '';
                return scoreString.split(',')
            }

            $('#orderMonthlyReport').remove();

            var orderCanvasParent = document.getElementById('orderCanvasParent');
            orderCanvasParent.innerHTML = '&nbsp;';
            $('#orderCanvasParent').append('<canvas id="orderMonthlyReport"></canvas>');

            var lineChart = document.getElementById('orderMonthlyReport').getContext('2d');
            var lineChart = new Chart(lineChart, {
                type: 'line',
                data: {
                    labels: getLabelArray(),
                    datasets: [{
                        borderColor: "#3e95cd",
                        pointBackgroundColor: "#3e95cd",
                        borderWidth: 2,
                        data: getDataArray(),
                        fill: true,
                        label: " 訂單總數"

                    }]
                },
                options: {
                    scales: {
                        xAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: '日期'
                            }
                        }],
                        yAxes: [{
                            display: true,
                            scaleLabel: {
                                display: true,
                                labelString: '總數'
                            },
                            ticks: {
                                beginAtZero: true,
                                stepSize: 1
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });
        })
    })

});

