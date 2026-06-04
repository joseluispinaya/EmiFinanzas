
$(document).ready(function () {

    const usuarioLog = sessionStorage.getItem('usuaEmi');

    if (!usuarioLog) {
        window.location.replace('../Login.aspx');
        return;
    }

    try {
        const usua = JSON.parse(usuarioLog);

        $("#imgUsuarioMe").attr("src", usua.FotoUrl || "/images/sinImagen.png");
        $("#imageUserMe").attr("src", usua.FotoUrl || "/images/sinImagen.png");
        $("#nombreusuariome").text(usua.Apellidos);
        $("#rolusuariome").text(usua.NombreRol);
        $("#rolnomme").text(usua.Nombres);

    } catch (error) {
        console.error("Error leyendo sesión", error);
        sessionStorage.clear();
        window.location.replace('../Login.aspx');
    }

});

// Asumiendo que tu botón de salir tiene el id "btnCerrarSesion" NombreRol
$("#btnCerrarSesion").on("click", function (e) {
    e.preventDefault();

    // Opcional: Un SweetAlert preguntando si está seguro (Mejora de UX)
    swal({
        title: "¿Cerrar Sesión?",
        text: "¿Estás seguro que deseas salir del sistema?",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Sí, salir",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false
    }, function () {

        // Llamada AJAX a tu WebMethod perfecto
        $.ajax({
            type: "POST",
            url: "PanelInicio.aspx/CerrarSesion", // O la ruta donde lo hayas puesto
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.d.Estado) {

                    // ==========================================
                    // EL PASO CRÍTICO: Limpiar el Storage del navegador
                    // ==========================================
                    //sessionStorage.removeItem('usuaEmi'); 
                    sessionStorage.clear();
                    // O si quieres borrar todo: sessionStorage.clear();

                    // Redirigimos al Login
                    //window.location.href = "Login.aspx";
                    window.location.replace('../Login.aspx');
                } else {
                    swal("Error", "No se pudo cerrar la sesión correctamente.", "error");
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
                swal("Error", "Fallo de comunicación con el servidor.", "error");
            }
        });
    });
});

function MostrarAlerta(titulo, mensaje, tipo) {
    // Si no se envía un tipo, por defecto será 'success'
    swal(titulo, mensaje, tipo || "success");
}

// Ejemplo de uso:
// MostrarAlerta("¡Guardado!", "El registro se guardó correctamente.", "success");

function MostrarAlertaZeo(titulo, mensaje, tipo) {
    let btnClass = 'btn-default';

    // Asignamos el color del botón según el estilo de Color Admin
    if (tipo === 'success') btnClass = 'btn-success';
    else if (tipo === 'warning') btnClass = 'btn-warning';
    else if (tipo === 'error') btnClass = 'btn-danger';
    else if (tipo === 'info') btnClass = 'btn-info';

    // swal(titulo, mensaje, tipo || "success");

    swal({
        title: titulo,
        text: mensaje,
        type: tipo,
        //showCancelButton: true,
        confirmButtonClass: btnClass,
        confirmButtonText: "Aceptar"
    });
}

function AlertaTimerTipo(titulo, mensaje, tipo, timer) {
    swal({
        title: titulo,
        text: mensaje,
        type: tipo,
        // Si le pasas un valor a timer lo usa; si no, usa 2000 por defecto
        timer: timer || 2000,
        showConfirmButton: false
    });
}

function MostrarConfirmacion(titulo, mensaje, textoConfirmar, callbackConfirmar) {
    swal({
        title: titulo,
        text: mensaje,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-warning",
        confirmButtonText: textoConfirmar || "Sí, continuar",
        cancelButtonText: "Cancelar",
        closeOnConfirm: false // Mantiene la alerta abierta para mostrar otra encima si es necesario
    }, function () {
        // Ejecuta la lógica que enviaste como parámetro
        if (typeof callbackConfirmar === "function") {
            callbackConfirmar();
        }
    });
}

// Ejemplo de uso:
// MostrarConfirmacion("¿Eliminar registro?", "Esta acción no se puede deshacer.", "Sí, eliminar", function() {
//     // Aquí pones tu llamada AJAX o lógica de eliminación
//     MostrarAlerta("¡Eliminado!", "El archivo ha sido borrado.", "success");
// });
function MostrarDecision(titulo, mensaje, textoConfirmar, textoCancelar, callbackConfirmar, callbackCancelar) {
    swal({
        title: titulo,
        text: mensaje,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: textoConfirmar || "Sí",
        cancelButtonText: textoCancelar || "No",
        closeOnConfirm: false,
        closeOnCancel: false
    }, function (isConfirm) {
        if (isConfirm) {
            if (typeof callbackConfirmar === "function") {
                callbackConfirmar();
            }
        } else {
            if (typeof callbackCancelar === "function") {
                callbackCancelar();
            }
        }
    });
}

// Ejemplo de uso:
// MostrarDecision("¿Desea enviar los datos?", "Se registrará en la base de datos.", "Sí, enviar", "No, revisar",
//     function() {
//         MostrarAlerta("¡Enviado!", "Datos guardados.", "success");
//     },
//     function() {
//         MostrarAlerta("Cancelado", "Puedes seguir editando.", "error");
//     }
// );

function MostrarAlertaTimer(titulo, mensaje, timer) {
    swal({
        title: titulo,
        text: mensaje,
        type: "success",
        // Si le pasas un valor a timer lo usa; si no, usa 2000 por defecto
        timer: timer || 2000,
        showConfirmButton: false
    });
}
//MostrarAlertaTimer("¡Guardado automático!", "Tus respuestas se han guardado.", 3000);
//MostrarAlertaTimer("Cargando...", "Preparando tu test vocacional.");


function MostrarToastZer(mensaje, titulo, tipo) {

    toastr.options = {
        "closeButton": true,          // Muestra una "X" para cerrar manualmente
        "progressBar": true,          // Muestra una barra de tiempo agotándose
        "positionClass": "toast-top-right", // Posición en pantalla
        "preventDuplicates": false,   // Evita que el mismo mensaje se repita varias veces seguidas
        "timeOut": "3000",            // Tiempo que dura en pantalla (3 segundos)
        "extendedTimeOut": "1000"     // Tiempo extra si el usuario pasa el mouse por encima
    };

    // Si no se envía un tipo, por defecto será 'info'
    let tipoToast = tipo || "info";

    // Ejecutamos la función dinámica de toastr
    toastr[tipoToast](mensaje, titulo || "");
}

function MostrarToastFijo(mensaje, titulo) {
    // Le pasamos configuraciones específicas solo a esta alerta
    toastr.error(mensaje, titulo || "Error Crítico", {
        "timeOut": "0",             // 0 significa que no se cierra solo
        "extendedTimeOut": "0",     // No se cierra al quitar el mouse
        "closeButton": true,        // Obligamos a que tenga el botón de cerrar
        "progressBar": false        // Quitamos la barra porque el tiempo es infinito
    });
}

// fin codigo