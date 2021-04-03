//imports
importScripts('js/sw-utils.js');


const STATIC_CACHE    = "static-V4";
const DYNAMIC_CACHE   = "dinamyc-V2";
const INMUTABLE_CACHE = "inmutable-V1";


const APP_SHELL = [
    //'/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'

];

const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

//Observo el evento install
self.addEventListener('install', e =>{

    const cacheStatic = caches.open(STATIC_CACHE).then( cache => cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then( cache => cache.addAll(APP_SHELL_INMUTABLE));
    const promesaCaches = Promise.all([cacheStatic,cacheInmutable]);

    //Esperar hasta
    e.waitUntil(promesaCaches);

});


//Observo el evento activate
self.addEventListener('activate', e =>{

    //Obtengo una promesa de los caches existentes
    const respuesta = caches.keys().then( keys => {
        keys.forEach(key =>{
            if(key !== STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
            if(key !== DYNAMIC_CACHE && key.includes('dinamyc')){
                return caches.delete(key);
            }
        });
    });

    //Almacenamos en una variables todas las promesas en un arreglo
    const promesas = Promise.all([respuesta]);

    //Esperar hasta
    e.waitUntil(promesas);

});

//Observo las peticiones fetch
self.addEventListener('fetch', e=>{

    const respuesta = caches.match(e.request).then(  res => {

        if (res){
            return res;
        }else{
             return fetch(e.request).then( newRes =>{
                  return actualizadynamicCache(DYNAMIC_CACHE, e.request, newRes);
             });
        }

    });

    e.respondWith(respuesta);

    //e.waitUntil();
}
);


