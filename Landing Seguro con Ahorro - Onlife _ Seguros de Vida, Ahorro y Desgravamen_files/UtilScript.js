var ori = "";
var productPath = "";
var middlewareCanalesDebugInfo = {};

//creado por PM
function MWCanales_Debug(infoDebug){
	// aqui sale una alerta en el editor de js en wordpress ya que no reconoce el operador spread
	if(typeof middleware_canales_datos !== undefined && middleware_canales_datos !== ''){
		middlewareCanalesDebugInfo = {...middlewareCanalesDebugInfo, ...infoDebug};
	}
}


function getProductPath() {
	var path = window.location.pathname;
	if (path == "/seguro-de-desgravamen/" || path == "/landing-seguro-de-desgravamen/" || path == "/landing-seguro-de-desgravamen-corredor/") { productPath = "DES" }
	if (path == "/seguro-de-vida/" || path == "/landing-seguro-de-vida/") { productPath = "SSVV" }
	if (path == "/seguro-con-ahorro/" || path == "/landing-seguro-con-ahorro/") { productPath = "SSAA" }
	
	/*para que funcionen las paginas alternativas en transicion*/
 	if (path == "/seguro-de-desgravamen-divi/" || path == "/landing-seguro-de-desgravamen-divi/" || path == "/landing-seguro-de-desgravamen-corredor-divi/") { productPath = "DES" }
	if (path == "/seguro-de-vida-divi/" || path == "/landing-seguro-de-vida-divi/") { productPath = "SSVV" }
	if (path == "/seguro-con-ahorro-divi/" || path == "/landing-seguro-con-ahorro-divi/") { productPath = "SSAA" }
	
	MWCanales_Debug({productPath: productPath});
	return productPath;
}

function origen() {
	if (jQuery('.fusion-form').hasClass("fusion-form")) { ori = "Avada"; }
	if (jQuery('.wpcf7').hasClass("wpcf7")) { ori = "wpcf7"; }
	if(jQuery('.onlife-form-wrapper').length !== 0) { ori = "Divi"; }
}

function CargarLoader() {
	var elemDiv = document.createElement('div');
	elemDiv.setAttribute("id", "mw-pv-loader");

	if (ori == 'Avada') {
		document.getElementsByClassName(idFormulario)[1].appendChild(elemDiv);
	}
	else if(ori == 'Divi') {
		jQuery('.onlife-form-wrapper').append('<div id="mw-pv-loader"></div>'); // PM
	}
	else {
		document.getElementById(idFormulario).appendChild(elemDiv);
	}
}

function ActivarLoader() {
	document.getElementById("mw-pv-loader").classList.add("loader");
}

function DesactivarLoader() {
	document.getElementById("mw-pv-loader").classList.remove("loader");
}

function GetIdAvada() {
	if (ori == 'Avada') {
		var id = jQuery('.fusion-form')[0].getAttribute('data-form-id');
		id = 'fusion-form-' + id;
		document.getElementsByClassName(id)[0].setAttribute("id", id);
		document.getElementById(id).firstElementChild.classList.remove("fusion-form");
	}
	else if(ori === 'Divi'){
		var id = jQuery('.onlife-form-wrapper').find('form').attr('id');
	}
	else {
		id = "Formulario";
		document.getElementsByClassName('wpcf7-form')[0].setAttribute("id", id);
	}

	return id;
}

function HabilitarFormulario() {
	if (!document.getElementById(idFormulario).firstElementChild.classList.contains("fusion-form")) {
		document.getElementById(idFormulario).firstElementChild.classList.add("fusion-form");
	}
}

function DesHabilitarFormulario() {
	if (document.getElementById(idFormulario).firstElementChild.classList.contains("fusion-form")) {
		document.getElementById(idFormulario).firstElementChild.classList.remove("fusion-form");
	}
}

function modelFilter() {
	if (ori == "Avada") {
		var elements = document.getElementById(idFormulario).firstElementChild.elements;
	}
	else if (ori == "Divi") {
		var elements = document.getElementById(idFormulario).elements;
	}
	else {
		var elements = document.getElementById(idFormulario).elements;
	}

	var obj = {};
	for (var i = 0; i < elements.length; i++) {
		var item = elements.item(i);
		obj[item.name] = item.value;
	}

	if (getProductPath() == "DES") {
		if (document.getElementById('otro-financiero').value != "") {
			obj['credito'] = 'Otro -' + document.getElementById('otro-financiero').value;
		}
	}

	obj['token'] = readCookie("Token");
	obj['Formulariorigen'] = Formulariorigen;

	if (ori == "Avada") {

	}
	else if (ori == "Divi") {

	}
	else {
		obj['g-recaptcha-response'] = elements._wpcf7_recaptcha_response.value;
	}

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	obj['Fuente'] = urlParams.get('utm_source');
	obj['Medio'] = urlParams.get('utm_medium');
	obj['Campaña'] = urlParams.get('utm_campaign');
	obj['Término'] = urlParams.get('utm_term');
	obj['Contenido'] = urlParams.get('utm_content');

	return obj;
}

// function creada por PM
function cargarOpcionesCredito(){

	jQuery('#credito').on('click', function() {
	
			var selectElement = jQuery(this); // Obtener el elemento select

			// Comprobar si ya fueron agregadas las opciones previamente y si no, comprobar si window.optionsCredito contiene opciones para agregarlas
			if (selectElement.find('option').length < 3 && window.optionsCredito && Object.keys(window.optionsCredito).length > 0) {
				// Agregar las opciones de window.optionsCredito al select
				jQuery.each(window.optionsCredito, function(index, option) {
					selectElement.append(option);
				});
				selectElement.find('option:eq(1)').appendTo(selectElement); // Mover otro al final de la lista
			} 

	});

}

/* function modificada por PM*/
function ListaBancos() {
	let selectElement = jQuery('#credito');


	var optionsCredito = {}; // creamos este objeto para guardar los options de selectElement


	var token = readCookie("Token");
	jQuery(document).ready(function () {
		jQuery.ajax({
			type: "Post",
			dataType: "json",
			url: my.url,
			data: { action: "mwc_lista_bancos", arguments: token },
			success: function (response) {
				response.forEach(function (valor, indice, array) {
					
					let newOption = (`<option value="${valor.Nombre}">${valor.Nombre}</option>`);
					selectElement.append(newOption);
					optionsCredito[valor.Nombre] = newOption; // aqui lo agregamos al objeto que podremos acceder en hacer click en selectElement
			
				});

				selectElement.find('option:eq(1)').appendTo(selectElement);

				window.optionsCredito = optionsCredito; // aqui pasamos el objeto a window, para poder utilizarlo globalmente

			}
		})
	});
}

function filtroEdadFunc(datos){
	let cumpleEdad = true;
let page = getProductPath();
	let fechaNacimiento = datos.FechaNacimiento;
	let sexo = datos.IdSexo;

	let fechaNacimientoDate = new Date(fechaNacimiento);
	let fechaActual = new Date();

	let diferenciaFechas = fechaActual - fechaNacimientoDate;

	let edad = (diferenciaFechas / (365.25 * 24 * 60 * 60 * 1000));

	let mensaje;
	if(page === 'DES') {
			if(sexo === 1 && edad >= 65){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 64 años y 364 días';

	}
	else if(sexo === 2 && edad >= 60){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 59 años y 364 días';
	}
		
	}
	else if(page==='SSAA'){
   		if(edad >= 75){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 74 años y 364 días';

	}
   }
	else if(page==='SSVV'){
   		if(edad >= 65){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 64 años y 364 días';

	}
   }
	else {
		mensaje = "";
	}

 

	return {
		cumpleEdad,
		mensaje
	}

}

function filtroEdadFunc2(sexov,fecha){
	let cumpleEdad = true;
let page = getProductPath();
	//let fechaNacimiento = fecha;
	let sexo = sexov;

	// Convierte la fecha al formato correcto si es necesario
	let [dia, mes, anio] = fecha.split('/');
	let fechaNacimiento = `${anio}-${mes}-${dia}`; // Formato YYYY-MM-DD
	let fechaNacimientoDate = new Date(fechaNacimiento);
	let fechaActual = new Date();

	let diferenciaFechas = fechaActual - fechaNacimientoDate;

	let edad = Math.floor(diferenciaFechas / (365.25 * 24 * 60 * 60 * 1000));

	let mensaje = "";
	if(page === 'DES') {
		
			if(sexo === '1' && edad >= 65){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 64 años y 364 días';

	}
	else if(sexo === '2' && edad >= 60){
	
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 59 años y 364 días';
	}
		
	}
	else if(page==='SSAA'){
   		if(edad >= 75){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 74 años y 364 días';

	}
   }
	else if(page==='SSVV'){
   		if(edad >= 65){
		cumpleEdad = false;
		mensaje = 'La edad máxima de contratación es de 64 años y 364 días';

	}
   }
	else {
		mensaje = "";
	}


	return {
		cumpleEdad,
		mensaje
	}

}
function filtroEdadFunc3(sexov, fecha) {
    let cumpleEdad = true;
    let page = getProductPath();
    let sexo = sexov;

    // La fecha ya viene en formato YYYY-MM-DD
    let fechaNacimientoDate = new Date(fecha); // Convertir directamente el valor del input a una fecha
    let fechaActual = new Date();

    // Calcular la diferencia en milisegundos y convertir a años
    let diferenciaFechas = fechaActual - fechaNacimientoDate;
    let edad = Math.floor(diferenciaFechas / (365.25 * 24 * 60 * 60 * 1000));

    let mensaje = "";
    if (page === 'DES') {
        if (sexo === '1' && edad >= 65) {
            cumpleEdad = false;
            mensaje = 'La edad máxima de contratación es de 64 años y 364 días';
        } else if (sexo === '2' && edad >= 60) {
            cumpleEdad = false;
            mensaje = 'La edad máxima de contratación es de 59 años y 364 días';
        }
    } else if (page === 'SSAA') {
        if (edad >= 75) {
            cumpleEdad = false;
            mensaje = 'La edad máxima de contratación es de 74 años y 364 días';
        }
    } else if (page === 'SSVV') {
        if (edad >= 65) {
            cumpleEdad = false;
            mensaje = 'La edad máxima de contratación es de 64 años y 364 días';
        }
    }

    return {
        cumpleEdad,
        mensaje
    };
}
function Rutificar(objeto, destino) {
	MWCanales_Debug({ejecutaRutificar: 'si'});
	ActivarLoader();

	
	jQuery.ajax({
		type: "Post",
		dataType: "json",
		url: my.url,
		data: { action: "mwc_rutificar", arguments: objeto },
		success: function (response) {
			MWCanales_Debug({respuestaRutificar: 'Si'});
			/*let mostrarFiltroEdad = false;
			let filtroEdad = filtroEdadFunc(response);
			let productPath = getProductPath();
			if(!filtroEdad.cumpleEdad && productPath === 'DES') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSAA') {
				mostrarFiltroEdad = true;
			}
				if(!filtroEdad.cumpleEdad && productPath === 'SSVV') {
				mostrarFiltroEdad = true;
			}*/
			
			DesactivarLoader();
			

			if (response.PoseeCaso || response.Mensaje == 'Object reference not set to an instance of an object. No es posible obtener información.') {
				
				/*if(!filtroEdad.cumpleEdad) {
					MostrarAlerta(filtroEdad.mensaje);
				}
				else {
				
					MostrarAlerta(response.Mensaje);
				}*/
				MostrarAlerta(response.Mensaje);
				jQuery("#rut").val("");
				document.getElementById("rut").parentElement.parentElement.classList.add("error");
			} else if (response.PoseeCaso == null && response.Mensaje.trim() == "") {
				DesactivarLoader();
				//DesBloquearNombre();
			} else if (response.PoseeCaso == false && response.Mensaje.trim() == "") {
				DesactivarLoader();
				//DesBloquearNombre();
			} else {
			/*	if ((jQuery('#' + destino).val() == "") && (response.Mensaje.trim().length > 2)) {
					jQuery('#' + destino).val(response.Mensaje.trim());
					jQuery('#' + destino).prop("readOnly", "readOnly");
					nombrecorrecto = true;
					jQuery('#' + destino).css("color", "black");
					if (jQuery('#' + destino).parent().parent().hasClass('error')) {
						jQuery('#' + destino).parent().parent().toggleClass("error");
					}
				}*/
			
			}
		},
		error: function (e) {
			DesactivarLoader();
			//DesBloquearNombre();
			MWCanales_Debug({errorRutificar: e});
		}
	})
	
}

function validarcaptcha() {
	var recaptcha = modelFilter()['g-recaptcha-response'];
	jQuery(document).ready(function () {
		jQuery.ajax({
			type: "Post",
			dataType: "json",
			url: my.url,
			data: { action: "mwc_verificar_recaptcha", arguments: recaptcha },
			success: function (response) {
				MWCanales_Debug({validoCaptcha: response});
			}
		})
	})
}

function EliminarAlerta() {
	MostrarBoton();
	if (ori == "Avada") {
		document.getElementById('fusion-notices-1').children[0].style.display = "none";
		document.getElementById('fusion-notices-1').children[1].style.display = "none";
	}
	else if (ori === 'Divi') {
		jQuery('.onlife-form-notices').find('.onlife-form-inner-column').css({display: 'none'});
	}
	else {
		document.getElementsByClassName("wpcf7-response-output")[0].style.display = "none";
	}
}

function MostrarExito(mensaje) {
	EliminarAlerta();
	var textbox = document.getElementById("rut");
	textbox.scrollIntoView(); 

	if (ori == "Avada") {
		document.getElementById('fusion-notices-1').children[0].style = "background-color: #f9f9fb;color: rgb(18, 184, 120);border-color: rgb(18, 184, 120);border-width: 1px;display: block";
		document.getElementsByClassName("fusion-alert-content")[0].innerText = mensaje;
	}
	else if (ori === 'Divi') {
		jQuery('.onlife-form-notices').find('.onlife-form-inner-column').css({backgroundColor: '#f9f9fb', color: 'rgb(18, 184, 120)', borderColor: 'rgb(18, 184, 120)', borderWidth: '1px', display: 'block'});
		jQuery('.onlife-form-notices').find('.onlife-form-notice-message').text(mensaje);
	}
	else {
		document.getElementsByClassName("wpcf7-response-output")[0].innerText = mensaje;
		document.getElementsByClassName("wpcf7-response-output")[0].style = "background-color: #f9f9fb;color: rgb(18, 184, 120);border-color: rgb(18, 184, 120);border-width: 1px;display: block";
	}
}

function MostrarAlerta(mensaje) {
	var textbox = document.getElementById("rut");
	textbox.focus();
	textbox.scrollIntoView(); textbox

	EliminarAlerta();
	OcultarBoton();

	
	if (ori == "Avada") {
		document.getElementsByClassName("fusion-alert-content")[1].innerText = mensaje;
		document.getElementById('fusion-notices-1').children[1].style = "background-color: #f9f9fb;color: rgb(219, 75, 104);border-color: rgb(219, 75, 104);border-width: 1px;display: block";
	}
	else if (ori === 'Divi') {
		 
		jQuery('.onlife-form-notices').find('.onlife-form-inner-column').css({backgroundColor: '#f9f9fb', color: 'rgb(219, 75, 104)', borderColor: 'rgb(219, 75, 104)', borderWidth: '1px', display: 'block'});
		jQuery('.onlife-form-notices').find('.onlife-form-notice-message').text(mensaje);
		
	}
	else {
		document.getElementsByClassName("wpcf7-response-output")[0].innerText = mensaje;
		document.getElementsByClassName("wpcf7-response-output")[0].style = "background-color: #f9f9fb;color: rgb(219, 75, 104);border-color: rgb(219, 75, 104);border-width: 1px;display: block";
	}
}

function BloquearNombre() {
	document.getElementById('nombre').readOnly = true;
	document.getElementById('nombre').style = "background-color: #bcbcbc;";
	jQuery("#nombre").prop("title", "");
}

function DesBloquearNombre() {
	document.getElementById('nombre').readOnly = false;
	document.getElementById('nombre').style = "background-color: #f9f9fb;";
	jQuery("#nombre").prop("title", "Completa este campo.");
}

function BloquearPrefijo() {
	document.getElementById('569').readOnly = true;
	document.getElementById('569').style = "background-color: #bcbcbc;";
	jQuery("#569").prop("title", "");
}

function LimpiarFormulario() {
	if (ori == "Avada") {
		document.getElementById(idFormulario).firstElementChild.reset();
	}
	else if (ori === 'Divi') {
		document.getElementById(idFormulario).reset();
		jQuery('.onlife-form-wrapper .error').removeClass('error');
		jQuery('.onlife-form-wrapper input, .onlife-form-wrapper select').css({borderColor: '', color: ''})
	}
	else {
		document.getElementById(idFormulario).reset();
	}
}

function OcultarBoton() {
	if (ori == "Avada") {
		document.querySelector('.form-form-submit').style.display = "none";
	}
	else if (ori === 'Divi') {
		document.querySelector('.onlife-form-enviar').style.display = "none";
	}
	else {
		document.querySelector('.wpcf7-submit').style.display = "none";
	}
}

function MostrarBoton() {
	if (ori == "Avada") {
		document.querySelector('.form-form-submit').style.display = "";
	}
	else if (ori === 'Divi') {
		document.querySelector('.onlife-form-enviar').style.display = "";
	}
	else {
		document.querySelector('.wpcf7-submit').style.display = "";
	}
}

if (ori == "Avada") {

}
else if (ori === 'Divi') {
		
}
else {

}