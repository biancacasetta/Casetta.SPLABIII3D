import { generarTabla, iniciarSpinner } from "./tabla.js";
import { Anuncio_Mascota } from "./anuncioMascota.js";
import { validarCampoVacio, validarSubmitVacio, validarMaxCaracteres, validarPrecio } from "./validaciones.js";
import { obtenerMascotas, altaMascota, modificarMascota, bajaMascota } from "./axios.js";

const $formMascota = document.forms[0];
const $tablaDinamica = document.getElementById("tabla-dinamica");
const $url =  "http://localhost:3000/anuncios";
let $mascotas = [];
const $controles = $formMascota.elements;

obtenerMascotas($url).then((data) => {
  $mascotas = data;
  actualizarTabla($mascotas);
});

mostrarBotones();

document.addEventListener("click", (e) => {
  if (e.target.matches("td")) {
    let id = parseInt(e.target.parentElement.dataset.id);
    cargarFormulario($mascotas.find((item) => item.id === id));
    mostrarBotones();
  } else if (e.target.matches("#btnEliminar")) {
    bajaMascota(parseInt($formMascota.txtId.value), $url);
    $formMascota.reset();
    mostrarBotones();
  } else if (e.target.matches("#btnCancelar")) {
    $formMascota.reset();
    mostrarBotones();
  }
});

$formMascota.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (validarSubmitVacio($controles))
  {
    const {
      txtId,
      txtTitulo,
      txtDescripcion,
      rdoAnimal,
      nbrPrecio,
      txtRaza,
      fechaNac,
      slcVacuna,
    } = $formMascota;

    const mascota = new Anuncio_Mascota(
      parseInt(txtId.value),
      txtTitulo.value,
      txtDescripcion.value,
      rdoAnimal.value,
      parseFloat(nbrPrecio.value),
      txtRaza.value,
      fechaNac.value,
      slcVacuna.value
    );

    if (txtId.value === "")
    {
        mascota.id = Date.now();
        await altaMascota(mascota, $url);
    }
    else
    {
      await modificarMascota(mascota, $url);
    }

    $formMascota.reset();
    mostrarBotones();
  }
});

export function actualizarTabla($datos) {
  while ($tablaDinamica.hasChildNodes()) {
    $tablaDinamica.removeChild($tablaDinamica.firstChild);
  }

  if ($datos.length > 0) {
    iniciarSpinner();
    $datos.sort(ordenarPorTitulo);
    const $tabla = generarTabla($datos);
    $tablaDinamica.insertAdjacentElement("afterbegin", $tabla);
  }
  else
  {
    iniciarSpinner();
    const $h4 = document.createElement("h4");
    $h4.textContent = "No hay mascotas para mostrar.";
    $tablaDinamica.insertAdjacentElement("afterbegin", $h4);
  }
}

function ordenarPorTitulo(a, b) {
  if (a.titulo < b.titulo) {
    return -1;
  } else if (a.titulo > b.titulo) {
    return 1;
  } else {
    return 0;
  }
}

function cargarFormulario(mascota) {
  const {
    txtId,
    txtTitulo,
    txtDescripcion,
    rdoAnimal,
    nbrPrecio,
    txtRaza,
    fechaNac,
    slcVacuna,
  } = $formMascota;

  txtId.value = mascota.id;
  txtTitulo.value = mascota.titulo;
  txtDescripcion.value = mascota.descripcion;
  rdoAnimal.value = mascota.animal;
  nbrPrecio.value = mascota.precio;
  txtRaza.value = mascota.raza;
  fechaNac.value = mascota.fechaNacimiento;
  slcVacuna.value = mascota.vacunas;
}

function mostrarBotones() {
  const { txtId } = $formMascota;
  const $btnAgregarModificar = document.getElementById("btnAltaModificar");
  const $btnEliminar = document.getElementById("btnEliminar");
  const $btnCancelar = document.getElementById("btnCancelar");

  if (txtId.value == "") {
    $btnAgregarModificar.setAttribute("value", "Agregar");
    $btnEliminar.classList.add("hidden");
    $btnCancelar.classList.add("hidden");
  } else {
    $btnAgregarModificar.setAttribute("value", "Modificar");
    $btnEliminar.classList.remove("hidden");
    $btnCancelar.classList.remove("hidden");
  }
}

for (let i = 0; i < $controles.length; i++) {
  const control = $controles.item(i);

  if(control.matches("input"))
  {
    control.addEventListener("blur", validarCampoVacio);

    if(control.classList.contains("titulo") || control.classList.contains("descripcion"))
    {
      control.addEventListener("blur", validarMaxCaracteres);
    }

    if(control.matches("[type=number]"))
    {
      control.addEventListener("blur", validarPrecio);
    }
  }
  
};

const $combobox = document.getElementById("cmbFiltro");

$combobox.addEventListener("change", (e) => {
  e.preventDefault();
  let mascotasFiltradas = $mascotas;
  let $txtPromedio = document.getElementById("txtPromedio");
  let promedio = 0;
  if($combobox.value != "TODOS")
  {
    mascotasFiltradas = $mascotas.filter(mascota => $combobox.value == mascota.animal);
    promedio = mascotasFiltradas.reduce((pre, actual) => pre + parseInt(actual.precio), 0) / mascotasFiltradas.length;
  }
  else
  {
    promedio = mascotasFiltradas.reduce((pre, actual) => pre + parseInt(actual.precio), 0) / mascotasFiltradas.length;
  }
  iniciarSpinner();
  actualizarTabla(mascotasFiltradas);
  setTimeout(() => {$txtPromedio.setAttribute("value", promedio.toFixed(2));}, 3000);
});

const $detalles = document.getElementById("detalles");
let $checkboxes = document.getElementsByClassName("cbx-detalles");
$checkboxes = Array.from($checkboxes);

$detalles.addEventListener("change", (e) => {
  e.preventDefault();
  let tildados = $checkboxes.filter(checkbox => checkbox.checked);
  
  let mascotasDetalles = $mascotas.map((mascota) => {
    let datosAMostrar = [];
    
    for (const key in mascota) {
      for(let i = 0; i < tildados.length; i++)
      {
        if(key == 'id' || key == tildados[i].value)
        {
          datosAMostrar[tildados[i].value] = mascota[key];
        }
      }
    }
    return datosAMostrar;
  });
  iniciarSpinner();
  actualizarTabla(mascotasDetalles);
});
