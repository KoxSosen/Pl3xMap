import { World } from "./util/World.js";
import { P } from './Pl3xMap.js';

class WorldList {
    constructor(json) {
        this.worlds = new Map();

        for (let i = 0; i < json.length; i++) {
            const world = new World(json[i]);
            this.worlds.set(world.name, world);

            const link = P.createElement("a", world.name, this);
            link.onclick = function () {
                const curWorld = this.parent.curWorld;
                const name = this.id;
                if (curWorld.name == name) {
                    P.centerOn(world.spawn.x, world.spawn.z, world.zoom.def)
                    return;
                }
                P.playerList.clearPlayerMarkers();
                this.parent.loadWorld(name, (world) => {
                    P.centerOn(world.spawn.x, world.spawn.z, world.zoom.def)
                });
            };

            const img = document.createElement("img");
            img.src = this.getIcon(world);

            link.appendChild(img);
            link.appendChild(P.createTextElement("span", world.display_name));

            P.sidebar.worlds.element.appendChild(link);
        }
    }
    getIcon(world) {
        if (world.icon != null && world.icon != "") {
            return `images/icon/${world.icon}.png`;
        }
        switch (world.type) {
            case "nether":
                return "images/icon/red-cube-smol.png";
            case "the_end":
                return "images/icon/purple-cube-smol.png";
            case "normal":
            default:
                return "images/icon/green-cube-smol.png";
        }
    }
    loadWorld(name, callback) {
        // unload current world
        if (this.curWorld != null) {
            this.curWorld.unload();
        }

        // load new world
        const world = this.worlds.get(name);
        this.curWorld = world;
        world.load(callback);
    }
    showWorld(world, callback) {
        if (this.curWorld.name == world) {
            if (callback != null) {
                callback();
            }
            return;
        }
        this.loadWorld(world, callback);
        P.updateBrowserUrl(P.getUrlFromView());
    }
}

export { WorldList };
