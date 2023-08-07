const generarId= () =>{

    const random = Math.random().toString(32).substring(2);
    const fecha = Date.now().toString(32);

    const id = random+fecha;
    return id;

}

export default generarId;