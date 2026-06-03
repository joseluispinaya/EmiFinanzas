

$('#btnIngresar').on('click', function () {

    $('#btnIngresar').prop('disabled', true);
    let usuario = $('#inputCorreo').val().trim();
    let password = $('#inputPassword').val().trim();

    //VALIDACIONES DE USUARIO
    if (usuario === "" || password === "") {
        swal("Mensaje", "Complete los datos para iniciar sesion", "warning");
        $('#btnIngresar').prop('disabled', false);
        return;
    }

    loginSistema(usuario, password);
})

function loginSistema(usuario, password) {

    $.ajax({
        url: "Login.aspx/InicioSesion",
        type: "POST",
        data: JSON.stringify({ Correo: usuario, Clave: password }),
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        beforeSend: function () {
            $.LoadingOverlay("show");
        },
        success: function (response) {
            $.LoadingOverlay("hide");
            if (response.d.Estado) {

                const usuarioData = response.d.Data;

                sessionStorage.setItem('usuaEmi', JSON.stringify(usuarioData));
                swal({
                    title: "Bienvenido",
                    text: `Hola ${usuarioData.Nombres || "Usuario"} 👋`,
                    type: "success",
                    timer: 2000,
                    showConfirmButton: false
                });

                $("#inputCorreo, #inputPassword").val("");

                setTimeout(() => window.location.href = response.d.Valor, 2200);
            } else {
                swal("Mensaje", response.d.Mensaje, "warning");
                $("#inputCorreo, #inputPassword").val("");
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            $.LoadingOverlay("hide");
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            swal("Error", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            $('#btnIngresar').prop('disabled', false);
        }
    });
}

//finn