
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    cargarBuscadorDocentes();
    cargarMateriasPorCarrera();
    cargarGestiones();
    cargarGrupos();
});

function cargarGrupos() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboGrupos").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaGrupos",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">Seleccione Grupo</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGrupo}">${row.NombreGrupo}</option>`;
                });

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGrupo}">${row.NombreGrupo}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboGrupos").html(opcionesHTML);

            } else {
                $("#cboGrupos").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboGrupos").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarGestiones() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboGestion").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaGestiones",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">Seleccione Gestion</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                });

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboGestion").html(opcionesHTML);

            } else {
                $("#cboGestion").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboGestion").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarMateriasPorCarrera() {

    // Mostramos un texto de "Cargando..." mientras esperamos la respuesta
    $("#cboMaterias").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "PanelMaterias.aspx/MateriasPorCarreraYSemestreAsi",
        type: "POST",
        data: "{}", // <-- Mejor compatibilidad con WebMethods sin parámetros
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                // 1. Empezamos con la opción por defecto
                let opcionesHTML = '<option value="">Seleccione Materia</option>';

                // 2. Concatenamos todas las opciones en la variable (en memoria)
                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdMateria}">${row.NombreMateria}</option>`;
                });

                //$.each(response.d.Data, function (i, row) {
                //    if (row.Estado === true) {
                //        opcionesHTML += `<option value="${row.IdGradoAcademico}">${row.Nombre}</option>`;
                //    }
                //});

                // 3. Inyectamos todo al DOM en un solo movimiento
                $("#cboMaterias").html(opcionesHTML);

            } else {
                $("#cboMaterias").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboMaterias").html('<option value="">Error de conexión</option>');
        }
    });
}

// inicio configuracion docentes
function cargarBuscadorDocentes() {
    $("#cboBuscarDocente").select2({
        ajax: {
            url: "/PanelDocentes.aspx/FiltroDocentes",
            dataType: 'json',
            type: "POST",
            contentType: "application/json; charset=utf-8",
            delay: 250,
            data: function (params) {
                return JSON.stringify({ busqueda: params.term });
            },
            processResults: function (data) {
                return {
                    results: data.d.Data.map((item) => ({
                        id: item.IdDocente,
                        text: item.Nombres + ' ' + item.Apellidos,
                        nroCi: item.CI,
                        celular: item.Celular,
                        imagen: item.ImagenUrl,
                        dataCompleta: item
                    }))
                };
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            }
        },
        language: "es",
        placeholder: 'Buscar por Nombre o CI...',
        minimumInputLength: 3,
        templateResult: formatoResultadosDocente
    });
}

function formatoResultadosDocente(data) {
    if (data.loading) return data.text;

    var imagenMostrar = data.imagen ? data.imagen : '../images/sinImagen.png';

    var contenedor = $(
        `<div class="d-flex align-items-center">
            <img src="${imagenMostrar}" style="height:40px; width:40px; margin-right:10px; border-radius:50%; object-fit:cover;"/>
            <div>
                <div style="font-weight: bold;">${data.text}</div>
                <div style="font-size: 0.85em; color: #666;">CI: ${data.nroCi} | Cel: ${data.celular}</div>
            </div>
         </div>`
    );

    return contenedor;
}

$("#cboBuscarDocente").on("select2:select", function (e) {
    const data = e.params.data;
    $("#txtIdDocente").val(data.id);
    $("#lblNombres").text("Doc: " + data.text);
    $("#lblDatos").text("Nro CI: " + data.nroCi);
    $("#imgDoce").attr("src", data.imagen || "../images/sinImagen.png");
    $("#cboBuscarDocente").val(null).trigger("change");
});

// fin