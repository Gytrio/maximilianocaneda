import React from "react";

import fotoPerfil from "./assets/Foto-Perfil.jpg";
import lost from "./assets/LostSwampFoto.png";
import steven from "./assets/WhereisStevenFoto.jpg";
import catacombs from "./assets/Catacombsofempire.jpg";

export default function App() {
    return (
        <div className="page">
            <header className="top-bar">
                <div className="brand">
                    <span className="pulse-dot" aria-hidden />
                    <div>
                        <p className="tag">Portfolio.exe</p>
                        <h3>C:\\Users\\Maximiliano-Caneda&gt;</h3>
                    </div>
                </div>
                <nav className="nav-links">
                    <a href="#hero">Inicio</a>
                    <a href="#sobre-mi">Sobre mí</a>
                    <a href="#proyectos">Proyectos</a>
                    <a href="#contacto">Contacto</a>
                </nav>
                <div className="status">
                    RUNNING<div className="animated flash">_</div>
                </div>
            </header>

            <section className="hero" id="hero">
                <div className="grid-overlay" aria-hidden />
                <div className="hero-card">
                    <div className="badge-row">
                        <span className="badge">Unity Dev</span>
                        <span className="badge">Game Designer</span>
                        <span className="badge">Code &amp; Creativity</span>
                    </div>
                    <div className="hero-body">
                        <div className="caja-presentacion">
                            <div className="hero-meta">
                                <div className="caja-cara">
                                    <img className="cara" src={fotoPerfil} alt="Maximiliano Caneda" />
                                </div>
                                <div className="hero-actions">
                                    <div className="cta-row">
                                        <span className="chip">Gameplay prototyping</span>
                                        <span className="chip">Optimización</span>
                                        <span className="chip">Narrativa interactiva</span>
                                    </div>
                                    <div className="cta-row">
                                        <a className="primary-btn" href="#proyectos">Ver proyectos</a>
                                        <a className="ghost-btn" href="#contacto">Hablemos</a>
                                    </div>
                                </div>
                            </div>
                            <div className="hero-copy">
                                <div>
                                    <p className="tag">Unity / C# / Sistemas / UI/UX</p>
                                    <h1>Bienvenidos</h1>
                                    <p className="presentacion">
                                        Soy Maxi, aquí tengo muestras de los distintos proyectos que tuve el placer de trabajar a lo largo de los años. Mi enfoque mezcla diseño narrativo, programación y ritmo de gameplay.
                                    </p>
                                </div>
                                <div className="stats-grid">
                                    <div className="stat">
                                        <span className="stat-number">10+</span>
                                        <span className="stat-label">Prototipos</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">3</span>
                                        <span className="stat-label">Lanzados en NFT</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">4</span>
                                        <span className="stat-label">Años creando</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="code-panel" aria-label="Snippet de presentación">
                            <div className="code-bar">
                                <span className="dot red" />
                                <span className="dot yellow" />
                                <span className="dot green" />
                                <span className="code-title">intro.cs</span>
                            </div>
                            <pre>
                                <code>
                                    {`public class Maxi : UnityDeveloper {
    public string Rol => "Gameplay & Systems";
    public string[] Highlights => {
        "Shooters & puzzles", "UI reactiva", "Narrativa" };
    public void Ready() => Ship();
}`}
                                </code>
                            </pre>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section-panel" id="sobre-mi">
                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
                    <h2>Sobre mí</h2>
                </div>
                <div className="panel-grid">
                    <div className="panel-card">
                        <p className="texto">
                            Buenas, soy Maximiliano Caneda, nacido el 5 de abril del 2000 y actualmente viviendo en Lanús, Buenos Aires. Fui a inglés desde los 7 años hasta los 18, esto me permitió obtener vocabulario y reglas gramaticales tanto general como específico de programación y videojuegos.
                        </p>
                        <p className="texto">
                            Me recibí de técnico en programación en el EEST N° 5 "John F. Kennedy" y actualmente soy estudiante de la carrera Licenciatura en desarrollo de simuladores y videojuegos de la Universidad Abierta Interamericana, solo me falta rendir dos exámenes finales y defender mi tesis “El bajo nivel competitivo genera respuestas emocionales agresivas en jugadores”.
                        </p>
                    </div>
                    <div className="panel-card">
                        <p className="texto">
                            Trabajé en la empresa de juegos NFT{" "}
                            <a href="https://twitter.com/ProjInterlude" target="_blank" rel="noreferrer">Interlude.gg</a> durante 1 año y realicé 3 juegos para esta empresa. Como estudiante, participé activamente en el{" "}
                            <a href="https://live-games.itch.io/" target="_blank" rel="noreferrer">Laboratorio de videojuegos experimentales de la UAI</a> durante la pandemia entre 2020 e inicios de 2021.
                        </p>
                        <div className="timeline">
                            <div className="timeline-item">
                                <span className="pill">2020-2021</span>
                                <span>Laboratorio de videojuegos UAI</span>
                            </div>
                            <div className="timeline-item">
                                <span className="pill">2022</span>
                                <span>Interlude.gg - 3 juegos NFT</span>
                            </div>
                            <div className="timeline-item">
                                <span className="pill">Hoy</span>
                                <span>Lic. desarrollo de simuladores y videojuegos</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
                    <h2>Aptitudes</h2>
                </div>
                <p className="texto">Estas son algunas de las tecnologías las cuales uso.</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png" className="tech" alt="C#" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/8a/Official_unity_logo.png" className="tech" alt="Unity" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Git-logo.svg/1280px-Git-logo.svg.png" className="tech" alt="Git" />
                    </div>
                </div>

                <h3>Conocimientos secundarios</h3>
                <p className="texto">Estas son algunas de las tecnologías de las que tengo conocimientos</p>
                <div className="aptitudes">
                    <div className="tech-list">
                        <img src="https://upload.wikimedia.org/wikipedia/fr/3/33/Reaper_Logo.png" className="tech" alt="Reaper" />
                        <img src="https://www.seekpng.com/png/full/222-2229726_intro-to-html-css-html-css-icon.png" className="tech" alt="HTML/CSS" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/2300px-React-icon.svg.png" className="tech" alt="React" />
                        <img src="https://download.blender.org/branding/community/blender_community_badge_white.png" className="tech" alt="Blender" />
                    </div>
                </div>
            </section>

            <section className="projects" id="proyectos">
                <div className="section-header">
                    <div className="accent-bar" aria-hidden />
                    <h2>Mis Proyectos</h2>
                </div>
                <div className="proyectos">
                    <div className="card">
                        <div className="card-code"># survival • 10 mins • 4 días</div>
                        <a href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">
                            <h3>Lost in the Swamp</h3>
                            <img src={lost} alt="Lost in the Swamp" />
                        </a>
                        <p>Juego realizado en 4 días como prueba de ingreso, la a única condición es que la duracion ronde los 10 minutos de gameplay.</p>
                        <a className="link-button" href="https://youtu.be/kIOqWF8WLMY" target="_blank" rel="noreferrer">Ver gameplay</a>
                    </div>

                    <div className="card">
                        <div className="card-code"># puzzle • 10 días • cliente</div>
                        <a href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">
                            <h3>Where is Steven?</h3>
                            <img src={steven} alt="Where is Steven?" />
                        </a>
                        <p>Desarrollado con libertad creativa en 10 días para la empresa Interlude.</p>
                        <a className="link-button" href="https://youtu.be/6PNvMrnnZ7o" target="_blank" rel="noreferrer">Ver gameplay</a>
                    </div>

                    <div className="card">
                        <div className="card-code"># acción • 4 mapas extra</div>
                        <a href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">
                            <h3>Catacombs of Empire</h3>
                            <img src={catacombs} alt="Catacombs of Empire" />
                        </a>
                        <p>Tuve libertad creativa para crear el juego base y los 4 mapas extras. Desarrollado para la empresa Interlude.</p>
                        <a className="link-button" href="https://youtu.be/4uFiRBiggKE" target="_blank" rel="noreferrer">Ver gameplay</a>
                    </div>
                </div>
            </section>

            <footer id="contacto">
                <h2>Contactame</h2>
                <div className="contacto">
                    <hr />
                    <a href="https://www.linkedin.com/in/maximiliano-caneda" target="_blank" rel="noreferrer">
                        <img src="https://cdn.worldvectorlogo.com/logos/linkedin-icon-2.svg" className="red-social" alt="LinkedIn" />
                    </a>
                    <a href="https://twitter.com/maxi_caneda" target="_blank" rel="noreferrer" className="pill">Twitter / X</a>
                    <a href="mailto:maxicaneda45@gmail.com" className="pill">Email</a>
                    <hr />
                </div>
                <h2>maxicaneda45@gmail.com</h2>
            </footer>
        </div>
    );
}
