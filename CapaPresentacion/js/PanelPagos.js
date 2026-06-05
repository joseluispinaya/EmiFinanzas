
let tablaData;
let idEditar = 0;

function ObtenerFecha() {
    const d = new Date();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${d.getFullYear()}`;
}

$(document).ready(function () {

    $("#txtFechaInicio").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFechaFin").datepicker({
        todayHighlight: true,
        language: "es",        // Activa el archivo de idioma que agregaste
        format: "dd/mm/yyyy",   // Define el formato visual de la fecha
        autoclose: true
    });

    $("#txtFechaInicio").val(ObtenerFecha());
    $("#txtFechaFin").val(ObtenerFecha());

    cargarTodasGestiones();
});

function cargarTodasGestiones() {

    let combosGestiones = $("#cboGestionFiltro, #cboGestion");

    // 2. Mostramos el mensaje de carga en todos a la vez
    combosGestiones.html('<option value="">Cargando...</option>');

    $.ajax({
        url: "PanelAsistenciaDiaria.aspx/ListaGestiones",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">-- Seleccione una Gestion --</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                });

                // 3. ¡LA MAGIA! Inyectamos el HTML en los 4 selects al mismo tiempo
                combosGestiones.html(opcionesHTML);

            } else {
                combosGestiones.html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            combosGestiones.html('<option value="">Error de conexión</option>');
        }
    });
}

$("#cboGestionFiltro").on("change", function () {

    // Verificamos si la tabla ya fue inicializada alguna vez
    if ($.fn.DataTable.isDataTable("#tbPeriodos")) {
        // Si ya existe, simplemente le decimos que se recargue. 
        // ¡Automáticamente leerá el nuevo valor del select!
        tablaData.ajax.reload();
    } else {
        // Si es la primera vez que seleccionan algo, dibujamos la tabla
        listaPeriodosPago();
    }

});

// Ya NO recibe parámetro
function listaPeriodosPago() {

    tablaData = $("#tbPeriodos").DataTable({
        responsive: true,
        searching: false,
        info: false,
        "ajax": {
            "url": 'PanelPagos.aspx/ObtenerPeriodosPago',
            "type": "POST",
            "contentType": "application/json; charset=utf-8",
            "dataType": "json",
            "data": function () {
                // ¡LA MAGIA ESTÁ AQUÍ!
                // En vez de usar una variable estática, leemos el select en tiempo real
                let idGestionSeleccionada = $("#cboGestionFiltro").val();

                // Si por algún motivo es nulo o vacío, mandamos 0
                let request = {
                    IdGestion: parseInt(idGestionSeleccionada) || 0
                };
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
            // 1. Columna Oculta: IdPeriodo
            { "data": "IdPeriodo", "visible": false, "searchable": false },

            // 2. Columna Descripción (Con ícono y texto resaltado)
            {
                "data": "Descripcion",
                "className": "align-middle text-left",
                "render": function (data) {
                    return `
                        <div class="font-weight-bold text-dark" style="font-size: 0.95rem;">
                            <i class="fas fa-calendar-alt text-primary mr-2"></i>${data}
                        </div>`;
                }
            },

            // 3. Columna Fecha Inicio (Estilo etiqueta con ícono verde)
            {
                "data": "FechaInicio",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `
                        <span class="badge badge-light border border-secondary text-dark p-2 shadow-sm">
                            <i class="fas fa-hourglass-start text-success mr-1"></i> ${data}
                        </span>`;
                }
            },

            // 4. Columna Fecha Fin (Estilo etiqueta con ícono rojo)
            {
                "data": "FechaFin",
                "className": "text-center align-middle",
                "render": function (data) {
                    return `
                        <span class="badge badge-light border border-secondary text-dark p-2 shadow-sm">
                            <i class="fas fa-hourglass-end text-danger mr-1"></i> ${data}
                        </span>`;
                }
            },

            // 5. Columna Estado (Badges más vivos y con íconos)
            {
                "data": "Estado",
                "className": "text-center align-middle",
                "render": function (data) {
                    // Cambié primary por success para los activos, visualmente es más claro
                    if (data === true) {
                        return '<span class="badge badge-success px-2 py-1 shadow-sm"><i class="fas fa-check-circle mr-1"></i>Activo</span>';
                    } else {
                        return '<span class="badge badge-danger px-2 py-1 shadow-sm"><i class="fas fa-times-circle mr-1"></i>Inactivo</span>';
                    }
                }
            },

            // 6. Columna Opciones (Botones outline limpios y espaciados)
            {
                "defaultContent": `
                    <button class="btn btn-outline-primary btn-editar btn-sm shadow-sm mr-1" title="Editar Periodo">
                        <i class="fas fa-pencil-alt"></i>
                    </button>
                    <button class="btn btn-outline-info btn-detalle btn-sm shadow-sm" title="Ver Detalles de Pago">
                        <i class="fas fa-list-ul"></i>
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

$('#tbPeriodos tbody').on('click', '.btn-editar', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    let data = tablaData.row(fila).data();
    idEditar = data.IdPeriodo;
    $("#txtDescripcion").val(data.Descripcion);
    $("#txtFechaInicio").val(data.FechaInicio);
    $("#txtFechaFin").val(data.FechaFin);
    $("#cboGestion").val(data.IdGestion);
    $("#cboEstado").val(data.Estado ? 1 : 0).prop("disabled", false);

    // Cambiamos el título
    $("#lblTituloModal").text("Editar Periodo de Pago");
    $("#mdData").modal("show");

});

$('#tbPeriodos tbody').on('click', '.btn-detalle', function () {

    let fila = $(this).closest('tr');

    if (fila.hasClass('child')) {
        fila = fila.prev();
    }

    // Obtenemos los datos de la fila
    let data = tablaData.row(fila).data();

    // Transformamos el booleano en un texto amigable
    let estadoTexto = data.Estado ? "✅ ACTIVO" : "❌ INACTIVO";

    // Armamos el texto usando saltos de línea (\n) 
    // Tu sweet-alert.min.js los convertirá en saltos de línea reales (<br>)
    let textoDetalle =
        "Descripción: " + data.Descripcion + "\n\n" +
        "Fecha de Inicio: " + data.FechaInicio + "\n" +
        "Fecha de Fin: " + data.FechaFin + "\n\n" +
        "Estado actual: " + estadoTexto + "\n" +
        "-----------------------------------";

    // Disparamos el modal usando tu imagen personalizada
    swal({
        title: "Detalle del Periodo",
        text: textoDetalle,
        imageUrl: "assets/images/emiss.png",   // ¡Inyectamos tu imagen!
        //customClass: "fondo-personalizado",
        //imageSize: "80x80",
        confirmButtonText: "Entendido",
        confirmButtonColor: "#004F9F"
    });

});

$("#btnNewRegistro").on("click", function () {

    idEditar = 0;
    $("#txtDescripcion").val("");
    $("#txtFechaInicio").val(ObtenerFecha());
    $("#txtFechaFin").val(ObtenerFecha());
    $("#cboGestion").val("");
    $("#cboEstado").val(1).prop("disabled", true);

    // Actualizamos solo el texto del span, manteniendo el ícono intacto
    $("#lblTituloModal").text("Nuevo Periodo de Pago");

    $("#mdData").modal("show");
})

function habilitarBoton() {
    $('#btnGuardarCambios').prop('disabled', false);
}

$("#btnGuardarCambios").on("click", function () {

    // 1. Bloqueo inmediato
    $('#btnGuardarCambios').prop('disabled', true);

    let idGestion = $("#cboGestion").val();

    let fechaInicioStr = $("#txtFechaInicio").val().trim();
    let fechaFinStr = $("#txtFechaFin").val().trim();

    if (fechaInicioStr === "" || fechaFinStr === "") {
        MostrarToastZer("Las fechas son obligatorias.", "Atención", "warning");
        habilitarBoton();
        return;
    }

    // VALIDACIÓN DIRECTA PARA FORMATO "dd/mm/yyyy"
    // =====================================================================
    // Dividimos las cadenas usando la barra '/'
    let partesInicio = fechaInicioStr.split('/');
    let partesFin = fechaFinStr.split('/');

    // Armamos el objeto Date: new Date(Año, Mes (de 0 a 11), Día)
    let fInicio = new Date(partesInicio[2], partesInicio[1] - 1, partesInicio[0]);
    let fFin = new Date(partesFin[2], partesFin[1] - 1, partesFin[0]);

    if (fInicio > fFin) {
        MostrarToastZer("La Fecha de Inicio no puede ser mayor a la Fecha Fin.", "Atención", "warning");
        habilitarBoton();
        return;
    }

    if ($("#txtDescripcion").val().trim() === "") {
        MostrarToastZer("Por favor, ingrese una descripción.", "Atención", "warning");
        $("#txtDescripcion").focus();
        habilitarBoton();
        return;
    }


    if (idGestion === "") {
        MostrarToastZer("Por favor, seleccione una gestión.", "Atención", "warning");
        $("#cboGestion").focus();
        habilitarBoton();
        return;
    }

    const objeto = {
        IdPeriodo: idEditar,
        IdGestion: parseInt(idGestion),
        Descripcion: $("#txtDescripcion").val().trim(),
        FechaInicio: fechaInicioStr,
        FechaFin: fechaFinStr,
        Estado: ($("#cboEstado").val() === "1" ? true : false)
    }

    $("#mdData").find("div.modal-content").LoadingOverlay("show");

    $.ajax({
        type: "POST",
        url: "PanelPagos.aspx/GuardarOrEditPeriodoPago",
        data: JSON.stringify({ objeto: objeto }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");
            AlertaTimerTipo(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                $("#mdData").modal("hide");

                // 1. Asignamos el idGestion al combo filtro
                $("#cboGestionFiltro").val(idGestion);

                // 2. Disparamos el evento 'change' simulando que el usuario hizo clic.
                // Esto ejecutará la validación que tienes arriba (isDataTable) 
                // y recargará o dibujará la tabla según corresponda.
                $("#cboGestionFiltro").trigger("change");

                //if (tablaData) {
                //    tablaData.ajax.reload(null, false);
                //}
                idEditar = 0;
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#mdData").find("div.modal-content").LoadingOverlay("hide");
            MostrarToastZer("¡Atención!", "Error de comunicación con el servidor.", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });

});

// fin