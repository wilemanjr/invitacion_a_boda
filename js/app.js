const formulario = document.getElementById('formulario');
const registro = document.getElementById('registro');
const exito = document.getElementById('exito');
const rechazo = document.getElementById('rechazo');
const btnCambiarRespuestaSi = document.getElementById('btnCambiarRespuestaSi');
const btnCambiarRespuestaNo = document.getElementById('btnCambiarRespuestaNo');
const estadoEnvio = document.getElementById('estadoEnvio');
const introGate = document.getElementById('introGate');
const btnAbrirInvitacion = document.getElementById('btnAbrirInvitacion');

const ls = localStorage;
const API_URL = 'https://script.google.com/macros/s/AKfycbyUqM0X8VB6fIOhQJTlAImJvJPvcB9QMf-dkFwZppnMqGepnkbTTegVSSFRY6tILb6urA/exec';
const REGISTROS_KEY = "invitadosRegistrados";
const INTRO_KEY = "introInvitacionVista";

const aceptoInvitacion = () => {
    registro.classList.remove('activo');
    exito.classList.add('activo');
}

const rechazoInvitacion = () => {
    registro.classList.remove('activo');
    rechazo.classList.add('activo');
}

const resetearRegistro = () => {
    ls.removeItem("invitacion");
    exito.classList.remove('activo');
    rechazo.classList.remove('activo');
    registro.classList.add('activo');
}

// const buttonSi = document.querySelector("#buttonSi");
const buttonSi = document.querySelector("#buttonSi");
const buttonNo = document.querySelector("#buttonNo");

const cambiarEstadoEnvio = (enviando) => {
    buttonSi.disabled = enviando;
    buttonNo.disabled = enviando;
    estadoEnvio.style.display = enviando ? "block" : "none";
}

const normalizarTexto = (texto) => (texto || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const obtenerClaveInvitado = () => {
    const nombre = normalizarTexto(formulario.nombre.value);
    const apellido = normalizarTexto(formulario.apellido.value);
    return `${nombre} ${apellido}`.trim();
}

const invitadoYaRegistrado = (claveInvitado) => {
    const lista = JSON.parse(ls.getItem(REGISTROS_KEY) || "[]");
    return lista.includes(claveInvitado);
}

const guardarInvitadoRegistrado = (claveInvitado) => {
    const lista = JSON.parse(ls.getItem(REGISTROS_KEY) || "[]");
    if (!lista.includes(claveInvitado)) {
        lista.push(claveInvitado);
        ls.setItem(REGISTROS_KEY, JSON.stringify(lista));
    }
}




formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    const claveInvitado = obtenerClaveInvitado();
    if (invitadoYaRegistrado(claveInvitado)) {
        const confirmarActualizacion = confirm("Este invitado ya tiene un registro. ¿Deseas actualizar su respuesta?");
        if (!confirmarActualizacion) return;
    }
    cambiarEstadoEnvio(true);
    var nombreCompl = formulario.nombre.value +" "+ formulario.apellido.value;
    let guardadoOK = false;
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
                "Nombre": nombreCompl,
                "Comentario": formulario.comentario.value,
                "Confirmacion": "Sí asistiré"
            })
        });
        guardadoOK = true;
    } catch (error) {
        console.log(error);
    }
    cambiarEstadoEnvio(false);
    if (!guardadoOK) {
        alert("No se pudo guardar tu confirmación. Intenta nuevamente en unos segundos.");
        return;
    }
    guardarInvitadoRegistrado(claveInvitado);
    ls.setItem("invitacion", "si")
    // acepto la invitacion
    aceptoInvitacion();

});


// NO ASISTIRA

buttonNo.addEventListener("click", async (e) => {
    e.preventDefault();
    const claveInvitado = obtenerClaveInvitado();
    if (invitadoYaRegistrado(claveInvitado)) {
        const confirmarActualizacion = confirm("Este invitado ya tiene un registro. ¿Deseas actualizar su respuesta?");
        if (!confirmarActualizacion) return;
    }
    cambiarEstadoEnvio(true);
    var nombreCompl = formulario.nombre.value +" "+ formulario.apellido.value;
    let guardadoOK = false;
    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8'
            },
            body: JSON.stringify({
                "Nombre": nombreCompl,
                "Comentario": formulario.comentario.value,
                "Confirmacion": "No asistiré"
            })
        });
        guardadoOK = true;
    } catch (error) {
        console.log(error);
    }
    cambiarEstadoEnvio(false);
    if (!guardadoOK) {
        alert("No se pudo guardar tu respuesta. Intenta nuevamente en unos segundos.");
        return;
    }
    guardarInvitadoRegistrado(claveInvitado);
    ls.setItem("invitacion", "no")
    // RECHAZO INVITACION
    rechazoInvitacion();
});

btnCambiarRespuestaSi?.addEventListener("click", (e) => {
    e.preventDefault();
    resetearRegistro();
});

btnCambiarRespuestaNo?.addEventListener("click", (e) => {
    e.preventDefault();
    resetearRegistro();
});

// CARGAR EL INICIO
document.addEventListener("DOMContentLoaded", (e) => {
    if (ls.getItem("invitacion") === "si") aceptoInvitacion();
    if (ls.getItem("invitacion") === "no") rechazoInvitacion();

    const introYaVista = ls.getItem(INTRO_KEY) === "si";
    if (!introYaVista && introGate) {
        introGate.classList.add("activo");
        document.body.style.overflow = "hidden";
    }
});

btnAbrirInvitacion?.addEventListener("click", () => {
    if (!introGate) return;
    btnAbrirInvitacion.classList.add("quebrado");
    setTimeout(() => {
        introGate.classList.add("abriendo");
    }, 360);
    setTimeout(() => {
        introGate.classList.add("ocultando");
    }, 1010);
    setTimeout(() => {
        introGate.classList.remove("activo", "abriendo", "ocultando");
        btnAbrirInvitacion.classList.remove("quebrado");
        document.body.style.overflow = "";
        ls.setItem(INTRO_KEY, "si");
    }, 1810);
});
