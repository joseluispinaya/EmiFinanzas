
let tablaData;
let tablaDataDetalle;
let idEditar = 0;

$(document).ready(function () {
    listaAsignaciones();
});

function listaAsignaciones() {
    if ($.fn.DataTable.isDataTable("#tbAsignaciones")) {
        $("#tbAsignaciones").DataTable().destroy();
        $('#tbAsignaciones tbody').empty();
    }

    tablaData = $("#tbAsignaciones").DataTable({
        responsive: true,
        "ajax": {
            "url": 'ListaAsignaciones.aspx/ListaAsignacioneDocente',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return "{}"; // Como tu WebMethod usa Sesión, no necesita parámetros de entrada
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    MostrarToastZer(json.d.Mensaje, "Atención", "error");
                    return [];
                }
            }
        },
        "columns": [
            // 1. Columna Oculta: IdAsignacion
            { "data": "IdAsignacion", "visible": false, "searchable": false },

            // 2. Columna Docente: Foto + Nombre + CI
            {
                "data": "NomDocente",
                "className": "align-middle text-left",
                "render": function (data, type, row) {
                    let imagen = row.ImagenUrl ? row.ImagenUrl : '../images/sinImagen.png';
                    return `
                        <div class="d-flex align-items-center">
                            <img src="${imagen}" class="rounded-circle mr-3 shadow-sm" style="width: 45px; height: 45px; object-fit: cover; border: 2px solid #004F9F;">
                            <div>
                                <div class="font-weight-bold text-dark" style="font-size: 0.95rem;">${data}</div>
                                <div class="small text-muted"><i class="fas fa-id-card mr-1 text-primary"></i>CI: ${row.CI} | Cel: ${row.Celular}</div>
                            </div>
                        </div>`;
                }
            },

            // 3. Columna Académica: Nombre de la Materia + Badges (Tipo y Grupo)
            {
                "data": "NombreMateria",
                "className": "align-middle text-left",
                "render": function (data, type, row) {
                    // Si es laboratorio lo pintamos de celeste (info), si no, de azul oscuro (primary)
                    let badgeTipo = row.IdTipoAsignacion === 3 ? 'badge-info text-dark' : 'badge-primary';
                    return `
                        <div class="font-weight-bold text-dark mb-1" style="font-size: 0.9rem;">Materia: ${data}</div>
                        <span class="badge ${badgeTipo} p-1 mr-1 shadow-sm"><i class="fas fa-tag mr-1"></i>${row.NombreTipo}</span>
                        <span class="badge badge-secondary p-1 shadow-sm"><i class="fas fa-users mr-1"></i>Grupo: ${row.NombreGrupo}</span>`;
                }
            },

            // 4. Columna Finanzas: Costo y Horas
            {
                "data": "CostoHora",
                "className": "align-middle text-center",
                "render": function (data, type, row) {
                    return `
                        <div class="font-weight-bold text-success mb-1"><i class="fas fa-dollar-sign mr-1"></i>${data.toFixed(2)} <small class="text-muted">/ Hr</small></div>
                        <div class="small font-weight-bold text-info"><i class="fas fa-clock mr-1"></i>${row.CargaHorariaPeriodo} Hrs Totales</div>`;
                }
            },

            // 5. Columna Botones
            {
                "defaultContent": `
                    <button class="btn btn-outline-primary btn-editar btn-sm shadow-sm mr-1" title="Editar Asignación">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn btn-outline-info btn-horarios btn-sm shadow-sm" title="Ver Horarios Programados">
                        <i class="fas fa-calendar-alt"></i>
                    </button>`,
                "orderable": false,
                "searchable": false,
                "className": "text-center align-middle"
            }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

$('#tbAsignaciones tbody').on('click', '.btn-horarios', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();

    // 1. Llenamos la información del docente y materia en el modal
    $("#lblModalDocente").text(data.NomDocente);
    $("#lblModalMateria").text(data.NombreMateria);

    detalleHorario(data.IdAsignacion);
    // 3. Mostramos el modal
    $("#modalHorarios").modal("show");

});

function detalleHorario(idAsignacion) {
    if ($.fn.DataTable.isDataTable("#tbDetalleHorarios")) {
        $("#tbDetalleHorarios").DataTable().destroy();
        $('#tbDetalleHorarios tbody').empty();
    }

    var request = {
        idAsignacion: parseInt(idAsignacion)
    };

    tablaDataDetalle = $("#tbDetalleHorarios").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'ListaAsignaciones.aspx/ObtenerDetalleHorarios',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                return JSON.stringify(request);
            },
            "dataSrc": function (json) {
                if (json.d.Estado) {
                    return json.d.Data;
                } else {
                    return [];
                }
            }
        },
        "columns": [
            //{ "data": "IdDia", "visible": false, "searchable": false },
            { "data": "Dia", "className": "align-middle text-muted" },
            { "data": "HoraInicio", "className": "align-middle" },
            { "data": "HoraFin", "className": "align-middle" }
        ],
        "order": [],
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        }
    });
}

let listaHorarios = [];

$('#tbAsignaciones tbody').on('click', '.btn-pruebas', function () {

    let fila = $(this).closest('tr');
    if (fila.hasClass('child')) {
        fila = fila.prev();
    }
    let data = tablaData.row(fila).data();

    // 1. Llenamos la información del docente y materia en el modal
    $("#lblModalDocente").text(data.NomDocente);
    $("#lblModalMateria").text(data.NombreMateria);

    // 2. Ponemos la tabla en estado "Cargando"
    $("#tbDetalleHorarios tbody").html('<tr><td colspan="3" class="py-3"><i class="fas fa-spinner fa-spin text-primary fa-2x"></i><br><span class="text-muted mt-2 d-block">Obteniendo horarios...</span></td></tr>');

    // 3. Mostramos el modal
    $("#modalHorarios").modal("show");

    // 4. Hacemos la petición AJAX
    $.ajax({
        type: "POST",
        url: "ListaAsignaciones.aspx/ObtenerDetalleHorarios",
        data: JSON.stringify({ idAsignacion: data.IdAsignacion }), // Enviamos el ID
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {
                const lista = response.d.Data;
                listaHorarios = lista;
                let htmlRows = '';

                // Si la base de datos devuelve una lista vacía
                if (lista.length === 0) {
                    htmlRows = '<tr><td colspan="3" class="text-danger py-3 font-weight-bold">No existen horarios registrados.</td></tr>';
                } else {
                    // Iteramos la lista y armamos las filas
                    $.each(lista, function (i, item) {
                        htmlRows += `
                            <tr>
                                <td class="font-weight-bold text-dark align-middle">${item.Dia}</td>
                                <td><span class="badge badge-info text-dark p-2" style="font-size:0.9rem;">${item.HoraInicio}</span></td>
                                <td><span class="badge badge-info text-dark p-2" style="font-size:0.9rem;">${item.HoraFin}</span></td>
                            </tr>
                        `;
                    });
                }

                // Inyectamos el HTML en la tabla del Modal
                $("#tbDetalleHorarios tbody").html(htmlRows);

            } else {
                $("#tbDetalleHorarios tbody").html(`<tr><td colspan="3" class="text-danger py-3">${response.d.Mensaje}</td></tr>`);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#tbDetalleHorarios tbody").html('<tr><td colspan="3" class="text-danger py-3">Error de conexión al obtener los horarios.</td></tr>');
        }
    });

});

$("#btnRegistro").on("click", function () {

    $("#modalHorarios").modal("show");
})