
var self = {
    /**
     * Load all inits
    **/
    init:function(){
        for (i in self){
            if (typeof self[i]=='object' && typeof self[i].init=='function'){
                self[i].init();
            }
        }
        self.$content = $("#content");
    },

    /**
     * User Handling
    **/
    users:{
        curr: null,

        init:function(){
            self.$users = $('#users');
            self.$users.find('input[type="submit"]').click(self.oauth.request_get);
            self.$users.find('tr:not(.add)').click(self.lists.getall);
            console.log('users');
        }
    },

    members:{
        set:function(){
            self.$lists.find('.members').hide()
            self.$member = self.$lists.find('#'+this.className).show();
            console.log('members_' + this.className);
        }
    },

    lists:{
        set:function(data){
            self.$content.find('div.group').remove()
            self.$content.append('<div id='+self.users.curr+' class="group">');
            self.$lists = self.$content.find('div.group').html(data).show();
            self.$lists.find('tr:not(.add)').click(self.members.set);
            console.log('lists');
        },

        getall:function(data,b){
            $this = $(this);
            self.$content.find('div.group').hide();
            self.users.curr = $this.find(':last').html().replace('@','');
            if (!self.users.curr || $('div#'+self.users.curr).length>0)
                return false;
            // obtain username
            $this = $(this);
            user = $this.find(':last').html().replace('@','');
            self.post('/action/getall', {'user':user}, self.lists.set,
            function(data){
                self.error(self.$users);
            });
            console.log('list_' + self.users.curr);
        }
    },

    /**
     * OAuth Handling
    **/
    oauth:{
        sess:Math.floor(Math.random()*99999999),
        data:null,

        init:function(){
            self.$oauth = $('#oauth');
            self.$oauth.$num = self.$oauth.find('.num');
            self.$oauth.$lnk = self.$oauth.find('.lnk');
            self.$oauth.$txt = self.$oauth.find('.txt');
            self.$oauth.find('*').mousedown(function(){ document.validclick = true });
            console.log('oauth');
        },

        success:function(data){
            //
            var old = self.$users.find('tbody tr:first')
            var niu = old.clone().find(':last').html('@'+data).parent();
            self.$users.find('tbody').append(niu);
            self.$oauth.hide();
            self.users.init();
            self.users.curr = data;
            $(document).unbind('mouseup', self.oauth.listener);
            console.info('oauth_'+data);
        },

        error:function(a){
            alert('Hubo un Error con la autorización.');
            console.log(a);
        },

        kill:function(){
            self.post('/action/kill',{'sess':self.oauth.sess})
        },

        listener:function(a,b){
            if (document.validclick === true) {
                document.validclick = undefined;
                return false;
            }
            self.oauth.kill()
            self.$oauth.hide();
            $(document).unbind('mouseup', self.oauth.listener);
            console.log('interrupt', self.oauth.sess);
        },

        request_get:function(){
            self.$oauth.$num.add(self.$oauth.$lnk).hide();
            self.$oauth.add(self.$oauth.$txt).show();
            $(document).bind('mouseup', self.oauth.listener);
            self.post(
                '/action/request',
                {'sess':self.oauth.sess },
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
                    'menubar=no,width=790,height=440,toolbar=no'
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

    post:function(url, data, success, error){
        var $loading = $('#loading').show();
        var _error = function(d){
            $loading.hide();
            error(d);
        };
        var _success = function(d){
            $loading.hide();
            success(d)
        };
        return $.ajax({
            'url'        : url,
            'type'       : 'POST',
            'data'       : data,
            'dataType'   : 'text',
            'converters' : 'text json',
            'success'    : _success,
            'error'      : error
        });
    },

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