var form;

$(document).ready(() => {
    form = $('.contact__form');

    form.submit((e) => {
        e.preventDefault();

        console.log(e);

        var email = form[0]['email'].value;
        var password = form[0]['password'].value;
        var personal = {
            firstname: form[0]['firstname'].value,
            lastname: form[0]['lastname'].value,
            gender: form[0]['gender'].value
        };
        var firstMessage = form[0]['message'].value;

        firebaseConfig.auth().createUserWithEmailAndPassword(email, password).catch(error => {
            document.querySelector('.bulletin_list').BulletinManager.add('error', error.code, error.message);
        })
    });
});