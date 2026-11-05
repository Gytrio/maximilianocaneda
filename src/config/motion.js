/* Duraciones (ms) y curvas compartidas: unica fuente de verdad para hooks (timers) y componentes (CSS). */
export const MOTION = {
    dotPop: 520, // pop elastico de cada dot
    dotStagger: 70, // retraso entre dots
    labelIn: 380, // fade + desplazamiento de cada texto del timeline
    labelStagger: 90, // retraso entre textos
    expand: 420, // dot clickeado creciendo hasta cubrir el area blanca
    whiteout: 180, // fundido del circulo negro a blanco
    contentIn: 520, // entrada del contenido desde el borde de la franja negra
    typeMax: 450, // tope de duracion de la escritura de cualquier nodo de texto
    typeMsPerChar: 4, // velocidad base de escritura (ms por caracter)
    closing: 260, // salida del contenido al volver al timeline
    dotRipple: 700, // ola circular que genera la "gota" al caer sobre cada dot
    arrivalShake: 200, // va y ven leve de la identidad, superpuesto al rebote
    arrivalBounce: 440, // rebote de la identidad al llegar a la franja
    tiltMax: 7, // inclinacion maxima (deg) de foto y texto mientras viajan
    stripGlitch: 950, // barrido del glitch sobre la franja, desde la foto hasta abajo
    stripBurstWait: [4000, 11000], // espera al azar entre rafagas espontaneas del glitch de la franja
    stripBurstScale: [0.55, 1], // duracion al azar de cada rafaga, como fraccion de stripGlitch
    dropInterval: 1000, // intervalo constante del goteo detras de la foto
    hoverScale: 240, // agrandado de la identidad al hacer hover
    branchGlitch: 800, // glitch de ramificacion que sigue a la foto al hacer click
    rootGlitch: 7000, // latido de la raiz circular del hero (los otros ritmos derivan de este)
    exitScale: 0.6, // factor de duracion de la salida inversa del timeline (sobre las duraciones de entrada)
    slotReserve: 300, // transicion del recorte de la foto cuando aparece el timeline de la franja
    stripFrameDraw: 760, // dibujo del marco redondeado del timeline de la franja, de arriba hacia abajo
};

export const EASING = {
    pop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    abrupt: "cubic-bezier(0.7, 0, 0.84, 0)",
    out: "cubic-bezier(0.16, 1, 0.3, 1)",
};

/* Umbrales de progreso de scroll (0..1) con histeresis para no parpadear entre fases. */
export const SCROLL = {
    enterSplit: 0.98,
    leaveSplit: 0.9,
    /* El timeline empieza a aparecer en el tramo final del recorrido, sin esperar la llegada (ni el rebote). */
    revealTimeline: 0.88,
    hideTimeline: 0.8,
};

/* Navegacion por scroll en cadena: del timeline a la primera seccion y de una seccion a la siguiente. */
export const SCROLL_CHAIN = {
    threshold: 90, // delta acumulado (px) sobre el borde del panel antes de pasar de seccion
    cooldown: 520, // espera minima entre dos pasos de la cadena
    edgeSlack: 2, // tolerancia (px) para considerar el panel al tope o al final
};
