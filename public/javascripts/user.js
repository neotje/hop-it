var triggered = false;

$(document).ready(() => {
    var $form = $('.login__form');
    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");
    console.log("token:", token);

    if ($form.length > 0) {
        $form.submit((e) => {
            console.log(e);

            e.preventDefault();

            var f = $(e.target);

            $.post('/users/login', {
                email: $form.find('.text-input[name="email"]').val(),
                password: $form.find('.text-input[name="password"]').val()
            }, json=>{
                if (!json.error) {
                    document.querySelector('.bulletin_list').BulletinManager.add('good', 'U bent ingelogd.', 'U wordt automatisch doorgestuurd.');
                    setTimeout(()=>{
                        if (window.location.pathname == "/me/login") {
                            window.location.href = "/me";
                        } else {
                            window.location.href = window.location.href;
                        }
                    }, 3000);
                } else {
                    document.querySelector('.bulletin_list').BulletinManager.add('error', 'Fout', 'Error: "' + json.error + '".');
                }
            }, 'json')

        });
    }    

    if (token && triggered == false) {
        triggered = true;
        $.post('/users/verify', {
            token: token
        }, json=>{
            if (!json.error) {
                document.querySelector('.bulletin_list').BulletinManager.add('good', 'Account geverifieerd', 'Je account is geverifieerd. Het is nu mogelijk om via de website met Hop-IT contact te maken.');
            } else {
                if (json.error == 'this account is already verified') {
                    document.querySelector('.bulletin_list').BulletinManager.add('info', 'Account is al geverifieerd', 'Je account is al geverifieerd. Ga naar je account pagina voor verder contact.');
                } else {
                    document.querySelector('.bulletin_list').BulletinManager.add('error', 'Fout', 'Error: "' + json.error + '".');
                }
            }
        }, 'json');
    }
})