
//Guardar en el Cache Dinamico
function actualizadynamicCache(dynamicCache, req, res){

    //Verifico si la respuesta es ok
    if (res.ok){
    return caches.open(dynamicCache).then( cache =>{
        cache.put(req, res.clone());
        return res.clone();
    });
    } else {
    return res;
    }

}