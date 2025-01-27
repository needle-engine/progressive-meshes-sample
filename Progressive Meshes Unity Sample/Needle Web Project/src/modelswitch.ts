
import { OrbitControls, SceneSwitcher, WebXRButtonFactory, delay, findObjectOfType, onStart, getIconElement } from "@needle-tools/engine";
import { Mesh } from "three";


onStart(async ctx => {
    // Disable the quicklook button before the first model has been loaded
    const quicklookButton = WebXRButtonFactory.getOrCreate().createQuicklookButton();
    quicklookButton.disabled = true;

    const sceneSwitcher = findObjectOfType(SceneSwitcher);
    const orbitControls = findObjectOfType(OrbitControls);
    
    sceneSwitcher?.addEventListener("loadscene-start", _ => {
        quicklookButton.disabled = true;
    });
    sceneSwitcher?.addEventListener("loadscene-finished", async _loaded => {
        quicklookButton.disabled = false;
        // console.log("Scene loaded", loaded);
        await delay(100);
        applyWireframe();
        if (orbitControls) {
            orbitControls.autoRotate = true;
            orbitControls.fitCamera([sceneSwitcher.gameObject], 1, false);
        }
    });

    let wireframe = false;
    createButtons();

    function createButtons() {
        const button = document.createElement("button");
        button.setAttribute("priority", "100");
        button.innerText = "Next Model";
        button.style.cssText = "font-weight: bold";
        button.appendChild(getIconElement("arrow_right_alt"));
        button.addEventListener("click", () => { sceneSwitcher?.selectNext() });
        ctx.menu.appendChild(button);

        const label = document.createElement("span");
        label.setAttribute("priority", "-95");
        label.innerText = "Models by MIA";
        label.addEventListener("click", () => { /* open url */  window.open("https://sketchfab.com/artsmia") });
        ctx.menu.appendChild(label);

        const wireframeButton = document.createElement("button");
        wireframeButton.setAttribute("priority", "90");
        wireframeButton.innerText = "Show Wireframe";
        wireframeButton.addEventListener("click", () => {
            wireframe = !wireframe;
            wireframeButton.innerText = wireframe ? "Hide Wireframe" : "Show Wireframe";
            applyWireframe();
        });
        ctx.menu.appendChild(wireframeButton);
    }

    function applyWireframe() {
        ctx.scene.traverse(obj => {
            if (obj instanceof Mesh) {
                obj.material.wireframe = wireframe;
            }
        })
    }
})
