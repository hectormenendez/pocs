
$(document).ready(function(){

    console.info('here');

    $users = $('#users');

    var post = function(url, data, success, error){
        return $.ajax({
            'url'        : url,
            'type'       : 'POST',
            'data'       : data,
            'dataType'   : 'text',
            'converters' : 'text json',
            'success'    : success,
            'error'      : error
        });
    }

    var error = function(o){
        var t = 6;  // times
        var d = 10; // distance

        var ml = parseInt(o.css('margin-left'));
        var x = [ml-d, ml+d];
        var fn = function(x){ o.animate({marginLeft:x},100); };
        for (i=0; i<(t-1); i++) fn(x[i%2]);
        fn(ml);
    }

    var auth = function(){
        var user = $users.find('input:first').val();
        if (!user.match(/@?([a-z0-9_]{2,})/i)) return error($users);
        $oauth = $('#oauth');
        $oauth.show().find('.num, .link').hide();
        post('/action/request', {'user':user},
        function(data){ // success
            data = $.parseJSON(data);
            $oauth.find('.num, .text').hide();
            $oauth.find('.link').show();
            $oauth.find('img').click(function(){
                $oauth.find('.link, .text').hide();
                $oauth.find('.num').show().find('input:first').val('');
                window.open(data.url, 'Twitter', 'menubar=no,width=790,height=400,toolbar=no');
            });
            $oauth.find('input[type="submit"]').click(function(){
                var $this = $(this);
                val = $this.parentsUntil('section').find('input[type!="submit"]').val();
                if (val.match(/[^\d]+/g)) return error($this.parentsUntil('section'));
                post('/action/signin', { 'sess': data.sess, 'token': val },
                function(data){
                    console.info(data)
                },
                function(a){ // error signin
                    alert('hubo un error en el inicio de session')
                    console.info(a)
                })
            });
        },
        function(a){ // error request
            alert('Hubo un Error en el Request inicial.');
            console.info(a);
        });
    }

    $users.find('input[type="submit"]').click(auth);

});
