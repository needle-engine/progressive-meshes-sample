
import { OrbitControls, SceneSwitcher, WebXRButtonFactory, delay, findObjectOfType, onStart, getIconElement, addComponent, WebXR, AssetReference, ContactShadows, getOrAddComponent, Renderer } from "@needle-tools/engine";
import { Box3, LOD, Mesh, Vector3, GridHelper, Object3D } from "three";

const assets = [
    "/assets/winged dragon.glb",
    "/assets/snake.glb",
];

onStart(async context => {
    addComponent(context.scene, WebXR, {
        createSendToQuestButton: false,
        arSceneScale: 1,
        createARButton: true,
        createVRButton: true,
        createQRCode: true,
    });

    if (context.mainCameraComponent) {
        context.mainCameraComponent.backgroundBlurriness = .3;
        context.mainCameraComponent.backgroundIntensity = .1;
    }

    const contactShadowObject = new Object3D();
    context.scene.add(contactShadowObject);
    contactShadowObject.scale.set(2, 3, 2);
    addComponent(contactShadowObject, ContactShadows, {
        blur: 2,
        opacity: 1,
        darkness: 1,
    });


    const sceneSwitcher = addComponent(context.scene, SceneSwitcher, {
        clamp: false,
        useSwipe: false,
        useHistory: true,
        useKeyboard: true,
    });
    // Register the assets to be loaded
    for (const url of assets) {
        sceneSwitcher.addScene(url);
    }

    // Disable the quicklook button before the first model has been loaded
    const quicklookButton = WebXRButtonFactory.getOrCreate().createQuicklookButton();
    quicklookButton.disabled = true;

    const orbitControls = findObjectOfType(OrbitControls);
    if (orbitControls) {
        orbitControls.autoFit = false;
        orbitControls.autoTarget = false;
        orbitControls.setLookTargetPosition(context.scene.position, true);
    }

    sceneSwitcher?.addEventListener("loadscene-start", _ => {
        quicklookButton.disabled = true;
    });
    sceneSwitcher?.addEventListener("scene-opened", async (_: any) => {
        quicklookButton.disabled = false;

        // make sure the model is centered in the scene 
        const loaded = sceneSwitcher.currentlyLoadedScene;
        if (loaded) {
            const bbox = new Box3().setFromObject(loaded.asset);
            const center = bbox.getCenter(new Vector3());
            loaded.asset.position.sub(center);
            const height = bbox.getSize(new Vector3()).y;
            loaded.asset.position.y += height * .5;

            // Make sure we have a Renderer on all meshes
            loaded.asset.traverse(obj => {
                if (obj instanceof Mesh) getOrAddComponent(obj, Renderer, { sourceId: loaded.uri })
            });

            applyWireframe();

            if (orbitControls) {
                orbitControls.autoRotate = true;
                orbitControls.fitCamera([sceneSwitcher.currentlyLoadedScene?.asset], 1, false);
            }
        }


    });

    let wireframe = false;
    createButtons();

    /**
     * Creates a couple of extra buttons to switch between models and show wireframe
     */
    function createButtons() {
        const button = document.createElement("button");
        button.setAttribute("priority", "100");
        button.innerText = "Next Model";
        button.style.cssText = "font-weight: bold";
        button.appendChild(getIconElement("arrow_right_alt"));
        button.addEventListener("click", () => { sceneSwitcher?.selectNext() });
        context.menu.appendChild(button);

        const label = document.createElement("span");
        label.setAttribute("priority", "-95");
        label.innerText = "Models by MIA";
        label.addEventListener("click", () => { /* open url */  window.open("https://sketchfab.com/artsmia") });
        context.menu.appendChild(label);

        const wireframeButton = document.createElement("button");
        wireframeButton.setAttribute("priority", "90");
        wireframeButton.innerText = "Show Wireframe";
        wireframeButton.addEventListener("click", () => {
            wireframe = !wireframe;
            wireframeButton.innerText = wireframe ? "Hide Wireframe" : "Show Wireframe";
            applyWireframe();
        });
        context.menu.appendChild(wireframeButton);
    }

    /**
     * Apply current wireframe state to all meshes in the scene
     */
    function applyWireframe() {
        context.scene.traverse(obj => {
            if (obj instanceof Mesh) {
                obj.material.wireframe = wireframe;
            }
        })
    }
})
