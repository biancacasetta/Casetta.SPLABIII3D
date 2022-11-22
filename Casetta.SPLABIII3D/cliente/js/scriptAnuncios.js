import { obtenerMascotas } from "./ajax.js";
import { iniciarSpinner } from "./tabla.js";

const $url =  "http://localhost:3000/anuncios";

obtenerMascotas($url);


