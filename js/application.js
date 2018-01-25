var myApp = new Framework7({
    modalTitle: "App Name",
    swipePanel: "left",
    swipePanelActiveArea:15,
    swipeBack:false,
    cache: false,
    material: true,
});

var $$ = Dom7;

var mainView = myApp.addView(".view-main", {
	
});


/* Exit App */
$$(document).on('click','.exit-app', function(){
    myApp.Confirm("Anda yakin ingin keluar alikasi?", function(){
        navigator.app.exitApp();
    }, "Keluar Aplikasi");
});


$$('.sample-dialog').on('click', function(){
    var type = $$(this).data('dialog');
    myApp.Alert('Text content dialog', type, 'Dialog title');
});

$$('.sample-confirm1').on('click', function(){
    myApp.Confirm('Anda Yakin?', 'Tanya');
});

$$('.sample-confirm2').on('click', function(){
    myApp.Confirm('Anda Yakin?', function(){
        myApp.alert('Anda melakukan klik YES', 'Laporan')
    }, 'Tanya');
});
$$('.sample-b64encode').on('click', function(){
    myApp.alert('<code>Base64.encode(\'string\')</code>', 'Base64 Encode');
});
$$('.sample-b64decode').on('click', function(){
    myApp.alert('<code>Base64.encode(\''+Base64.encode('string')+'\')</code>', 'Base64 Decode');
});


$$('.sample-numberformat').on('click', function(){
    myApp.alert('<code>numberFormat(14225)</code>', 'Format Angka');
});

$$('.sample-titlecase').on('click', function(){
    myApp.alert('<code>toTitleCase(\'ini judul yang mau diformat\')</code>', 'Title Case');
});

$$('.sample-tanggal1').on('click', function(){
    myApp.alert('<code>tanggal(\'j F Y\')</code>', 'Tanggal Hari Ini');
});
$$('.sample-tanggal2').on('click', function(){
    myApp.alert('<code>tanggal(\'j F Y\', \'2017-12-01\')</code>', 'Format Tanggal 1');
});
$$('.sample-tanggal3').on('click', function(){
    myApp.alert('<code>tanggal(\'j F Y\', \'2017-12-01 14:22:57\')</code>', 'Format Tanggal 2');
});
