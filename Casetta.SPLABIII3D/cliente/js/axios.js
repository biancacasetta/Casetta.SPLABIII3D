export function obtenerMascotas(url)
{
  return axios(url)
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err.message);
    });
};

export async function altaMascota(nuevaMascota, url)
{
    axios(url, {
        method: "POST",
        headers: {"Content-Type": "application/json", },
        data: JSON.stringify(nuevaMascota),
    })
    .then(({ data }) =>
    {
        console.log(data);
    })
    .catch((err) =>
    {
        console.error(err.message);
    });
};

export async function modificarMascota(mascota, url)
{
    axios(url + `/${mascota.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", },
        data: JSON.stringify(mascota),
    })
    .then(({ data }) =>
    {
        console.log(data);
    })
    .catch((err) => {
      console.error(err);
    });
};

export function bajaMascota(id, url)
{
    axios.delete(url + "/" + id)
    .then((respuesta) =>
    {
        console.log(respuesta.data);
    })
    .catch((err) =>
    {
        console.error(err.message);
    });
};