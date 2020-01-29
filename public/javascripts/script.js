var triggered = false;

$(document).ready(() => {
    var url = new URL(window.location.href);
    var token = url.searchParams.get("token");
    console.log(token);
    

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
});