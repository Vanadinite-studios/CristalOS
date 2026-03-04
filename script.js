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
    apps: {
        finder: { name: "Finder", icon: "https://img.icons8.com/fluency/200/mac-os.png" },
        safari: { name: "Safari", icon: "https://img.icons8.com/fluency/200/safari.png" },
        settings: { name: "Paramètres", icon: "https://img.icons8.com/fluency/200/settings.png" },
        appstore: { name: "App Store", icon: "https://img.icons8.com/fluency/200/apple-app-store.png" },
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

        // Apple menu click for About
        document.querySelector('.apple-logo').onclick = () => this.launchApp('about');
    },

    updateClock() {
        const clockElement = document.getElementById('top-bar-clock');
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        clockElement.textContent = now.toLocaleDateString('fr-FR', options);
    },

    initDock() {
        const dockItems = document.querySelectorAll('.dock-item');
        dockItems.forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.getAttribute('data-app');
                this.launchApp(appId);
            });
        });
    },

    launchApp(appId) {
        console.log(`Lancement de l'application: ${appId}`);
        this.createWindow(appId);
    },

    createWindow(appId) {
        const app = this.apps[appId] || { name: appId.charAt(0).toUpperCase() + appId.slice(1) };
        const container = document.getElementById('window-container');
        const windowEl = document.createElement('div');
        windowEl.className = 'window';

        // Centering logic roughly
        const offset = document.querySelectorAll('.window').length * 30;
        windowEl.style.top = (100 + offset) + 'px';
        windowEl.style.left = (200 + offset) + 'px';
        windowEl.style.width = appId === 'about' ? '350px' : '700px';
        windowEl.style.height = appId === 'about' ? '450px' : '500px';

        windowEl.innerHTML = `
            <div class="window-header">
                <div class="traffic-lights">
                    <div class="light red"></div>
                    <div class="light yellow"></div>
                    <div class="light green"></div>
                </div>
                <div class="window-title">${app.name}</div>
            </div>
            <div class="window-content">
                ${this.getAppContent(appId)}
            </div>
        `;

        container.appendChild(windowEl);
        this.makeDraggable(windowEl);

        // Close event
        windowEl.querySelector('.red').onclick = (e) => {
            e.stopPropagation();
            windowEl.remove();
        };

        // Focus on click
        windowEl.addEventListener('mousedown', () => {
            this.focusWindow(windowEl);
        });

        this.focusWindow(windowEl);
    },

    focusWindow(el) {
        const allWindows = document.querySelectorAll('.window');
        allWindows.forEach(w => w.style.zIndex = "10");
        el.style.zIndex = "100";

        // Update top bar to show active app
        const appTitle = el.querySelector('.window-title').textContent;
        document.querySelector('.active-app-name').textContent = appTitle;
    },

    getAppContent(appId) {
        switch (appId) {
            case 'about':
                return `
                    <div class="about-mac">
                        <img src="https://img.icons8.com/fluency/1000/apple-app-store.png" alt="Apple" style="width: 120px;">
                        <h2>CristalOS</h2>
                        <p>Version 1.0 (Bêta)</p>
                        <hr>
                        <div class="info-row"><span>Processeur</span> <span>3,2 GHz Apple M2</span></div>
                        <div class="info-row"><span>Mémoire</span> <span>16 Go RAM</span></div>
                        <div class="info-row"><span>Graphisme</span> <span>Cristal Engine Core</span></div>
                        <button class="mac-btn" style="margin-top: 20px;">Rapport Système</button>
                    </div>
                `;
            case 'finder':
                return `
                    <div class="finder-content">
                        <div class="sidebar">
                            <p>Favoris</p>
                            <ul>
                                <li class="active">Bureau</li>
                                <li>Documents</li>
                                <li>Téléchargements</li>
                                <li>Images</li>
                            </ul>
                        </div>
                        <div class="file-grid">
                            <div class="file-item"><img src="https://img.icons8.com/fluency/100/folder-invoices.png"><span>Documents</span></div>
                            <div class="file-item"><img src="https://img.icons8.com/fluency/100/image.png"><span>Photo.jpg</span></div>
                            <div class="file-item"><img src="https://img.icons8.com/fluency/100/pdf.png"><span>CV.pdf</span></div>
                        </div>
                    </div>
                `;
            case 'safari':
                return `
                    <div class="safari-content">
                        <div class="url-bar">
                            <input type="text" value="https://www.google.com" readonly>
                        </div>
                        <iframe src="https://www.bing.com" style="width: 100%; height: calc(100% - 40px); border: none; border-radius: 8px;"></iframe>
                    </div>
                `;
            case 'settings':
                return `
                    <div class="settings-content">
                        <h3>Fond d'écran</h3>
                        <div class="wallpaper-grid">
                            ${this.wallpapers.map((url, i) => `
                                <div class="wp-thumb" style="background-image: url('${url}')" onclick="document.getElementById('desktop-wrapper').style.backgroundImage = 'url(${url})'"></div>
                            `).join('')}
                        </div>
                    </div>
                `;
            default:
                return `<p>Contenu de l'application ${appId} en cours de développement...</p>`;
        }
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
        el.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    },

    makeDraggable(el) {
        const header = el.querySelector('.window-header');
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Bring to front
            const allWindows = document.querySelectorAll('.window');
            allWindows.forEach(w => w.style.zIndex = "10");
            el.style.zIndex = "100";
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    OS.init();
    OS.initDesktopIcons();
});
