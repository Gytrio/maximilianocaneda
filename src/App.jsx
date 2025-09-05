import React from "react";

import fotoPerfil from "./assets/Foto-Perfil.jpg";
import lost        from "./assets/LostSwampFoto.png";
import steven      from "./assets/WhereisStevenFoto.jpg";
import catacombs   from "./assets/Catacombsofempire.jpg";

export default function App() {
    return (
        <>
            <header>
                <h3>C:\Users\Maximiliano-Caneda&gt;</h3>
                <h3><div className="animated flash">_</div></h3>
            </header>

            {/* Sección UNO (presentación) */}
            <section className="uno">
                <div className="caja-central">
                    <div className="caja-cara">
                        <img className="cara" src={fotoPerfil} alt="Maximiliano Caneda" />
                    </div>
                    <div className="caja-presentacion">
                        <div>
                            <h1>Bienvenidos</h1>
                            <p className="presentacion">
                                Soy Maxi, aquí tengo muestras de los distintos proyectos que tuve el placer de trabajar a lo largo de los años.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección DOS (sobre mí + aptitudes) */}
            <section className="dos">
                <h2>Sobre mí</h2>
                <p>
                    Buenas, soy Maximiliano Caneda, nacido el 5 de abril del 2000 y actualmente viviendo en Lanús, Buenos Aires.
                    <br />
                    Fui a ingles desde los 7 años hasta los 18, esto me permitió obtener vocabulario y reglas gramaticales tanto general como específico de programación y videojuegos.
                    <br /><br />
                    Me recibí de técnico en programación en el EEST N° 5 "John F. Kennedy" y actualmente soy estudiante de la carrera Licenciatura en desarrollo de simuladores y videojuegos de la Universidad Abierta Interamericana,
                    solo me falta rendir dos exámenes finales y defender mi tesis “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.
                    <br /><br />
                    Trabaje en la empresa de juegos NFT{" "}
                    <a href="https://twitter.com/ProjInterlude" target="_blank" rel="noreferrer">Interlude.gg</a> durante 1 año y realice 3 juegos para esta empresa.
                    Como estudiante tuve el placer de participar en el{" "}
                    <a href="https://live-games.itch.io/" target="_blank" rel="noreferrer">Laboratorio de videojuegos experimentales de la UAI</a> de manera activa durante la pandemia entre 2020 e inicios de 2021.
                </p>

                <h2>Aptitudes</h2>
                <p>Estas son algunas de las tecnologías las cuales uso.</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png" className="tech" alt="C#" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Official_unity_logo.png" className="tech" alt="Unity" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/1280px-Git-logo.svg.png" className="tech" alt="Git" />
                    </div>
                </div>

                <h3>Conocimientos secundarios</h3>
                <p>Estas son algunas de las tecnologías de las que tengo conocimientos</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/fr/3/33/Reaper_Logo.png" className="tech" alt="Reaper" />
                        <img src="https://www.seekpng.com/png/full/222-2229726_intro-to-html-css-html-css-icon.png" className="tech" alt="HTML/CSS" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" className="tech" alt="React" />
                        <img src="https://download.blender.org/branding/community/blender_community_badge_white.png" className="tech" alt="Blender" />
                    </div>
                </div>
            </section>

            {/* Sección TRES (proyectos) */}
            <section className="tres">
                <h2>Mis Proyectos</h2>
                <div className="proyectos">
                    <div className="card">
                        <a href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">
                            <h3>Lost in the Swamp</h3>
                            <img src={lost} alt="Lost in the Swamp" />
                        </a>
                        <p>Juego realizado en 4 días como prueba de ingreso, la a única condición es que la duracion ronde los 10 minutos de gameplay.</p>
                        <a href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">Ver</a>
                    </div>

                    <div className="card">
                        <a href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">
                            <h3>Where is Steven?</h3>
                            <img src={steven} alt="Where is Steven?" />
                        </a>
                        <p>Desarrollado con libertad creativa en 10 días para la empresa Interlude.</p>
                        <a href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">Ver</a>
                    </div>

                    <div className="card">
                        <a href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">
                            <h3>Catacombs of Empire</h3>
                            <img src={catacombs} alt="Catacombs of Empire" />
                        </a>
                        <p>Tuve libertad creativa para crear el juego base y los 4 mapas extras. Desarrollado para la empresa Interlude.</p>
                        <a href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">Ver</a>
                    </div>
                </div>
            </section>

            <footer>
                <h2>Contactame</h2>
                <div className="contacto">
                    <hr />
                    <a href="https://www.linkedin.com/in/maximiliano-caneda" target="_blank" rel="noreferrer">
                        <img src="https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" className="red-social" alt="LinkedIn" />
                    </a>
                    <hr />
                </div>
                <h2>maxicaneda45@gmail.com</h2>
            </footer>
        </>
    );
}
