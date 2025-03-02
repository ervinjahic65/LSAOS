origen();
OrigenFormulario();
cargarOpcionesCredito();

if (ori == "Avada") {

}
else if (ori === 'Divi') {
		
}
else {
	document.getElementsByClassName("rut")[0].firstChild.setAttribute("id", 'rut');
	document.getElementsByClassName("nombre")[0].firstChild.setAttribute("id", 'nombre');
	document.getElementsByClassName("celular")[0].firstChild.setAttribute("id", 'celular');
	document.getElementsByClassName("email")[0].firstChild.setAttribute("id", 'email');
	if (getProductPath() == "DES") {
		document.getElementsByClassName("credito")[0].firstChild.setAttribute("id", 'credito');
	}
};

jQuery("#celular").prop("title", "Solo se aceptan números télefonicos de 8 dígitos.");
jQuery("#nombre").prop("title", "Debe ingresar su nombre y apellidos.");
jQuery("#rut").prop("title", "Debe ingresar un RUT válido.");
jQuery("#email").prop("title", "Debe ingresar un Email válido.");
if (getProductPath() == "DES") {
	jQuery("#credito").prop("title", "Debe seleccionar una institución.");
}

var idFormulario = GetIdAvada();

CargarLoader();

async function fnAsync() {
	
	await Login();
	if (getProductPath() == "DES") {
		ListaBancos();
	}
}

fnAsync();

//BloquearNombre();
BloquearPrefijo();

if (ori == "Avada") {
	const btn = document.querySelector('.form-form-submit');
	btn.addEventListener('click', function handleClick(event) {
		event.preventDefault();
		DesHabilitarFormulario();

		btnEnviar();
	});
}
else if (ori === 'Divi') {
	const btn = document.querySelector('.onlife-form-enviar');
	btn.addEventListener('click', function handleClick(event) {
		event.preventDefault();
		grecaptcha.execute('6Ldz1wofAAAAAATuvlhix6d8HQhtV27DETdTPzgL', {action: 'submit'}).then(function(token) {
			var recaptchaResponse = document.querySelector('input[name="g-recaptcha-response"]');
			if (recaptchaResponse) {
				recaptchaResponse.value = token;
			}
		});
		
		btnEnviar();
	});		
}
else {
	const btn = document.querySelector('.wpcf7-submit');
	jQuery('.wpcf7 input[type="submit"]').on('click', function (e) { e.preventDefault() });
	btn.addEventListener('click', function handleClick(event) {

		btnEnviar();
	});
}

jQuery("#rut").on('change keyup paste', validarRut);
jQuery("#rut").on('change blur', prerutificar);
jQuery("#nombre").on('change keyup paste focusout', validarNombre2);
jQuery("#apellido").on('change keyup paste focusout', validarNombre2);
jQuery("#apellido2").on('change keyup paste focusout', validarNombre2);
jQuery("#celular").on('change keyup paste focusout', validarCelular);
jQuery("#email").on('change keyup paste focusout', validarEmail);
jQuery("#fecha").on('change keyup paste focusout', validarFecha);
jQuery("#fecha").on('blur', validarFecha2);
jQuery("#sexo").on('change', validarFecha2);

if (getProductPath() == "DES") {
	var sexoDiv = document.querySelector(".onlife-form-sexo");
	if (sexoDiv) {
	  sexoDiv.style.display = "block";
	}
	jQuery("#sexo").on('change keyup paste focusout', validarSexo);
	jQuery("#credito").on('change keyup paste focusout', validarSelect);
	jQuery("#otro-financiero").on("change keyup paste focusout", ValidarOtroFinanciero);
}
var checkbox = document.getElementById('aceptat');
checkbox.addEventListener("change", validaCheckbox, false);
function validaCheckbox()
{
  var checked = checkbox.checked;
  if(checked){
	$('#botonEnviar').prop('disabled', false); 
    
  }else{
	$('#botonEnviar').prop('disabled', true); 
  }
}

jQuery("#celular").minlength = "8";
jQuery("#celular").maxlength = "8";

var rutcorrecto = false;
var nombrecorrecto = false;
var fechacorrecto = false;
var sexocorrecto = false;
var emailcorrecto = false;
var celularcorrecto = false;
var SelectCorrecto = false;

function validarRut(e) {
	//BloquearNombre();

	var rut = e.target.value;
	rut = rut.split(".").join("");
	rut = rut.split("-").join("");
	rut = rut.trim();
	var rutAux = rut;
	e.target.value = rut;
	e.target.value = RutHelper.formatearFull(rut, false);
	rut = e.target.value;
	if (RutHelper.validar(rut, false)) {
		rutcorrecto = true;
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.style.color = "black";
		e.target.style.borderColor = "#9ec436";
		e.target.title = "";
	}
	else {
		rutcorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.style.color = "red";
		e.target.style.borderColor = "red";
		e.target.title = "Debe ingresar un RUT válido.";
		document.getElementById('nombre').value = "";
	}

	if ((rutAux.length < 7) || (rutAux.length > 10)) {
		e.target.style.color = "red";
		e.target.style.borderColor = "red";
		e.target.title = "Debe ingresar un RUT válido.";
		document.getElementById("nombre").value = "";
	}

	if (rut.length == 0) {
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.title = "Debe ingresar un RUT válido.";
		rutcorrecto = true;
	}

	validarFormulario();
}

function prerutificar(e) {
	rut = e.target.value;
	color = e.target.style.color;
	nombre = document.getElementById('nombre').value;
	rut = rut.split(".").join("");
	rut = rut.split("-").join("");
	rut = rut.trim();

	cantidad = rut.length;

	if ((cantidad > 7) && (cantidad < 10) && (color === "black") && (nombre == "")) {

		var obj = {};

		obj['rut'] = e.target.value;
		obj['token'] = readCookie("Token");
		obj['Formulariorigen'] = Formulariorigen;

		EliminarAlerta();
	if (readCookie("Token") != "") {
			Rutificar(obj, "nombre");
		}
		else {
			MostrarAlerta("Por favor refrescar la página");
		}
	}
	else {
		e.target.parentElement.parentElement.classList.add('error');
	}
}

    function formatearFecha(input) {
      let valor = input.value.replace(/\D/g, '');

      if (valor.length >= 5) {
        input.value = valor.slice(0, 2) + '/' + valor.slice(2, 4) + '/' + valor.slice(4, 8);
      } else if (valor.length >= 3) {
        input.value = valor.slice(0, 2) + '/' + valor.slice(2, 4);
      } else if (valor.length >= 1) {
        input.value = valor.slice(0, 2);
      }
    }

    function convertirFecha() {
      const inputFecha = document.getElementById("fecha").value;
      const partes = inputFecha.split('/');

      if (partes.length === 3) {
        const fechaISO = `${partes[2]}-${partes[1]}-${partes[0]}`;
        console.log("Fecha en formato YYYY-MM-DD:", fechaISO); // Verificación en consola
        // Aquí puedes enviar `fechaISO` al servidor o asignarlo a un campo oculto para enviarlo en el formulario
      } else {
        console.error("Formato de fecha inválido");
      }
    }

jQuery("#email").on('change keyup paste focusout', function (e) {
	var email = jQuery(this).val();
	jQuery(this).val(email.trim());
	jQuery(this).css("backgroundColor", "white")

	if (validarEmail(e)) {
		jQuery(this).css("color", "black");
		jQuery(this).css("borderColor", "#9ec436");
	}
	else {
		jQuery(this).css("color", "red");
		jQuery(this).css("borderColor", "red");
	}

	validarFormulario();
	return false;
});

function validarEmail(e) {
	valor = jQuery("#email")[0].value;

	if (valor != "") {
		emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
		if (emailRegex.test(valor)) {
			emailcorrecto = true;
			e.target.parentElement.parentElement.classList.remove('error');
			e.target.title = "";
			return true;
		}
		emailcorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.title = "Debe ingresar un Email válido.";
		return false;
	}

	emailcorrecto = true;
	e.target.parentElement.parentElement.classList.remove('error');
	e.target.title = "Debe ingresar un Email válido.";
	return true;
}



function validarFecha(e) {
    const input = e.target;

    // Validar si el campo está vacío
    if (!input.value) {
        input.style.borderColor = "red";
        input.title = "Debe ingresar una fecha válida.";
		fechacorrecto = false;
        return;
    }

    // Convertir el valor del input de formato YYYY-MM-DD a Date
    const fechaNacimiento = new Date(input.value);
    if (isNaN(fechaNacimiento)) {
        input.style.borderColor = "red";
        input.title = "Debe ingresar una fecha válida.";
		fechacorrecto = false;
        return;
    }
/*
	let productPath = getProductPath();
			var fecha_n=document.getElementById('fecha').value;
			if( productPath === 'DES') {
			var sexo=document.getElementById('sexo').value;
			}else{
				var sexo=0;
			}
			let mostrarFiltroEdad = false;
			let filtroEdad = filtroEdadFunc3(sexo,fecha_n);
			
			if(!filtroEdad.cumpleEdad && productPath === 'DES') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSAA') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSVV') {
				mostrarFiltroEdad = true;
			}
			if(!filtroEdad.cumpleEdad) {
				fechacorrecto = false;
				MostrarAlerta(filtroEdad.mensaje);
			}else{
				fechacorrecto = true;
				// Si todo es válido
				input.style.borderColor = "black";
				input.style.color = "black";
				input.title = "";
			}*/

			fechacorrecto = true;
				// Si todo es válido
				input.style.borderColor = "black";
				input.style.color = "black";
				input.title = "";
	
}
function validarFecha2(e) {
    const input = e.target;

    
	let productPath = getProductPath();
			var fecha_n=document.getElementById('fecha').value;
			if( productPath === 'DES') {
			var sexo=document.getElementById('sexo').value;
			}else{
				var sexo=0;
			}
			console.log(sexo);
			console.log(fecha_n);
			let mostrarFiltroEdad = false;
			let filtroEdad = filtroEdadFunc3(sexo,fecha_n);
			
			if(!filtroEdad.cumpleEdad && productPath === 'DES') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSAA') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSVV') {
				mostrarFiltroEdad = true;
			}
			if(!filtroEdad.cumpleEdad) {
				fechacorrecto = false;
				MostrarAlerta(filtroEdad.mensaje);
			}else{
				fechacorrecto = true;
				// Si todo es válido
				input.style.borderColor = "black";
				input.style.color = "black";
				input.title = "";
			}
	
}
function validarSexo(e) {
	valor = jQuery("#sexo")[0].value;

	if (valor != "") {
	sexocorrecto = true;
	}else{
		
	}

	sexocorrecto = true;
	e.target.parentElement.parentElement.classList.remove('error');
	e.target.title = "Debe ingresar un genero válido.";
	return true;
}

function validarCelular(e) {
	var largo = 8;
	var menornumero = 30000000;
	e.target.value = e.target.value.replace(/[^\d]+/g, "");
	if ((e.target.value.length < largo) && (e.target.value.length >= 0)) {
		celularcorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.style.borderColor = "red";
		e.target.style.color = "red";
		e.target.title = "Solo se aceptan números télefonicos de 8 dígitos.";
	}
	else if (e.target.value.length > largo) {
		celularcorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.value = e.target.value.substr(0, largo);
		e.target.style.borderColor = "red";
		e.target.style.color = "red";
		e.target.title = "Solo se aceptan números télefonicos de 8 dígitos.";
	}
	else if (e.target.value < menornumero) {
		celularcorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.value = e.target.value.substr(0, largo);
		e.target.style.borderColor = "red";
		e.target.style.color = "red";
		e.target.title = "Solo se aceptan números télefonicos de 8 dígitos.";
	}
	else {
		celularcorrecto = true;
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.style.borderColor = "#9ec436";
		e.target.style.color = "black";
		e.target.title = "";
	}

	validarFormulario();
}

function validarMensaje(e) {
	var mensaje = e.target.value;
	if (mensaje.length > 500) {
		mensajecorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.value = e.target.value.substr(0, 500) + "\u2026";
		e.target.style.color = "red";
	}
	else {
		mensajecorrecto = true;
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.style.color = "black";
	}

	validarFormulario();
}

function validarNombre(e) {
	var mensaje = e.target.value;
	if (mensaje.length == 0) {
		nombrecorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
	}
	if ((mensaje.length < 3) && (mensaje.length > 0)) {
		nombrecorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.value = e.target.value.substr(0, 50);
		e.target.style.color = "gray";
	}
	else if (mensaje.length > 50) {
		nombrecorrecto = false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.value = e.target.value.substr(0, 50) + "\u2026";
		e.target.style.color = "red";
		e.target.style.borderColor = "red";
	}
	else {
		nombrecorrecto = true;
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.style.color = "black";
		e.target.style.borderColor = "#9ec436";
	}

	validarFormulario();
}
function validarNombre2(e) {
     var mensaje = e.target.value;

         if (/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/.test(mensaje)) {
    e.target.value = mensaje.replace(/[^a-zA-ZñÑáéíóúÁÉÍÓÚ\s]/g, ''); 
      	nombrecorrecto=false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.parentElement.classList.add('error');
			e.target.style.borderColor="red";
		e.target.style.color="red";
		//e.target.title=MensajeErrorNombreSeguros;
    }
  
	 if ((mensaje.length < 3) && (mensaje.length > 0)) {
	   	nombrecorrecto=false;
		e.target.parentElement.parentElement.classList.add('error');
		e.target.parentElement.classList.add('error');
		 e.target.style.borderColor="red";
		e.target.style.color="red";
		e.target.title=MensajeErrorNombreSeguros;
	 } else if (mensaje.length > 20) {
			nombrecorrecto=false;
			e.target.parentElement.parentElement.classList.add('error');
			e.target.parentElement.classList.add('error');
			e.target.value=e.target.value.substr(0, 20) + "\u2026";
			e.target.style.borderColor="red";
		e.target.style.color="red";
		//e.target.title=MensajeErrorNombreSeguros;
			}
	else{
		nombrecorrecto=true;
		e.target.parentElement.parentElement.classList.remove('error');
		e.target.parentElement.classList.remove('error');
		e.target.style.color="black";
			e.target.style.borderColor="black";
		e.target.style.color="black";
		//e.target.title="";
	}
	validarFormulario();
}

function ValidarOtroFinanciero(e) {
	var mensaje = e.target.value;
	var maximo = 500;
	if (mensaje.length > maximo) {
		e.target.value = e.target.value.substr(0, maximo) + "\u2026";
		e.target.style.borderColor = "red";
		e.target.style.color = "red";
		e.target.title = "Debe ingresar una institución.";
	}
	else if (mensaje.length == 0) {
		e.target.style.borderColor = "red";
		e.target.title = "Debe ingresar una institución.";
	}
	else {
		e.target.style.borderColor = "#9ec436";
		e.target.style.color = "black";
		e.target.title = "";
	}

	validarSelect();
}

function validarSelect() {
	var nombreselect = "credito";
	if (modelFilter()[nombreselect] == "") {

		document.getElementById(nombreselect).parentElement.parentElement.parentElement.classList.add('error');
		SelectCorrecto = false;
		document.getElementById(nombreselect).style.color = "red";
		document.getElementById(nombreselect).style.borderColor = "red";
	}
	else {
		
		document.getElementById(nombreselect).parentElement.parentElement.parentElement.classList.remove('error');
		SelectCorrecto = true;
		document.getElementById(nombreselect).style.color = "black";
		document.getElementById(nombreselect).style.borderColor = "#9ec436";
	}

	validarFormulario();
}

function validarFormulario() {
	var obj = modelFilter();

	if (obj.nombre.length == 0) {
		nombrecorrecto = false;
	}

	if ((rutcorrecto) && (nombrecorrecto) && (emailcorrecto) && (celularcorrecto) && (SelectCorrecto)) {
		DesHabilitarFormulario();
	}
	else {
		HabilitarFormulario();
	}
}

function cuadroError() {
	if (!celularcorrecto) { document.getElementById("celular").style.borderColor = "red"; }
	if (!fechacorrecto) { document.getElementById("fecha").style.borderColor = "red"; }
	if (!sexocorrecto) { document.getElementById("sexo").style.borderColor = "red"; }
	if (!emailcorrecto) { document.getElementById("email").style.borderColor = "red"; }
	if (!rutcorrecto) { document.getElementById("rut").style.borderColor = "red"; }
	if (!nombrecorrecto) { document.getElementById("nombre").style.borderColor = "red"; 
						  document.getElementById("apellido").style.borderColor = "red"; 
						  document.getElementById("apellido2").style.borderColor = "red"; 
						 }
	if (getProductPath() == "DES") {
		if (document.getElementById('credito').value == "Otro" && document.getElementById('otro-financiero').value == "") {
			document.getElementById("otro-financiero").style.borderColor = "red";
			document.getElementById('credito').style.borderColor = "red";
		}
		if (document.getElementById('credito').value == "") {
			document.getElementById('credito').style.borderColor = "red";
		}
	}
}

function btnEnviar() {
	var obj = modelFilter();
	cuadroError();
	let currentPath = getProductPath();

	if ((obj.rut.length == 0) || (obj.nombre.length == 0) || (obj.apellido.length == 0) || (obj.apellido2.length == 0) || (obj.fecha.length == 0) || (obj.email.length == 0) || (obj.celular.length < 8)) {
		return false;
	}

	if (getProductPath() == "DES") {
		if ((document.getElementById('otro-financiero').value != "" && obj.credito.length == 0)) {
			return false;
		}

		if (document.getElementById('otro-financiero').value == "" && document.getElementById('credito').value == "Otro") {
			return false;
		}
		if(obj.sexo.length == 0){
			return false;
		}

		if (obj.credito.length == 0) {
			return false;
		}
	}
	let productPath = getProductPath();
			var fecha_n=document.getElementById('fecha').value;
			if( productPath === 'DES') {
			var sexo=document.getElementById('sexo').value;
			}else{
				var sexo=0;
			}
			let mostrarFiltroEdad = false;
			let filtroEdad = filtroEdadFunc3(sexo,fecha_n);
			
			if(!filtroEdad.cumpleEdad && productPath === 'DES') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSAA') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSVV') {
				mostrarFiltroEdad = true;
			}
			if(!filtroEdad.cumpleEdad) {
				
				MostrarAlerta(filtroEdad.mensaje);
			}else{

			if (document.getElementById("email").style.color == 'red') {
				return false;
			} else {
		ActivarLoader();
		MostrarExito('Procesando su solicitud...');
		jQuery(document).ready(function () {
			jQuery.ajax({
				type: "Post",
				dataType: "json",
				url: my.url,
				data: { action: "mwc_envia_form", arguments: obj },
				success: function (response) {
					DesactivarLoader();

					if (response.Realizada) {
						LimpiarFormulario();
						//BloquearNombre();
						MostrarExito('Su solicitud fue realizada con éxito');
						OcultarBoton();
						if (getProductPath() == "DES") {
							if (ori !== 'Divi') {
								window.location.href = window.location.protocol + '//' + window.location.hostname + '/respuesta-exitosa-de-formulario/';
							}
						}

						if (getProductPath() == "SSVV") {
							if (ori !== 'Divi') {
								window.location.href = window.location.protocol + '//' + window.location.hostname + '/respuesta-exitosa-de-formulario-vida/';
							}
						}

						if (getProductPath() == "SSAA") {
							if (ori !== 'Divi') {
								window.location.href = window.location.protocol + '//' + window.location.hostname + '/respuesta-exitosa-de-formulario-ahorro/';
							}
						}
						
						// mandamos el evento a tag manager
							if(typeof dataLayer !== 'undefined') {
								window.dataLayer = window.dataLayer || [];  
								dataLayer.push({event: 'onlife_form_evento'});
							}
						
				
					}
					else {
						MostrarAlerta(response.Mensaje);
					}
				}
			})
		})
			}


			}//validacion fecha
}