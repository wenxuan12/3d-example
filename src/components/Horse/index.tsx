import { useEffect } from "react";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Horse() {

    useEffect(() => {
        initHorse();
    });

    function initHorse() {
        let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight,1, 10000);
        camera.position.y = 300;

        let scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        let renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.getElementById('three')?.appendChild(renderer.domElement);

        const light1 = new THREE.DirectionalLight( 0xefefff, 1.5 );
        light1.position.set( 1, 1, 1 ).normalize();
        scene.add( light1 );

        const light2 = new THREE.DirectionalLight( 0xFFFFFF, 1.5 );
        light2.position.set( - 1, - 1, - 1 ).normalize();
        scene.add( light2 );

        const loader = new GLTFLoader();
        let mixer: THREE.AnimationMixer;
        let animation: THREE.AnimationAction;
        loader.load('models/Horse.glb',(model) => {
            let mesh = model.scene.children[0];
            mesh.scale.set( 1.5, 1.5, 1.5 );
			scene.add(mesh);
            (window as any).model = model;
            console.log(model.scene.children[0])
            mixer = new THREE.AnimationMixer( mesh );
            mixer.clipAction( model.animations[ 0 ] ).setDuration( 1 ).play();
            animation = mixer.clipAction(  model.animations[0] );
        });

        const consorl = new OrbitControls(camera, renderer.domElement);

        // EVENTS
        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );
        let walk = false;
        function onKeyDown(e : any) {
            if (e.code === 'KeyW') {
                animation.play();
                walk = true;
            }
        }

        function onKeyUp(e : any) {
            if (e.code === 'KeyW') {
                walk = false;
            }
        }

        let prevTime = Date.now();
        const radius = 600;
        let theta = 0;
        function animate() {
            requestAnimationFrame(animate);
            theta += 0.1;

            camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
            camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );

            camera.lookAt( 0, 150, 0 );
            if ( mixer && walk) {
                const time = Date.now();
                mixer.update( ( time - prevTime ) * 0.001);
                prevTime = time;
            } else if (mixer) {
                mixer.stopAllAction();
            }
            renderer.render(scene,camera);
        }
        animate();
    }

    return (<div id="three"></div>)
}