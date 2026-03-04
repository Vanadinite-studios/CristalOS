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
        finder: { name: "Finder", icon: "finder_icon.png" },
        safari: { name: "Safari", icon: "safari_icon.png" },
        settings: { name: "Paramètres", icon: "settings_icon.png" }
    },

    init() {
        this.updateClock();
        setInterval(() => this.updateClock(), 1000);
        this.initDock();
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
        const container = document.getElementById('window-container');
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.style.top = '100px';
        windowEl.style.left = '100px';
        windowEl.style.width = '600px';
        windowEl.style.height = '400px';

        windowEl.innerHTML = `
            <div class="window-header">
                <div class="traffic-lights">
                    <div class="light red"></div>
                    <div class="light yellow"></div>
                    <div class="light green"></div>
                </div>
                <div class="window-title">${appId.charAt(0).toUpperCase() + appId.slice(1)}</div>
            </div>
            <div class="window-content">
                Contenu de l'application ${appId}...
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

    initDesktopIcons() {
        const desktop = document.getElementById('desktop');
        const icons = [
            { id: 'finder', name: 'Macintosh HD', icon: 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Finder_Icon_macOS_Big_Sur.png' },
            { id: 'trash', name: 'Corbeille', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Trash_Can_macOS_Big_Sur.png' }
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
