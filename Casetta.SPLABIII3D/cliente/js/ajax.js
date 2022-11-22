import { generarAnuncioMascota } from "./anuncioMascota.js";

export function obtenerMascotas(url)
{
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", () => {
    if (xhr.readyState == 4)
    {
        if (xhr.status >= 200 && xhr.status < 300)
        {
            const data = JSON.parse(xhr.responseText);

            const $anuncios = document.getElementById("anuncios-dinamicos");
            data.sort((a, b) => {
                if (a.titulo < b.titulo) {
                    return -1;
                  } else if (a.titulo > b.titulo) {
                    return 1;
                  } else {
                    return 0;
                  }
            });
            
            data.forEach(item => {
                const articuloMascota = generarAnuncioMascota(item);
                $anuncios.appendChild(articuloMascota);
            });
        }
        else
        {
            console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
        }
    }
    });
    xhr.open("GET", url);
    xhr.send();
};