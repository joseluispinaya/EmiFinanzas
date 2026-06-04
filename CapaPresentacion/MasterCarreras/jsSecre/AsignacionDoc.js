
let tablaData;
let idEditar = 0;

$(document).ready(function () {
    cargarBuscadorDocentes();
    cargarMateriasPorCarrera();
    cargarGestiones();
    cargarTipoAsignacion();
    cargarGrupos();

    // 1. EVENTO PARA AGREGAR HORARIO A LA TABLA
    $("#btnAgregarHorario").on("click", function () {

        let idDia = $("#cboDia").val();
        let nombreDia = $("#cboDia option:selected").text();
        let horaInicio = $("#txtHoraInicio").val();
        let horaFin = $("#txtHoraFin").val();

        // VALIDACIÓN 1: Que las horas no estén vacías
        if (horaInicio === "" || horaFin === "") {
            MostrarToastZer("Debe seleccionar la Hora de Inicio y la Hora de Fin.", "Atención", "warning");
            return;
        }

        // VALIDACIÓN 2: Que la hora de inicio no sea mayor que la de fin
        if (horaInicio >= horaFin) {
            MostrarToastZer("La Hora de Inicio debe ser menor a la Hora de Fin.", "Error lógico", "error");
            return;
        }

        // VALIDACIÓN 3: Que el día no esté ya agregado en la tabla
        let existeDia = false;
        $("#tbHorarios tbody tr").each(function () {
            // Buscamos si algún tr tiene el mismo IdDia guardado en un atributo data
            if ($(this).attr("data-iddia") === idDia) {
                existeDia = true;
            }
        });

        if (existeDia) {
            MostrarToastZer(`Ya existe un horario programado para el día ${nombreDia}.`, "Día duplicado", "warning");
            return;
        }

        // Si todo está bien, ocultamos el mensaje de "No hay horarios"
        $("#trVacioHorarios").hide();

        // Armamos la fila HTML. Usamos atributos 'data-*' para extraer los valores fácilmente al guardar
        let filaHtml = `
            <tr data-iddia="${idDia}" data-horainicio="${horaInicio}" data-horafin="${horaFin}">
                <td class="font-weight-bold text-dark align-middle">${nombreDia}</td>
                <td><span class="badge badge-primary p-2" style="font-size: 0.9rem;">${horaInicio}</span></td>
                <td><span class="badge badge-primary p-2" style="font-size: 0.9rem;">${horaFin}</span></td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-danger btn-quitar-horario shadow-sm" title="Quitar día">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;

        // Agregamos la fila a la tabla
        $("#tbHorarios tbody").append(filaHtml);

        // Habilitamos el botón principal de guardar porque ya hay datos
        $("#btnGuardarRegistro").prop("disabled", false);

        // Limpiamos los inputs de hora para el siguiente registro
        $("#txtHoraInicio").val("");
        $("#txtHoraFin").val("");
    });


    // 2. EVENTO PARA QUITAR HORARIO DE LA TABLA (Debe ser evento delegado)
    // Se usa 'on("click", ".clase", ...)' porque los botones se crean dinámicamente después de cargar la página
    $("#tbHorarios tbody").on("click", ".btn-quitar-horario", function () {

        // Buscamos el 'tr' padre del botón presionado y lo eliminamos
        $(this).closest("tr").remove();

        // Verificamos cuántas filas quedan (descontando la fila vacía oculta)
        let nroFilas = $("#tbHorarios tbody tr").length;

        // Si solo queda 1 fila (que es el trVacioHorarios que está oculto), significa que la tabla quedó vacía
        if (nroFilas === 1) {
            $("#trVacioHorarios").show(); // Volvemos a mostrar el mensaje
            $("#btnGuardarRegistro").prop("disabled", true); // Bloqueamos el botón de guardar
        }
    });

});

//let listaHorarios = [];

//$("#tbHorarios tbody tr").each(function () {
//    if ($(this).attr("id") !== "trVacioHorarios") {
//        listaHorarios.push({
//            IdDia: parseInt($(this).attr("data-iddia")),
//            HoraInicio: $(this).attr("data-horainicio"),
//            HoraFin: $(this).attr("data-horafin")
//        });
//    }
//});

function cargarGrupos() {

    $("#cboGrupos").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaGrupos",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Grupo</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGrupo}">${row.NombreGrupo}</option>`;
                });

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

    $("#cboGestion").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaGestiones",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Gestion</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdGestion}">${row.NombreGestion}</option>`;
                });

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

function cargarTipoAsignacion() {

    $("#cboTipoAsignacion").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "AsignacionDocente.aspx/ListaTipoAsignacion",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Tipo de Asignación</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdTipoAsignacion}">${row.NombreTipo}</option>`;
                });
                $("#cboTipoAsignacion").html(opcionesHTML);

            } else {
                $("#cboTipoAsignacion").html('<option value="">Error al cargar</option>');
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.status + " \n" + xhr.responseText, "\n" + thrownError);
            $("#cboTipoAsignacion").html('<option value="">Error de conexión</option>');
        }
    });
}

function cargarMateriasPorCarrera() {

    $("#cboMaterias").html('<option value="">Cargando...</option>');

    $.ajax({
        url: "PanelMaterias.aspx/MateriasPorCarreraYSemestreAsi",
        type: "POST",
        data: "{}",
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success: function (response) {
            if (response.d.Estado) {

                let opcionesHTML = '<option value="">Seleccione Materia</option>';

                $.each(response.d.Data, function (i, row) {
                    opcionesHTML += `<option value="${row.IdMateria}">${row.NombreMateria}</option>`;
                });

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

$("#btnGuardarRegistro").on("click", function () {

    $('#btnGuardarRegistro').prop('disabled', true);

    // 1. OBTENEMOS TODOS LOS VALORES MAESTROS
    let idGestion = $("#cboGestion").val();
    let idMateria = $("#cboMaterias").val();
    let idGrupo = $("#cboGrupos").val();
    let idTipoAsignacion = $("#cboTipoAsignacion").val();
    let costoHora = $("#txtCostoHora").val().trim();
    let idDocente = $("#txtIdDocente").val().trim();
    let cargaHoraria = $("#txtCargaHoraria").val().trim();

    // 2. VALIDACIONES MAESTRAS
    if (idDocente === "0" || idDocente === "") {
        MostrarToastZer("Por favor, Seleccione un Docente", "Atención", "warning");
        habilitarBoton();
        return;
    }
    if (idGestion === "") {
        MostrarToastZer("Por favor, seleccione una Gestión.", "Atención", "warning");
        habilitarBoton();
        return;
    }
    if (idMateria === "") {
        MostrarToastZer("Por favor, seleccione una Materia.", "Atención", "warning");
        habilitarBoton();
        return;
    }
    if (idTipoAsignacion === "") {
        MostrarToastZer("Por favor, seleccione un Tipo de Asignación.", "Atención", "warning");
        habilitarBoton();
        return;
    }
    if (idGrupo === "") {
        MostrarToastZer("Por favor, seleccione un Grupo.", "Atención", "warning");
        habilitarBoton();
        return;
    }
    if (costoHora === "" || isNaN(costoHora) || parseFloat(costoHora) <= 0) {
        MostrarToastZer("El Costo Hr. debe ser un número válido mayor a 0.", "Atención", "warning");
        $("#txtCostoHora").focus();
        habilitarBoton();
        return;
    }
    if (cargaHoraria === "" || isNaN(cargaHoraria) || parseInt(cargaHoraria) <= 0) {
        MostrarToastZer("La Carga Hrs. debe ser un número válido mayor a 0.", "Atención", "warning");
        $("#txtCargaHoraria").focus();
        habilitarBoton();
        return;
    }

    // 3. EXTRAER Y VALIDAR LA LISTA DE HORARIOS (El Detalle)
    // Inicializamos un arreglo vacío cada vez que hacen clic en Guardar
    let listaHorariosExtraidos = [];

    // Recorremos las filas de la tabla
    $("#tbHorarios tbody tr").each(function () {
        // Ignoramos la fila vacía por defecto
        if ($(this).attr("id") !== "trVacioHorarios") {
            listaHorariosExtraidos.push({
                IdDia: parseInt($(this).attr("data-iddia")),
                HoraInicio: $(this).attr("data-horainicio"),
                HoraFin: $(this).attr("data-horafin")
            });
        }
    });

    // Validación Crítica: No podemos enviar una asignación sin horarios
    if (listaHorariosExtraidos.length === 0) {
        MostrarToastZer("Debe agregar al menos un horario de clases a la tabla.", "Sin Horarios", "warning");
        habilitarBoton();
        return;
    }

    // 4. PREPARAMOS EL OBJETO MAESTRO
    const objetoMaestro = {
        IdDocente: parseInt(idDocente),
        IdMateria: parseInt(idMateria),
        IdGestion: parseInt(idGestion),
        IdGrupo: parseInt(idGrupo),
        IdTipoAsignacion: parseInt(idTipoAsignacion),
        CostoHora: parseFloat(costoHora),
        CargaHorariaPeriodo: parseInt(cargaHoraria)
    };

    // 5. ENVIAR A SERVIDOR (AJAX)
    $("#loadinzero").LoadingOverlay("show"); // Bloqueamos la tarjeta

    $.ajax({
        type: "POST",
        url: "AsignacionDocente.aspx/RegistroAsignacion",

        // ¡LA MAGIA AQUÍ! Enviamos el objeto maestro y la lista como espera tu DTO en C#
        data: JSON.stringify({ objeto: objetoMaestro, listaHorarios: listaHorariosExtraidos }),

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $("#loadinzero").LoadingOverlay("hide"); // Desbloqueamos la tarjeta

            // Usamos tu función personalizada para alertas
            AlertaTimerTipo(
                response.d.Estado ? '¡Excelente!' : 'Atención',
                response.d.Mensaje,
                response.d.Valor
            );

            if (response.d.Estado) {
                // Redireccionamos a la lista después de 2 segundos para que se vea el SweetAlert
                setTimeout(function () {
                    window.location.href = "ListaAsignaciones.aspx";
                }, 2200);
            }
        },
        error: function (xhr) {
            console.log(xhr.responseText);
            $("#loadinzero").LoadingOverlay("hide");
            MostrarToastZer("No se pudo conectar con el servidor.", "Error Crítico", "error");
        },
        complete: function () {
            habilitarBoton();
        }
    });

});

// Función de ayuda para evitar repetir código
function habilitarBoton() {
    $('#btnGuardarRegistro').prop('disabled', false);
}

// fin