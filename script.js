import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyB45NZk28XuLTO5jk1vv5w7vyqd4JKh0SQ",
    authDomain: "cristalos.firebaseapp.com",
    projectId: "cristalos",
    storageBucket: "cristalos.firebasestorage.app",
    messagingSenderId: "501151376740",
    appId: "1:501151376740:web:c9e089ccc134550c1c8671",
    measurementId: "G-JF2VLG5VJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// OS Module
const OS = {
    fs: {
        root: {
            "Documents": {
                type: "dir", children: {
                    "hello.txt": { type: "file", content: "Bienvenue sur CristalOS !" },
                    "notes.txt": { type: "file", content: "Faire les courses." }
                }
            },
            "Images": {
                type: "dir", children: {
                    "vacances.jpg": { type: "file", content: "[Image Data]" }
                }
            },
            "Système": { type: "dir", children: {} }
        },
        currentPath: ["root"]
    },

    apps: {
        finder: { name: "Finder", icon: "https://img.icons8.com/fluency/200/mac-os.png" },
        safari: { name: "Safari", icon: "https://img.icons8.com/fluency/200/safari.png" },
        settings: { name: "Paramètres", icon: "https://img.icons8.com/fluency/200/settings.png" },
        appstore: { name: "App Store", icon: "https://img.icons8.com/fluency/200/apple-app-store.png" },
        terminal: { name: "Terminal", icon: "https://img.icons8.com/fluency/200/terminal.png" },
        textedit: { name: "TextEdit", icon: "https://img.icons8.com/fluency/200/edit-file.png" },
        about: { name: "À propos", icon: "https://img.icons8.com/fluency/200/info.png" }
    },

    wallpapers: [
        'https://images.unsplash.com/photo-1620121692029-d088224efc74?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
        'https://images.unsplash.com/photo-1477346611705-65d1883cee1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80',
        'https://images.unsplash.com/photo-1493246507139-91e8bef99c02?ixlib=rb-4.0.3&auto=format&fit=crop&w=2560&q=80'
    ],

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.initDock();
        this.initLogin();

        // System logo click for About
        const systemLogo = document.getElementById('system-logo');
        if (systemLogo) systemLogo.onclick = () => this.launchApp('about');

        document.addEventListener('contextmenu', e => e.preventDefault());
    },

    // LOGIN SYSTEM
    initLogin() {
        const passwordInput = document.getElementById('login-password');
        const submitBtn = document.getElementById('login-submit');
        const loginScreen = document.getElementById('login-screen');
        const desktopWrapper = document.getElementById('desktop-wrapper');

        const attemptLogin = () => {
            if (passwordInput.value === "1234") {
                loginScreen.style.opacity = "0";
                loginScreen.style.transform = "scale(1.1)";
                setTimeout(() => {
                    loginScreen.style.display = "none";
                    desktopWrapper.style.display = "flex";
                }, 500);
            } else {
                this.showLoginError("Mot de passe incorrect");
            }
        };

        submitBtn.onclick = attemptLogin;
        passwordInput.onkeydown = (e) => { if (e.key === 'Enter') attemptLogin(); };
    },

    showLoginError(msg) {
        let errorEl = document.querySelector('.login-error');
        if (!errorEl) {
            errorEl = document.createElement('p');
            errorEl.className = 'login-error';
            document.querySelector('.login-content').appendChild(errorEl);
        }
        errorEl.textContent = msg;
        setTimeout(() => errorEl.remove(), 2000);
    },

    updateClock() {
        const clockElement = document.getElementById('top-bar-clock');
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        clockElement.textContent = now.toLocaleDateString('fr-FR', options);
    },

    initDock() {
        document.querySelectorAll('.dock-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.getAttribute('data-app');
                if (appId) this.launchApp(appId);
            });
        });
    },

    launchApp(appId, params = {}) {
        this.createWindow(appId, params);
    },

    createWindow(appId, params = {}) {
        const app = this.apps[appId] || { name: appId };
        const container = document.getElementById('window-container');
        const windowId = `win-${Date.now()}`;
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.id = windowId;

        const offset = document.querySelectorAll('.window').length * 25;
        windowEl.style.top = (80 + offset) + 'px';
        windowEl.style.left = (150 + offset) + 'px';
        windowEl.style.width = appId === 'about' ? '350px' : (appId === 'terminal' ? '600px' : '800px');
        windowEl.style.height = appId === 'about' ? '450px' : (appId === 'terminal' ? '400px' : (appId === 'settings' ? '450px' : '550px'));

        windowEl.innerHTML = `
            <div class="window-header">
                <div class="traffic-lights">
                    <div class="light red" onclick="document.getElementById('${windowId}').remove()"></div>
                    <div class="light yellow"></div>
                    <div class="light green"></div>
                </div>
                <div class="window-title">${app.name} ${params.fileName ? '- ' + params.fileName : ''}</div>
            </div>
            <div class="window-content" id="content-${windowId}">
                ${this.getAppContent(appId, params, windowId)}
            </div>
        `;

        container.appendChild(windowEl);
        this.makeDraggable(windowEl);
        windowEl.addEventListener('mousedown', () => this.focusWindow(windowEl));
        this.focusWindow(windowEl);

        if (appId === 'terminal') this.initTerminal(windowId);
    },

    focusWindow(el) {
        document.querySelectorAll('.window').forEach(w => w.style.zIndex = "10");
        el.style.zIndex = "100";
        const titleSpan = el.querySelector('.window-title').textContent;
        document.querySelector('.active-app-name').textContent = titleSpan.split(' - ')[0];
    },

    getAppContent(appId, params, winId) {
        switch (appId) {
            case 'about':
                return `
                    <div class="about-mac">
                        <img src="https://img.icons8.com/fluency/1000/crystal.png" alt="Cristal" style="width: 120px;">
                        <h2>CristalOS</h2>
                        <p>Version 2.5 (Émeraude)</p>
                        <hr>
                        <div class="info-row"><span>Processeur</span> <span>Cristal Quantum M3</span></div>
                        <div class="info-row"><span>Mémoire</span> <span>64 Go RAM</span></div>
                        <div class="info-row"><span>Système</span> <span>64-bit Core</span></div>
                        <button class="mac-btn">Vérifier les mises à jour</button>
                    </div>
                `;
            case 'finder':
                return this.renderFinderContent();
            case 'safari':
                return `
                    <div class="safari-content">
                        <div class="url-bar">
                            <input type="text" value="https://www.google.com" onkeydown="if(event.key==='Enter') this.parentElement.nextElementSibling.src=this.value.startsWith('http') ? this.value : 'https://' + this.value">
                        </div>
                        <iframe src="https://www.bing.com" style="flex-grow:1; border:none; background:white;"></iframe>
                    </div>
                `;
            case 'terminal':
                return `
                    <div class="terminal-content" id="term-out-${winId}">
                        <div class="terminal-line">CristalOS Terminal v2.0</div>
                        <div class="terminal-line">Tapez 'help' pour les commandes.</div>
                        <div class="terminal-input-line">
                            <span>root@cristal:~$</span>
                            <input type="text" class="terminal-input" id="term-in-${winId}" autocomplete="off">
                        </div>
                    </div>
                `;
            case 'textedit':
                return `
                    <div class="textedit-content">
                        <div class="textedit-toolbar">
                            <button class="mac-btn" onclick="OS.saveFile('${winId}', '${params.fileName || 'document.txt'}')">Enregistrer</button>
                        </div>
                        <textarea class="textedit-textarea" id="text-${winId}" placeholder="Commencez à écrire...">${params.content || ""}</textarea>
                    </div>
                `;
            case 'settings':
                return `
                    <div class="settings-content">
                        <h3>Personnalisation</h3>
                        <p style="font-size: 13px; color: #666; margin-bottom: 15px;">Choisissez votre fond d'écran préféré.</p>
                        <div class="wallpaper-grid">
                            ${this.wallpapers.map(url => `
                                <div class="wp-thumb" style="background-image: url('${url}')" onclick="document.getElementById('desktop-wrapper').style.backgroundImage = 'url(${url})'"></div>
                            `).join('')}
                        </div>
                    </div>
                `;
            case 'appstore':
                return `
                    <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center;">
                        <img src="https://img.icons8.com/fluency/200/apple-app-store.png" style="width:100px; margin-bottom:20px;">
                        <h3>App Store</h3>
                        <p>Connexion au serveur Cristal Store...</p>
                        <div style="width:200px; height:4px; background:#ddd; border-radius:2px; margin-top:20px; overflow:hidden;">
                            <div style="width:60%; height:100%; background:#007aff; animation: progress 2s infinite linear;"></div>
                        </div>
                    </div>
                    <style>@keyframes progress { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }</style>
                `;
            default:
                return `<p>L'application ${appId} est en cours de maintenance.</p>`;
        }
    },

    renderFinderContent() {
        const folders = Object.keys(this.fs.root);
        return `
            <div class="finder-content">
                <div class="sidebar">
                    <p>Emplacements</p>
                    <ul>
                        <li class="active">Macintosh HD</li>
                        <li>Documents</li>
                        <li>Applications</li>
                        <li>Réseau</li>
                    </ul>
                </div>
                <div class="file-grid">
                    ${folders.map(f => `
                        <div class="file-item" ondblclick="OS.openFolder('${f}')">
                            <img src="https://img.icons8.com/fluency/100/folder-invoices.png">
                            <span>${f}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    openFolder(folder) {
        if (folder === "Documents") {
            const files = this.fs.root["Documents"].children;
            const grid = document.querySelector('.file-grid');
            if (grid) {
                grid.innerHTML = Object.keys(files).map(name => `
                    <div class="file-item" ondblclick="OS.launchApp('textedit', {fileName: '${name}', content: '${files[name].content}'})">
                        <img src="https://img.icons8.com/fluency/100/txt.png">
                        <span>${name}</span>
                    </div>
                `).join('');
            }
        }
    },

    initTerminal(winId) {
        const input = document.getElementById(`term-in-${winId}`);
        const output = document.getElementById(`term-out-${winId}`);
        if (!input) return;

        input.focus();
        input.onkeydown = (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                this.executeCommand(cmd, output, winId);
                input.value = "";
            }
        };
    },

    executeCommand(cmd, output, winId) {
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.innerHTML = `<span style="color:#00ff00">root@cristal:~$</span> ${cmd}`;
        output.insertBefore(line, output.lastElementChild);

        const response = document.createElement('div');
        response.className = 'terminal-line';
        const cleanCmd = cmd.toLowerCase().trim();

        if (cleanCmd === 'help') response.textContent = "Commandes: help, ls, clear, date, whoami, neofetch, exit";
        else if (cleanCmd === 'ls') response.textContent = "Documents/  Images/  Système/  Applications/";
        else if (cleanCmd === 'clear') {
            output.querySelectorAll('.terminal-line').forEach(l => l.remove());
            return;
        }
        else if (cleanCmd === 'date') response.textContent = new Date().toLocaleString();
        else if (cleanCmd === 'whoami') response.textContent = "root";
        else if (cleanCmd === 'neofetch') {
            response.innerHTML = `<pre style="color: #ff00ff">
   ____      _     _       _ 
  / ___|_ __(_)___| |_ ___| |
 | |   | '__| / __| __/ _ \\ |
 | |___| |  | \\__ \\ ||  __/ |
  \\____|_|  |_|___/\\__\\___|_|
            </pre> <b>OS</b>: CristalOS v2.5<br><b>Host</b>: BrowserVM x86_64<br><b>Shell</b>: CristalShell 1.2<br><b>Branding</b>: Crystal Fluency Edition`;
        }
        else if (cleanCmd === 'exit') {
            document.getElementById(winId).remove();
            return;
        }
        else if (cleanCmd !== "") response.textContent = `sh: command not found: ${cmd}`;

        if (cleanCmd !== "") {
            output.insertBefore(response, output.lastElementChild);
            output.scrollTop = output.scrollHeight;
        }
    },

    saveFile(winId, defaultName) {
        const text = document.getElementById(`text-${winId}`).value;
        const name = prompt("Nom du fichier ?", defaultName);
        if (name) {
            this.fs.root["Documents"].children[name] = { type: "file", content: text };
            alert("Fichier enregistré dans Documents !");
            // Refresh finder if open
            const finder = document.querySelector('.finder-content');
            if (finder) this.openFolder("Documents");
        }
    },

    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            };
        };
    },

    initDesktopIcons() {
        const desktop = document.getElementById('desktop');
        const icons = [
            { id: 'finder', name: 'Macintosh HD', icon: 'https://img.icons8.com/fluency/200/mac-os.png' },
            { id: 'trash', name: 'Corbeille', icon: 'https://img.icons8.com/fluency/200/trash.png' }
        ];

        icons.forEach(iconData => {
            const iconEl = document.createElement('div');
            iconEl.className = 'desktop-icon';
            iconEl.innerHTML = `
                <img src="${iconData.icon}" alt="${iconData.name}">
                <span>${iconData.name}</span>
            `;
            iconEl.ondblclick = () => this.launchApp(iconData.id);
            desktop.appendChild(iconEl);
            this.makeIconDraggable(iconEl);
        });
    },

    makeIconDraggable(el) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        el.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => { document.onmouseup = null; document.onmousemove = null; };
            document.onmousemove = (e) => {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = (el.offsetTop - pos2) + "px";
                el.style.left = (el.offsetLeft - pos1) + "px";
            };
        };
    }
};

document.addEventListener('DOMContentLoaded', () => {
    OS.init();
    OS.initDesktopIcons();
});
