function privateFunction(myfunction, myarguments) {
    jQuery(document).ready( function() {
        jQuery.ajax({
            type : "Post",
            dataType : "json",
            url : my.url,
            data : {action: myfunction, arguments:myarguments},
            success: function(response) {
				return response.trim();
            }
		})
	})
}

var Token="";


async function Login() {
  return new Promise((resolve) => {
  	jQuery.ajax({
            type : "Post",
			async: true, 
            dataType : "json",
            url : my.url,
            data : {action: "mwc_login"},
            success: function(response) {

                Token=response;
                writeCookie('Token', Token, 30);

            }
		})

	  setTimeout(() => resolve(), 1500)
  });
}


function ValidarToken() {

    if(readCookie("Token")==''){
        Login();
    }
}

function writeCookie(name,value,minutos) {
    var date, expires;
    if (minutos) {
        date = new Date();
        date.setTime(date.getTime()+(minutos*60*1000));
        expires = "; expires=" + date.toGMTString();
            }else{
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}


function readCookie(name) {
    var i, c, ca, nameEQ = name + "=";
    ca = document.cookie.split(';');
    for(i=0;i < ca.length;i++) {
        c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1,c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
        }
    }
    return '';
}


function OrigenFormulario() {
    var myarguments= window.location.pathname;
    jQuery(document).ready( function() {
        jQuery.ajax({
            type : "Post",
            dataType : "json",
            url : my.url,
            data : {action: "mwc_origen_formulario", arguments:myarguments},
            success: function(response) {
                Formulariorigen=response;

            }
		})
	})
}

