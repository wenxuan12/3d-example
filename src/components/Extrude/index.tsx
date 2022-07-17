import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Extrude() {

    useEffect(() => {
        initThree();
    },[]);

    function initThree() {
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(0,0,500);
        (window as any).camera = camera;

        let scene = new THREE.Scene();
        scene.background = new THREE.Color( 0x222222 );

        let renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio); // 设置分辨率同步
        renderer.setSize(window.innerWidth, window.innerHeight);
        const node = document.getElementById('three');
        node?.appendChild(renderer.domElement);
        

        // 灯光
        scene.add(new THREE.AmbientLight(0x222222));

        const light = new THREE.PointLight(0xffffff);
        light.position.copy(camera.position);
        scene.add(light);

        // 添加三维辅助坐标系
        const axesHelper = new THREE.AxesHelper( 300 );
        scene.add( axesHelper );

        let controls = new OrbitControls(camera, renderer.domElement);
        controls.minDistance = 200;
		controls.maxDistance = 500;

        // 路径线路
        const closedSpline = new THREE.CatmullRomCurve3( [
            new THREE.Vector3( - 60, - 100, 60),
            new THREE.Vector3( - 60, 20, 60 ),
            new THREE.Vector3( - 60, 120, 60 ),
            new THREE.Vector3( 60, 20, - 60 ),
            new THREE.Vector3( 60, - 100, - 60 )
        ], true, 'catmullrom');

        const extrudeOptions = {
            steps: 20000,
            bevelEnabled: false,
            extrudePath: closedSpline
        };
        
        const pts1 = [], count = 3;

        for ( let i = 0; i < count; i ++ ) {
            const l = 20;
            const a = 2 * i / count * Math.PI;
            pts1.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );
        }

        const shape1 = new THREE.Shape( pts1 );

        const geometry1 = new THREE.ExtrudeGeometry( shape1, extrudeOptions );
        const material1 = new THREE.MeshLambertMaterial( { color: 0xb00000, wireframe: false } );
        const mesh1 = new THREE.Mesh( geometry1, material1 );
        scene.add( mesh1 );

        const pts2 = [], numPts = 5;

        for ( let i = 0; i < numPts * 2; i ++ ) {
            const l = i % 2 === 1 ? 10 : 20;
            const a = i / numPts * Math.PI;
            pts2.push( new THREE.Vector2( Math.cos( a ) * l, Math.sin( a ) * l ) );
        }
        const shape2 = new THREE.Shape( pts2 );

        const material2 = new THREE.MeshLambertMaterial( { color: 0xff8000 } );
        const materials = [ material1, material2 ];

        const extrudeSettings = {
            depth: 20,
            steps: 1,
            bevelEnabled: true,
            bevelThickness: 2,
            bevelSize: 4,
            bevelSegments: 3
        };

        const geometry2 = new THREE.ExtrudeGeometry( shape2, extrudeSettings );
        const mesh2 = new THREE.Mesh( geometry2, materials );
        mesh2.position.set( 50, 100, 50 );
        scene.add( mesh2 );

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
    }

    return(<div id='three'></div>)
}