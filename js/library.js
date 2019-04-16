function checkType(object){
    var stringConstructor = "test".constructor;
    var arrayConstructor = [].constructor;
    var objectConstructor = {}.constructor;

    if (object === null) {
        return "null";
    }
    else if (object === undefined) {
        return "undefined";
    }
    else if (object.constructor === stringConstructor) {
        return "String";
    }
    else if (object.constructor === arrayConstructor) {
        return "Array";
    }
    else if (object.constructor === objectConstructor) {
        return "Object";
    }
    else {
        return "Unknown";
    }
}



function toTitleCase(str) {
    var i, j, str, lowers, uppers;
    str = str.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    lowers = ['A', 'An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With', 'Dan'];
    for (i = 0, j = lowers.length; i < j; i++)
        str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'),
            function (txt) {
                return txt.toLowerCase();
            });
    uppers = ['Id', 'Tv', 'Pc'];
    for (i = 0, j = uppers.length; i < j; i++)
        str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'),
            uppers[i].toUpperCase());

    return str;
}

function numberFormat(n, x) {
    if (x) {
        n = n.toFixed(x);
    }
    n = n.toString().replace('.', ',');
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(n))
        n = n.replace(pattern, "$1.$2");
    return n;
}

function tanggal(format, dates) {
    var date
    if (dates) {
        if (dates.indexOf(' ') != -1) {
            var tmp = dates.split(' ');
            var ymd = tmp[0].split('-');
            var his = tmp[1].split(':');
            his[2] = his[2] ? his[2] : 0;
            date = new Date(ymd[0], ymd[1]-1, ymd[2], his[0], his[1], his[2]);
        } else {
            var ymd = dates.split('-');
            date = new Date(ymd[0], ymd[1]-1, ymd[2], new Date().getHours(), new Date().getMinutes(), new Date().getSeconds());
        }
    } else {
        date = new Date();
    }
    var dayLong = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    var dayShort = ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    var monthLong = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    var monthShort = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Des"];
    // Year
    var Y = date.getFullYear();
    var y = Y >= 2000 ? (Y - 2000) : (Y - 1900);
    // Month
    var n = date.getMonth();
    var m = n < 10 ? '0' + (n + 1) : (n + 1);
    var M = monthShort[n];
    var F = monthLong[n];
    n = n + 1;
    // Date
    var j = date.getDate();
    var d = j < 10 ? '0' + j : j;
    var t = new Date(Y, n, 0).getDate();
    // Day
    var w = date.getDay();
    var D = dayShort[w];
    var l = dayLong[w];
    // Hour Minute Second
    var H = date.getHours();
    H = H < 10 ? '0' + H : H;
    var h = H >= 24 ? H - 12 : H;
    h = h < 10 ? '0' + h : h;
    var i = date.getMinutes();
    i = i < 10 ? '0' + i : i;
    var s = date.getSeconds();
    s = s < 10 ? '0' + s : s;

    format = format.replace('Y', '[Y]');
    format = format.replace('y', '[y]');
    format = format.replace('n', '[n]');
    format = format.replace('m', '[m]');
    format = format.replace('M', '[M]');
    format = format.replace('F', '[F]');
    format = format.replace('j', '[j]');
    format = format.replace('d', '[d]');
    format = format.replace('t', '[t]');
    format = format.replace('w', '[w]');
    format = format.replace('D', '[D]');
    format = format.replace('l', '[l]');
    format = format.replace('H', '[H]');
    format = format.replace('h', '[h]');
    format = format.replace('i', '[i]');
    format = format.replace('s', '[s]');

    format = format.replace('[Y]', Y);
    format = format.replace('[y]', y);
    format = format.replace('[n]', n);
    format = format.replace('[m]', m);
    format = format.replace('[M]', M);
    format = format.replace('[F]', F);
    format = format.replace('[j]', j);
    format = format.replace('[d]', d);
    format = format.replace('[t]', t);
    format = format.replace('[w]', w);
    format = format.replace('[D]', D);
    format = format.replace('[l]', l);
    format = format.replace('[H]', H);
    format = format.replace('[h]', h);
    format = format.replace('[i]', i);
    format = format.replace('[s]', s);
    return format
}



/* Time Ago like Facebook */
(function timeAgo(selector) {
    var templates = {
        prefix: "",
        suffix: " yang lalu",
        second: "baru saja",
        seconds: "%d detik",
        minute: "%d menit",
        minutes: "%d menit",
        hour: "%d jam",
        hours: "%d jam",
        day: "kemarin",
        days: "%d hari",
        month: "%d bulan",
        months: "%d bulan",
        year: "%d tahun",
        years: "%d tahun"
    };
    var template = function (t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var timer = function (time) {
        if (!time)
            return;
        time = time.replace(/\.\d+/, ""); // remove milliseconds
        time = time.replace(/-/, "/").replace(/-/, "/");
        time = time.replace(/T/, " ").replace(/Z/, " UTC");
        time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
        time = new Date(time * 1000 || time);

        var now = new Date();
        var seconds = ((now.getTime() - time) * .001) >> 0;
        var minutes = seconds / 60;
        var hours = minutes / 60;
        var days = hours / 24;
        var years = days / 365;

        var ret = templates.prefix + (
            //seconds < 30 && template('second', 1) ||
            seconds < 45 && template('second', seconds) ||
            seconds < 90 && template('minute', 1) ||
            minutes < 45 && template('minutes', minutes) ||
            minutes < 90 && template('hour', 1) ||
            hours < 24 && template('hours', hours) ||
            hours < 42 && template('day', 1) ||
            days < 30 && template('days', days) ||
            days < 45 && template('month', 1) ||
            days < 365 && template('months', days / 30) ||
            years < 1.5 && template('year', 1) ||
            template('years', years)
        ) + templates.suffix;
        if (ret.substring(0, 7) == 'kemarin' || ret.substring(0, 9) == 'baru saja')
            return ret.replace(' yang lalu', '');
        else
            return ret;
    };

    var elements = document.getElementsByClassName('time');
    for (var i in elements) {
        var $this = elements[i];
        if (typeof $this === 'object') {
            $this.innerHTML = timer($this.getAttribute('title') || $this.getAttribute('data-time'));
        }
    }
    // update time every second
    setTimeout(timeAgo, 1000);
})();



/* Dialog with Icon */
Framework7.prototype.plugins.Alert = function (app) {
    'use strict';
    var $$ = Dom7,showAlert;

    app.Alert = function (txt, type, title, callback) {
        if(type=="failed" || type=="warning" || type=="success" || type=="notice"){
            if(title!==undefined){
                app.alert('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>', title, calback);
            }else{
                app.alert('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>');
            }
        }else{
            return;
        }
    };
}


/* Confirm */
Framework7.prototype.plugins.Confirm = function (app) {
    'use strict';
    var $$ = Dom7,Confirm;

    app.Confirm = function (txt, callback, title) {
        //app.confirm('<div class="status"><div class="icon icon-question"></div><div class="txt">'+txt+'</div></div>', title||'Confirm', callback);
        app.modal({
            title: title||'Confirm',
            text: '<div class="status"><div class="icon icon-question"></div><div class="txt">'+txt+'</div></div>',
            buttons: [
                {
                    text: 'Yes',
                    bold: true,
                    onClick: callback
                },
                {
                    text: 'No'
                }
            ]
        })
    };
}

/* Toast */
Framework7.prototype.plugins.toast = function (app) {
    'use strict';
    var $$ = Dom7,toast;

    app.toast = function (txt, pos, fade) {
        var sPos = 'bottom',iFade=5000;
        $$('.toast').remove();
        if(pos=='top' || pos=='bottom' || pos=='center'){
			if(fade>0){
				$$('.pages').append('<div class="toast '+pos+'"><div class="toast-inner">'+txt+'</div></div>');
				setInterval(function(){
					$$('.toast').remove();
				},fade*1000);
			}else{
				$$('.pages').append('<div class="toast '+pos+'"><div class="toast-inner">'+txt+'</div></div>');
				setInterval(function () {
					$$('.toast').remove();
				}, iFade * 1000);
			}
		}else if(pos>0){
			iFade = pos * 1000;
			$$('.pages').append('<div class="toast bottom"><div class="toast-inner">' + txt + '</div></div>');
			setTimeout(function () {
				$$('.toast').remove();
			}, iFade);
		}else{
			$$('.pages').append('<div class="toast bottom"><div class="toast-inner">'+txt+'</div></div>');
			setInterval(function () {
				$$('.toast').remove();
			}, iFade);
        }
    };
}



// Base64
var Base64 = { _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=", encode: function (e) { var t = ""; var n, r, i, s, o, u, a; var f = 0; e = Base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64 } else if (isNaN(i)) { a = 64 } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a) } return t }, decode: function (e) { var t = ""; var n, r, i; var s, o, u, a; var f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ""); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u != 64) { t = t + String.fromCharCode(r) } if (a != 64) { t = t + String.fromCharCode(i) } } t = Base64._utf8_decode(t); return t }, _utf8_encode: function (e) { e = e.replace(/rn/g, "n"); var t = ""; for (var n = 0; n < e.length; n++) { var r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r) } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128) } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128) } } return t }, _utf8_decode: function (e) { var t = ""; var n = 0; var r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++ } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2 } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3 } } return t } }
