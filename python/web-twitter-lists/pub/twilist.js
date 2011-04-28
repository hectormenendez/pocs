var self = {

    init:function(){
        for (i in self){
            if (typeof self[i]=='object' && typeof self[i].init=='function'){
                self[i].init();
                console.log(i);
            }
        }
    },

    /**
     * User Handling
    **/
    users:{
        init:function(){
            self.$users = $('#users');
            self.$users.find('input[type="submit"]').click(self.oauth.request_get);
        }
    },

    /**
     * OAuth Handling
    **/
    oauth:{

        data:null,

        init:function(){
            self.$oauth = $('#oauth');
            self.$oauth.$num = self.$oauth.find('.num');
            self.$oauth.$lnk = self.$oauth.find('.lnk');
            self.$oauth.$txt = self.$oauth.find('.txt');
        },

        success:function(data){
            var old = self.$users.find('tbody tr:nth-last-child(2)')
            var niu = old.clone().find(':last').html('@'+data).parent();
            self.$users.find('tr:last').before(niu);
            self.$oauth.hide();
        },

        error:function(a){
            alert('Hubo un Error con la autorización.');
            console.log(a);
        },

        request_get:function(){
            var user = self.$users.find('input:first').val();
            if (!user.match(/@?([a-z0-9_]{2,})/i)) return self.error(self.$users);
            self.$oauth.$num.add(self.$oauth.$lnk).hide();
            self.$oauth.show();
            self.$oauth.$txt.show();
            self.post(
                '/action/request',
                { 'user': user },
                self.oauth.request_set,
                self.oauth.error
            );
        },

        request_set:function(data){
            self.data = $.parseJSON(data);
            self.$oauth.$lnk.show();
            self.$oauth.$txt.add( self.$oauth.$num).hide();
            self.$oauth.find('img').click(function(){
                self.$oauth.$lnk.add(self.$oauth.$txt).hide()
                self.$oauth.$num.show().find('input:first').val('');
                window.open(
                    self.data.url,
                    'Twitter',
                    'menubar=no,width=790,height=400,toolbar=no'
                );
            });
            self.$oauth.find('input[type="submit"]').click(self.oauth.signin);
        },

        signin:function(){
            var $this = $(this);
            val = $this.parentsUntil('section').find('input[type!="submit"]').val();
            if (val.match(/[^\d]+/g)) return self.error($this.parentsUntil('section'));
            self.$oauth.$num.hide();
            self.$oauth.$txt.show();
            self.post(
                '/action/signin',
                { 'sess': self.data.sess, 'token': val },
                self.oauth.success,
                self.oauth.error
            )
        }
    },

    post:function(url, data, success, error){ return $.ajax({
        'url'        : url,
        'type'       : 'POST',
        'data'       : data,
        'dataType'   : 'text',
        'converters' : 'text json',
        'success'    : success,
        'error'      : error
    });},

    error:function(o){
        var t = 6;  // times
        var d = 10; // distance

        var ml = parseInt(o.css('margin-left'));
        var x = [ml-d, ml+d];
        var fn = function(x){ o.animate({marginLeft:x},100); };
        for (i=0; i<(t-1); i++) fn(x[i%2]);
        fn(ml);
    },
}

/** Stupid, I know **/
if (typeof console == 'undefined'){
    var console = {
        _log:[],
        log:function(data){ return console._log.push(data);}
    }
}

$(document).ready(self.init);