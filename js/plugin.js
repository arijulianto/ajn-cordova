/* Database SQLite */
var Database = function(){
	var pub = this;
	var _db = null;
	var _tblName = "";
	var _strSQL = "";
	var _results = new Array();
	var _numRows = 0;
	var _affectedRows = 0;
	var _insertId = 0;
	var _tmp = 'tmp';
	
	this.connect = function(db){
		if(!db) return false;

		if(/Android/i.test(navigator.userAgent)) {
			document.addEventListener("deviceready", function(){
				this._db = window.sqlitePlugin.openDatabase({name: db, location: "default"});
			}, false);
		}else{
			this._db = window.openDatabase(db, "1.0", "", 200000);
		}
	}
	
	this.createTable = function(tblName, arrFields){
		if(!this._db) return false;
		
		var parents = this;
		if(checkType(tblName)=="Object"){
			var query = [];
			this._db.transaction(function (tx){
				$$.each(tblName, function(tbls, flds){
					tx.executeSql("CREATE TABLE IF NOT EXISTS "+tbls+"("+flds.join(",")+");");
				});
			}, function(err, e){
				// error
			}, function(){
				// success
				parents._affectedRows = 1;
			});
		}else if(checkType(tblName)=="String"){
			this._db.transaction(function (tx){
				tx.executeSql("CREATE TABLE IF NOT EXISTS "+tblName+" ("+arrFields.join(",")+");");
			}, function(err, e){
				// error
			}, function(){
				// success
				parents._affectedRows = 1;
			});
		}
	}
	
	this.Drop = function(tblName){
		if(!this._db) return false;
		
		var parents = this;
		this._db.transaction(function (tx){
			tx.executeSql("DROP TABLE "+tblName);
		}, function(err, e){
			// error
		}, function(){
			// success
			parents._affectedRows = 1;
		});
	}
	
	this.Query = function(strQuery, callback){
		if(!this._db) return false;
		
		var aFields = new Array();
		var ss = "";
		this._strSQL = strQuery;
		this._db.transaction(function (tx){
		console.log(tx);
			tx.executeSql(strQuery, [], function(t, res){
				console.log(t);
				// success
				if(res.rows.length){
					for(var i = 0; i<res.rows.length; i++){
						aFields.push(res.rows.item(i));
					}
					return aFields;
				}
			});
		});
		
		this._results = aFields;
	}
	
	this.Insert = function(tblName, objData){
		if(!this._db) return false;
		
		var strFields=[],strMask=[],arrData=[];
		var effect=0;
		var last=0;
		var Self = this;
		$$.each(objData, function(k, v){
			strFields.push(k);
			strMask.push("?");
			arrData.push(v);
		});
		this._db.transaction(function(tx){
			tx.executeSql("INSERT INTO "+tblName+" ("+strFields.join(",")+") VALUES ("+strMask.join(",")+")", arrData);
		});

	}
	
	this.Update = function(tblName, objData, objWhere){
		if(!this._db) return false;
		
		var setFields=[], strWhere=[];
		$$.each(objData, function(k, v){
			setFields.push(k+"='"+v+"'");
		});
		$$.each(objWhere, function(k, v){
			strWhere.push(k+"='"+v+"'");
		});
		this._db.transaction(function (tx){
			tx.executeSql("UPDATE "+tblName+" set "+setFields.join(",")+" where "+strWhere.join(" AND "));
		}, function(){
			//error
		}, function(){
			//success
			pub._affectedRows = 1;
		});
	}
	
	this.Delete = function(tblName, objWhere){
		if(!this._db) return false;
		
		var strWhere=[];
		$$.each(objWhere, function(k, v){
			strWhere.push(k+"='"+v+"'");
		});
		this._db.transaction(function (tx){
			tx.executeSql("DELETE FROM "+tblName+" where "+strWhere.join(" AND "));
		}, function(){
			//error
		}, function(){
			//success
			pub._affectedRows = 1;
		});
	}
};



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
    var template = function(t, n) {
        return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
    };

    var timer = function(time) {
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
        if(ret.substring(0,7)=='kemarin' || ret.substring(0,9)=='baru saja')
			return ret.replace(' yang lalu','');
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

/* Alert Message Box */
function Alert(target){
    this.targ = target;
}
Alert.prototype.success = function(txt, n){
    var wr = this.targ;
    $$(this.targ).html('<div class="sukses">'+txt+'</div>');
    if(n>0){
        n = n*1000;
        setTimeout(function(){
            $$(wr).html('');
        },n)
    }
}
Alert.prototype.warning = function(txt, n){
    var wr = this.targ;
    $$(this.targ).html('<div class="warning">'+txt+'</div>');
    if(n>0){
        n = n*1000;
        setTimeout(function(){
            $$(wr).html('');
        },n)
    }
}
Alert.prototype.failed = function(txt, n){
    var wr = this.targ;
    $$(this.targ).html('<div class="failed">'+txt+'</div>');
    if(n>0){
        n = n*1000;
        setTimeout(function(){
            $$(wr).html('');
        },n)
    }
}
Alert.prototype.notice = function(txt, n){
    var wr = this.targ;
    $$(this.targ).html('<div class="notice">'+txt+'</div>');
    if(n>0){
        n = n*1000;
        setTimeout(function(){
            $$(wr).html('');
        },n)
    }
}




/* Dialog with Icon */
Framework7.prototype.plugins.toast = function (app) {
    'use strict';
    var $$ = Dom7,toast;

    app.toast = function (txt, pos, fade) {
        var sPos = 'bottom',iFade=5000;
        if(pos!==undefined){
            if(pos>0){
                iFade = pos*1000;
                $$('.pages').append('<div class="toast '+sPos+'"><div class="toast-inner">'+txt+'</div></div>');
                setTimeout(function(){
                    $$('.toast').remove();
                },iFade);
            }else{
                if(fade>0){
                    $$('.pages').append('<div class="toast '+sPos+'"><div class="toast-inner">'+txt+'</div></div>');
                    setInterval(function(){
                        $$('.toast').remove();
                    },fade*1000);
                }else{
                    $$('.pages').append('<div class="toast bottom"><div class="toast-inner">'+txt+'</div></div>');
                }
            }
        }
    };
}






/* Dialog with Icon */
Framework7.prototype.plugins.showInfo = function (app) {
    'use strict';
    var $$ = Dom7,showAlert;

    app.showInfo = function (txt, type, title) {
        if(type=="failed" || type=="warning" || type=="success" || type=="notice"){
            if(title!==undefined){
                app.alert('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>', title);
            }else{
                app.alert('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>');
            }
        }else if(type=="question"){
            if(title!==undefined){
                app.confirm('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>', title);
            }else{
                app.confirm('<div class="status"><div class="icon icon-'+type+'"></div><div class="txt">'+txt+'</div></div>');
            }
        }else{
            return;
        }
    };
}


/* Confirm */
Framework7.prototype.plugins.showConfirm = function (app) {
    'use strict';
    var $$ = Dom7,showConfirm;

    app.showConfirm = function (txt, callback, title) {
        app.confirm('<div class="status"><div class="icon icon-question"></div><div class="txt">'+txt+'</div></div>', title||'Confirm', callback);
    };
}