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



function validateForm(targ, targError){
    var obj = myApp.formToData(targ);
    var reqAll=0,invalid=0,minLength=0,maxLength=0;
    reqAll = $$(targ).find('[required]').length||0;
    if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
        var msg = new Alert(targError);
    }
    
    // check required
    if(reqAll>0){
        $$.each($$(targ).find('[required]'), function(a,b){
            if($$(b).val()==""){
                invalid++;
                $$(b).focus();
                if($$(b).parents('.item-content')){
                    $$(b).parents('.item-content').find('.item-inner').addClass('focus-state');
                    $$(b).parents('.item-content').find('.item-input').addClass('focus-state');
                    $$(b).parents('.item-content').find('input').addClass('focus-state');
                }else{
                    alert('gak')
                }
                if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                    msg.notice("Inputan tidak boleh kosong!");
                }else{
                    myApp.addNotification({message:"Inputan tidak boleh kosong!",closeOnClick:true,button:null})
                    setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                }
                return false;
            }else{
                // check format email
                if($$(b).attr("type")=="email"){
                     var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if(emailFormat.test($$(b).val())==false){
                        invalid++;
                        $$(b).focus();
                        if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                            //$$(targError).html("Invalid Email address!");
                            msg.notice("Email tidak valid!");
                        }else{
                            myApp.addNotification({message:"Email tidak valid!",closeOnClick:true,button:null})
                            setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                        }
                        return false;
                    }
                }else if($$(b).attr("type")=="number"){
                    if(isNaN(parseInt($$(b).val()))){
                        invalid++;
                        $$(b).focus();
                        if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                            //$$(targError).html("Invalid Email address!");
                            msg.notice("Hanya boleh input angka!");
                        }else{
                            myApp.addNotification({message:"Hanya boleh input angka!",closeOnClick:true,button:null})
                            setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                        }
                        return false;
                    }
                }else if($$(b).attr("type")=="date"){
                    if($$(b).val()!=""){
                        invalid++;
                        $$(b).focus();
                        if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                            //$$(targError).html("Invalid Email address!");
                            msg.notice("Silahkan pilih tanggal!");
                        }else{
                            myApp.addNotification({message:"Silahkan pilih tanggal!",closeOnClick:true,button:null})
                            setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                        }
                        return false;
                    }
                }
                // check checkbox is Selected
                else if($$(b).attr("type")=="radio"){
                    var cekRadio = false;
                    $$.each($$(targ).find('[name="'+$$(b).attr('name')+'"]'),function(i,o){
                        if($$(o).prop('checked') == true){
                            cekRadio = true;
                        }
                    });
                    if(cekRadio == false){
                        invalid++;
                        $$(b).focus();
                        if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                            //$$(targError).html("Please select one option!");
                            msg.notice("Silahkan pilih satu opsi!");
                        }else{
                            myApp.addNotification({message:"Silahkan pilih satu opsi!",closeOnClick:true,button:null})
                            setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                        }
                        return false;
                    }
                }
            }
        });
    }
    // check minlength
    if($$(targ).find('[minlength]').length){
        $$.each($$(targ).find('[minlength]'), function(a,b){
            minLength = parseInt($$(b).attr('minlength'));
            if($$(b).val()!="" && $$(b).val().length<minLength){
                invalid++;
                $$(b).focus();
                if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
                    //$$(targError).html("Please select one option!");
                    msg.notice("Silahkan input minimal "+minLength+" karakter!");
                }else{
                    myApp.addNotification({message:"Silahkan input minimal "+minLength+" karakter!",closeOnClick:true,button:null})
                    setTimeout(function(){myApp.closeNotification('.notifications')},5000);
                }
                return false;
            }
        });
    }
    if(invalid>0){
        return false;
    }else{
        if(targError!==undefined && (targError.substring(0,1)=="." || targError.substring(0,1)=="#")){
            $$(targError).html("")
        }else{
            myApp.closeNotification('.notifications');
        }
        return true;
    }
}



/* Timeline Personal: List */
function timelineUser(){
    $$.getJSON(DOMAIN+'timeline/user.json?iduser='+user_profile.iduser, function(res){
        var feed;
        if(res){
            $$(".profile-picture-user").prop('src', (user_profile.picture+"?_rnd="+Math.random()||"img/user.png"));
            $$('.timeline-post-new img').prop('src', (user_profile.picture||"img/user.png"));
            $$('.timeline-post-feed').html("");
            $$('.timeline-post-new.post-block').removeClass('disconnect');
            $$.each(res, function(i, row){
                feed = '<div class="card facebook-card" data-id="'+row.idtimeline+'">'+
                '  <div class="card-header">'+
                '    <div class="facebook-avatar"><img src="'+row.picture+"?_rnd="+Math.random()+'" width="34" height="34"></div>'+
                '    <div class="facebook-name">'+row.nama+(user_profile.iduser==row.iduser?'<a style="position: absolute; right: 20px; margin:2px;" class="action-status"><i class="fa fa-chevron-down"></i></a>':"")+'</div>'+
                '    <div class="facebook-date time" data-time="'+row.tgl+'">'+row.waktu+'</div>'+

                '  </div>'+
                '  <div class="card-content">'+
                '    <div class="card-content-inner open-comment">'+
                '      <div class="status-post">'+row.pesan+'</div>'+
                (row.suka>0?'<div class="like"><a href="#" class="link open-like"><i class="fa fa-thumbs-up"></i> '+row.txt_suka+'</a></div>':'')+
                '    </div>'+
                '  </div>'+
                '  <div class="card-footer">'+
                '    <a href="#" class="link do-like'+(row.disukai==1?' liked':'')+'"><i class="fa fa-thumbs-o-up"></i> Suka</a>'+
                '    <a href="#" class="link open-comment"><i class="fa fa-comment-o"></i> '+row.komentar+' Komentar'+'</a>'+
                '    <a href="#" class="link open-visitor"><i class="fa fa-eye"></i> '+row.visit+' View</a>'+
                '  </div>'+
                '</div> ';
                $$('.timeline-post-feed').append($$(feed));
            });
            
            $$('.action-status').on('click',function(){
                timeline.idtimeline = $$(this).parents('.card').attr('data-id');

                var buttons = [
                    {
                        text: '<i class="fa fa-pencil"></i> Edit Posting',
                        onClick: function () {
                            mainView.router.loadPage('post-edit.html')
                        }
                    },
                    {
                        text: '<i class="fa fa-trash-o"></i> Hapus Posting',
                        onClick: function () {
                            var dataDel = {_METHOD: 'DELETE', idtimeline:timeline.idtimeline}
                            myApp.showConfirm('Anda yakin ingin menghapus posting ini?', function(){
                                $$.post(DOMAIN + 'timeline/data/'+timeline.idtimeline+'.json',dataDel,function(res2){
                                    res2=JSON.parse(res2);
                                    if (res2.status==1){
                                        myApp.toast(res2.message.replace('Data','Post'),5)
                                        //myApp.showInfo(res2.message.replace('Data','Post'),'success','Delete Post');
                                        $$('.timeline-post-feed').find('.card[data-id="'+timeline.idtimeline+'"]').remove();  
                                    }else{
                                        myApp.showInfo(res2.message.replace('Data','Post'),'notice','Hapus Posting');          
                                    }
                                }, function(a, b){
                                    if(b==0){
                                        myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!', 'failed','Galat');
                                    }
                                });
                             }, 'Hapus Posting')
                        }
                    },
                    {
                        text: '<i class="fa fa-remove"></i> Batal',
                        color: 'red'
                    },
                ];
                myApp.actions(buttons);
            });
            
            $$('.open-comment').on('click',function(){
                timeline.idtimeline = $$(this).parents('.card').attr('data-id');
                mainView.router.loadPage('post-komentar.html')
            });
            
            $$('.open-visitor').on('click',function(){
                if($$('.box-comment').hasClass('disconnect')){
                    myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!', 'failed','Galat');
                }else{
                    timeline.idtimeline = $$(this).parents('.card').attr('data-id');
                    mainView.router.loadPage('post-visitor.html');
                }
            });
            
            $$('.open-like').on('click',function(){
                if($$('.box-comment').hasClass('disconnect')){
                    myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!', 'failed','Galat');
                }else{
                    timeline.idtimeline = $$(this).parents('.card').attr('data-id');
                    mainView.router.loadPage('post-like.html');
                }
            });
            
            $$('.do-like').on('click',function(){
                var obCard = $$(this).closest('.card');
                var likeData = {iduser:user_profile.iduser, idtimeline:obCard.attr('data-id')};
                var btnLike = $$(this);
                var can_like = 0;
                if(timeline.idgroup>0 && timeline.is_member==true){
                    can_like = 1;
                }else if(timeline.idgroup==0 && timeline.is_member==0){
                    can_like = 1;
                }else{
                    can_like = 0;
                }
                if(can_like==1){
                    $$.post(DOMAIN+'timeline/like.json', likeData, function(res){
                        res = JSON.parse(res);
                        if(res.status==1){
                            if(res.data.suka){
                                if(obCard.find('.card-content-inner').find('.like').length){
                                    obCard.find('.card-content-inner').find('.like').remove();
                                }
                                obCard.find('.card-content-inner').append($$('<div class="like"><a href="#" class="link open-like"><i class="fa fa-thumbs-up"></i> '+res.data.suka+'</a></div>'));
                            }else{
                                obCard.find('.card-content-inner').find('.like').remove();
                            }
                            btnLike.toggleClass('liked');
                        }
                    },function(a,b){
                        if(b==0){
                            myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!', 'failed','Galat');
                        }
                    });
                }
            });
        }
    },function(a,b){
        if(b==0){
            $$('.timeline-post-feed').html("<div class=\"offline refresh-timeline\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
            $$('.timeline-post-new.post-block').addClass('disconnect');
            $$('.offline.refresh-timeline').on('click', function(){
                $$('.timeline-post-feed').html("<p class=c>Loading...</p>");
                timelineUser();
            });
        }
    });
}

function postStatusNew(){
    var dataPost = myApp.formToData("form.timeline-post-new");
    var cek = validateForm("form.timeline-post-new", ".error-msg");
    if(cek==true){
        myApp.showPreloader('Sedang diproses...');
        dataPost.iduser = user_profile.iduser;
        $$.post(DOMAIN+'timeline/post.json', dataPost, function(res){
            res = JSON.parse(res);
            if(res.status==1){
                myApp.hidePreloader();
                timelineUser();
                myApp.toast(res.msg,5);
                $$('form.timeline-post-new')[0].reset();
                $$('.link.icon-only.close-popup').trigger('click');
            }else{
                myApp.showInfo(res.msg,'warning','Info');
            }
        },function(a,b){
            if(b==0){
                $$('.error-msg').html("<div class=\"offline refresh-status\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-status').on('click', function(){
                    $$('.error-msg').html("");
                    postStatus();
                });
            }
        }); 
    }
}

function postStatusEdit(){
    var dataPost = myApp.formToData("form.timeline-post-edit");
    var cek = validateForm("form.timeline-post-new", ".error-msg");
    if(cek==true){
        myApp.showPreloader('Sedang diproses...');
        dataPost.idtimeline = timeline.idtimeline;
        dataPost.iduser = user_profile.iduser;
        $$.post(DOMAIN+'timeline/post.json', dataPost, function(res){
            res = JSON.parse(res);
            if(res.status==1){
                myApp.toast(res.msg,5);
                myApp.hidePreloader();
                mainView.router.back();
            }else{
                myApp.showInfo(res.msg,'warning','Informasi');
                myApp.hidePreloader();
            }
        }, function(a,b){
            if(b==0){
                myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!', 'failed','Galat');
                myApp.hidePreloader();
            }
        }); 
    }
}

function getPostKomentar(id){
    var li = "";
    $$('.error-msg').html("<p class=c>Loading...</p>");
    $$.getJSON(DOMAIN+'timeline/detail/'+id+'.json?iduser='+user_profile.iduser, function(res){
        $$('.error-msg').html('');
        $$('.comment-block ul').html('');
        $$('.card.facebook-card.comments').show();
        $$('.box-comment').removeClass('disconnect');
        $$('.txt-comment').removeAttr('readonly');
        if(res.data){
            $$('.card.facebook-card.comments').attr('data-id',res.data.id);
            if(res.data.disukai==1){
                $$('.card.facebook-card.comments .do-like2').addClass('liked');
            }else{
                $$('.card.facebook-card.comments .do-like2').removeClass('liked');
            }
            if(res.data.suka){
                $$('.card.facebook-card.comments .like').html('<a href="post-like.html"><i class="fa fa-thumbs-up"></i> '+res.data.suka+'</a>')
            }else{
                $$('.card.facebook-card.comments .like').html('')
            }
            if(res.data.komentar>0){
                $$('.card.facebook-card.comments .do-comment').html('<i class="fa fa-comment-o"></i> '+res.data.komentar+' Komentar');
            }else{
                $$('.card.facebook-card.comments .do-comment').html('<i class="fa fa-comment-o"></i> 0 Komentar');
            }
            if(res.data.visit>0){
                $$('.card.facebook-card.comments .visitor-counter').html('<i class="fa fa-eye"></i> '+res.data.visit+' View');
            }else{
                $$('.card.facebook-card.comments .visitor-counter').html('<i class="fa fa-eye"></i> 0 View');
            }
            $$('.card.facebook-card.comments .facebook-name').html(res.data.nama);
            $$('.card.facebook-card.comments .facebook-avatar').find('img').prop('src',res.data.picture);
            $$('.card.facebook-card.comments .status-post').html(res.data.pesan);
            $$('.card.facebook-card.comments .facebook-date.time').attr('data-time',res.data.tgl).html(res.data.waktu);
        }
        if(res.komentar){
            $$.each(res.komentar, function(i, row){
                li = '    <li komen-id="'+row.idkomentar+'">'+
                     '    <div class="item-content">'+
                     '        <div class="item-media"><img src="'+row.picture+'" width="50"></div>'+
                     '        <div class="item-inner">'+
                     '            <div class="item-title-row">'+
                     '                <div class="item-title">'+row.nama+'</div>'+
                     '                <div class="item-after">'+(row.iduser==user_profile.iduser?'<a href="#" class="del-comment"><i class="color-red fa fa-trash-o"></i></a>':'')+'</div>'+
                     '            </div>'+
                     '            <div class="item-subtitle">'+row.komentar+'</div>'+
                     '           <div class="item-text time" style="color: #777 !important; font-size:10px;" data-time="'+row.tgl+'">'+row.waktu+'</div>'+
                     '        </div>'+
                     '    </div>'+
                     '</li>';
                    $$('.comment-block ul').append($$(li));
            });
        }
        $$('.do-like2').on('click',function(){
            var obCard = $$(this).closest('.card');
            var likeData = {iduser:user_profile.iduser, idtimeline:obCard.attr('data-id')};
            var btnLike = $$(this);
            var can_like = 0;
            if(timeline.idgroup>0 && timeline.is_member==true){
                can_like = 1;
            }else if(timeline.idgroup==0 && timeline.is_member==0){
                can_like = 1;
            }else{
                can_like = 0;
            }
            if(can_like==1){
                $$.post(DOMAIN+'timeline/like.json', likeData, function(res){
                    res = JSON.parse(res);
                    if(res.status==1){
                        if(res.data.suka){
                            if(obCard.find('.card-content-inner').find('.like').length){
                                obCard.find('.card-content-inner').find('.like').remove();
                            }
                            obCard.find('.card-content-inner').append($$('<div class="like"><a href="#" class="link open-like"><i class="fa fa-thumbs-up"></i> '+res.data.suka+'</a></div>'));
                        }else{
                            obCard.find('.card-content-inner').find('.like').remove();
                        }
                        btnLike.toggleClass('liked');
                    }
                },function(a,b){
                    if(b==0){
                        $$('.timeline-post-feed').html("<div class=\"offline refresh-timeline\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                        $$('.timeline-post-new.post-block').addClass('disconnect');
                        $$('.offline.refresh-timeline').on('click', function(){
                            $$('.timeline-post-feed').html("<p class=c>Loading...</p>");
                            timelineUser();
                        });
                    }
                });
            }
        });
        $$('.do-comment').on('click',function(){
            if($$('.box-comment').hasClass('disconnect')){
                myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!','failed','Galat');
            }else{
                $$('.txt-comment').focus();
            }
        });
        $$('.post-comment').on('click',function(){
            if($$('.box-comment').hasClass('disconnect')){
                myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!','failed','Galat');
            }else{
                var dataComment = {idtimeline:timeline.idtimeline,iduser:user_profile.iduser, komentar:$$('.txt-comment').val()};
                var newComment = "";
                if(dataComment.komentar.length>=2){
                    $$.post(DOMAIN+'timeline/detail/komentar.json', dataComment, function(res){
                        res = JSON.parse(res);
                        if(res.status==1){
                            mainView.router.refreshPage();
                        }else{
                            myApp.showInfo(res.msg, 'warning', 'Komentar');
                        }
                    });
                }else{
                    myApp.showInfo('Silahkan input komentar minimal 2 karakter','notice','Komentar');
                    $$('.txt-comment').focus();
                }
            }
        });
        $$('.del-comment').on('click', function(){
            var idkomentar = $$(this).parents('li').attr('komen-id');
            var kk = $$(this).parents('li');
            myApp.showConfirm('Anda yakin ingin menghapus komentar ini?', function(){
                $$.post(DOMAIN+'timeline/komentar/delete.json', {idkomentar:idkomentar}, function(res){
                   res = JSON.parse(res);
                    if(res.status==1){
                        myApp.toast(res.msg, 5);
                        mainView.router.refreshPage();
                    }else{
                        myApp.showInfo(res.msg, 'warning', 'Hapus Komentar');
                    }
                });
            }, 'Confirm Delete')
        });
    },function(a,b){
       if(b==0){
            $$('.box-comment').addClass('disconnect');
            $$('.txt-comment').attr('readonly', true);
            $$('.card.facebook-card.comments').hide();
            $$('.error-msg').html("<div class=\"offline refresh-comment\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
            $$('.offline.refresh-comment').on('click', function(){
                $$('.error-msg').html("<p class=c>Loading...</p>");
                getPostDetail(id);
            });
        }
   });
}

function getPostViewer(id){
    var li = "";
    $$('.visitor-list ul').html('');
    $$.getJSON(DOMAIN+'timeline/detail/'+id+'/visit.json', function(res){
        if(res){
            $$.each(res, function(i, row){
                li = '    <li>'+
                    '<div class="item-content">'+
                    '    <div class="item-media"><img src="'+row.picture+'" width="50" class="media-circle"></div>'+
                    '    <div class="item-inner">'+
                    '        <div class="item-title-row">'+
                    '            <div class="item-title">'+row.nama+'</div>'+
                    '            <div class="item-after">'+(row.suka=='1'?'<i class="fa fa-thumbs-o-up color-blue"></i>':'')+'</div>'+
                    '        </div>'+
                    '        <div class="item-text">'+row.tgl+'</div>'+
                    '    </div>'+
                    '</div>'+
                    '</li>';
                $$('.visitor-list ul').append($$(li));
            });
        }
    });
}

function getPostLike(id){
    var li = "";
    $$('.like-list ul').html('');
    $$.getJSON(DOMAIN+'timeline/detail/'+id+'/like.json', function(res){
        if(res){
            $$.each(res, function(i, row){
                li = '    <li>'+
                    '<div class="item-content">'+
                    '    <div class="item-media"><img src="'+row.picture+'" width="50" class="media-circle"></div>'+
                    '    <div class="item-inner">'+
                    '        <div class="item-title-row">'+
                    '            <div class="item-title">'+row.nama+'</div>'+
                    '            <div class="item-after">'+(row.suka=='1'?'<i class="fa fa-thumbs-o-up color-blue"></i>':'')+'</div>'+
                    '        </div>'+
                    '        <div class="item-text">'+row.tgl+'</div>'+
                    '    </div>'+
                    '</div>'+
                    '</li>';
                $$('.like-list ul').append($$(li));
            });
        }
    });
}


function getArtikel(id){
    var li;
    
    $$('.artikel-block').html("<p class=c>Loading...</p>");
    // cek type
    if(id>0){ // detail
        $$.getJSON(DOMAIN+'artikel/detail/'+id+'.json',function(res){
            $$('.artikel-block').html('');
            if(res){
                li = '<div class="card demo-card-header-pic">'+
                    '<div style="background-image:url('+DOMAIN+'media/images/artikel_'+res.gambar+')" valign="bottom" class="card-header color-white no-border"></div>'+
                    '<div class="card-content">'+
                        '<div class="card-content-inner">'+
                            '<div style="font-size:20px;color:#212464"><span>'+res.title+'</span></div>'+
                            '<div class="color-gray">'+res.tgl+'</div>'+
                            '<p>'+res.body+'</p>'+
                        '</div>'+
                    '</div>'+
                    '</div>';
                $$('.artikel-block').html(li);
            }
        },function(a,b){
            if(b==0){
                $$('.artikel-block').html("<div class=\"offline refresh-timeline\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-timeline').on('click', function(){
                $$('.timeline-post-feed').html("<p class=c>Loading...</p>");
                    getArtikel(id);
                });
            }
        });
    }else{ // list
        $$.getJSON(DOMAIN+'artikel/data.json',function(res){
           $$('.artikel-block').html('');
           $$.each(res,function(k,v){
               li = '<div class="card demo-card-header-pic detail-artikel" data-id="'+v.idartikel+'">'+
                    '<div style="background-image:url('+DOMAIN+'media/images/artikel_'+v.gambar+')" valign="bottom" class="card-header color-white no-border"></div>'+
                      '<div class="card-content">'+
                        '<div class="card-content-inner">'+
                          '<div style="font-size:20px;color:#212464"><span>'+v.title+'</span></div>'+
                          '<div class="color-gray">'+v.tgl+'</div>'+
                          '<p>'+v.body+'</p>'+
                        '</div>'+
                      '</div>'+
                    '</div>';
                $$('.artikel-block').append($$(li));
           });
           $$('.detail-artikel').on('click',function(){
               window.id.artikel = $$(this).attr('data-id');
               mainView.router.loadPage('artikel-detail.html');
           })
       },function(a,b){
           if(b==0){
                $$('.artikel-block').html("<div class=\"offline refresh-artikel\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-artikel').on('click', function(){
                    $$('.artikel-block').html("<p class=c>Loading...</p>");
                    getArtikel();
                });
            }
       });
    }
}

function getAcara(id){
    var li;
    // cek detail
    if(id>0){ // detail
        $$('.acara-block').html("<p class=c>Loading...</p>");
        $$.getJSON(DOMAIN+'acara/detail/'+id+'.json',function(data){
            $$('.acara-block').html('');
            if(data){
                li = '<div class="pad">'+
                    '<h1 class="title">'+data.acara+'</h1>'+
                    '<p class="color-gray">Waktu: '+data.tanggal+' Jam '+data.jam+'<br />Tempat: '+data.tempat+'</p>'+
                    data.keterangan+
                    '</div>';
                $$('.acara-block').html(li);
            }
        },function(a,b){
            if(b==0){
                $$('.acara-block').html("<div class=\"offline refresh-acara\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-acara').on('click', function(){
                $$('.acara-block').html("<p class=c>Loading...</p>");
                    getArtikel(id);
                });
            }
        });
    }else{ // list
        $$('.list-acara').html('<p class=c>Loading...</p>');
        $$.getJSON(DOMAIN+'acara/data.json',function(res){
           $$('.list-acara').html('<ul></ul>');
            if(res.length){
               $$.each(res,function(i,row){
                   li = '    <li data-id="'+row.idacara+'" data-kode="'+row.kode+'">'+
                    '<div style="cusrsor:pointer" class="item-content">'+
                    '    <div class="item-inner">'+
                    '      <div class="item-title-row">'+
                    '        <div class="item-title open-acara"><strong style="color:#212464">'+row.acara+'</strong></div>'+
                    '        <div class="item-after">'+
                    '            <a href="#" class="button button-fill button-raised do-checkin">Checkin</a>'+
                    '          </div>'+
                    '      </div>'+
                    '      <div class="item-subtitle open-acara">'+row.tanggal+' jam '+row.jam+'<br />di '+row.tempat+'</div>'+
                    '     <div class="item-text open-acara">'+row.keterangan+'</div>'+
                    '    </div>'+
                    '  </div>'+
                    '</li>';
                    $$('.list-acara ul').append($$(li));
               });
            }else{
                $$('.list-acara').html('<p class="warning">Belum ada acara hari ini</p>');
            }
            $$('.open-acara').on('click', function(){
                window.id.acara = $$(this).parents('li').data('id');
                mainView.router.loadPage('acara-detail.html');
            });
            $$('.do-checkin').on('click', function(){
               var btn = $$(this);
                cordova.plugins.barcodeScanner.scan(function (result){
                      var dataCheckin= {kode: result.text, iduser: user_profile.iduser}
                      myApp.showPreloader('Checking in...');
                      $$.post(DOMAIN + 'acara/checkin.json',dataCheckin,function(res){
                            res = JSON.parse(res);
                            myApp.hidePreloader();
                            if(res.status=='1'){
                                btn.removeClass('do-checkin').addClass('color-gray');
                                myApp.showInfo(res.msg,'success','Checkin');
                            }else{
                                myApp.showInfo(res.msg,'failed','Checkin');
                            }
                      },function(a,b){
                           if(b==0){
                                myApp.showInfo('Koneksi terputus. Silahkan periksa koneksi internet Anda!','failed','Galat');
                            }
                          myApp.hidePreloader();
                       });

                });
            });
       },function(a,b){
           if(b==0){
                $$('.list-acara').html("<div class=\"offline refresh-acara\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-acara').on('click', function(){
                    $$('.list-acara').html("<p class=c>Loading...</p>");
                    getAcara();
                });
            }
       });
    }
}

function doLogin(){
    var dataLogin = myApp.formToData(".form-login");
    myApp.closeNotification('.notifications');
    var cek = validateForm(".form-login", ".error-msg");
    if(cek==true){
        myApp.showPreloader('Sedang Login...');
        dataLogin.device = Device.platform+' '+Device.version+': '+Device.brand+' '+Device.model;
        $$.post(DOMAIN+"login/user.json", dataLogin, function(res){
            res = JSON.parse(res);
            $$('.error-msg').html('');
            if(res.status==1){
                db.transaction(function(tx){
                    tx.executeSql("INSERT INTO user_profile(iduser,email,nama,nama_panggilan,gender,telp,alamat,kota,whatsapp,line,bbm,facebook,twitter,linkedin,instagram,tempat_lahir,tgl_lahir,tanggal_lahir,status_nikah,sn_facebook,sn_twitter,sn_instagram,sn_linkedin,im_whatsapp,im_line,im_bbm,kelamin,marriage,picture,login_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [res.data.iduser,res.data.email,res.data.nama,res.data.nama_panggilan,res.data.gender,res.data.telp,res.data.alamat,res.data.kota,res.data.whatsapp,res.data.line,res.data.bbm,res.data.facebook,res.data.twitter,res.data.linkedin,res.data.instagram,res.data.tempat_lahir,res.data.tgl_lahir,res.data.tanggal_lahir,res.data.status_nikah,res.data.sn_facebook,res.data.sn_twitter,res.data.sn_instagram,res.data.sn_linkedin,res.data.im_whatsapp,res.data.im_line,res.data.im_bbm,res.data.kelamin,res.data.marriage,res.data.picture,res.data.login_time]);
                }, function(err, e){
                    // error
                    console.log(err)
                }, function(){
                    // success
                    user_profile=res.data;
                    $$('.user_info .login-name').html(user_profile.nama)
                    $$('.user_info .login-time').html(user_profile.login_time)
                    if(res.job){
                        $$.each(res.job, function(a, b){
                            user_job[b.idjob] = {idjob:b.idjob, pekerjaan:b.pekerjaan, jabatan:b.jabatan, perusahaan:b.perusahaan, alamat:b.alamat, kota:b.kota, jenis_usaha:b.jenis_usaha, telp:b.telp, website:b.website};
                            db.transaction(function(tx){
                                tx.executeSql("INSERT into user_job(idjob,pekerjaan,jabatan,perusahaan,alamat,kota,jenis_usaha,telp,website) VALUES(?,?,?,?,?,?,?,?,?);", [b.idjob,b.pekerjaan,b.jabatan,b.perusahaan,b.alamat,b.kota,b.jenis_usaha,b.telp,b.website]);
                            });
                        });
                    }

                    //myApp.hidePreloader();
                    mainView.router.loadPage('home.html');
                });
            }else if(res.status==0){
                myApp.closeNotification('.notifications');
                myApp.showInfo(res.msg,'warning','Warning');
            }
            myApp.hidePreloader();
        },function(a,b){
           if(b==0){
                myApp.hidePreloader();
                $$('.error-msg').html("<div class=\"offline refresh-login\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-login').on('click', function(){
                    $$('.error-msg').html("<p class=c>Loading...</p>");
                    doLogin();
                });
            }
       });
    }
}

function doRegister(){
    var dataReg = myApp.formToData(".form-register");
    var cek = validateForm(".form-register", ".error-msg");
    if(cek==true){
        myApp.showPreloader('Sedang diproses...');
        $$.post(DOMAIN+"users/register.json", dataReg, function(res){
            res = JSON.parse(res);
            if(res.status==1){
                myApp.showInfo(res.msg,'success','Information');
                myApp.hidePreloader();
                mainView.router.loadPage('index.html');
            }else{
                myApp.hidePreloader();
                myAlert.failed(res.msg,5)
            }
        }, function(xhr, status){
            if(status==0){
                myApp.hidePreloader();
                $$('.error-msg').html("<div class=\"offline refresh-register\"><i class=\"fa fa-wifi\"></i> &nbsp; Tidak ada koneksi internet. Klik disini untuk mencoba ulang!</div>");
                $$('.offline.refresh-register').on('click', function(){
                    $$('.error-msg').html("");
                    doRegister();
                });
            }
        })
    }
}