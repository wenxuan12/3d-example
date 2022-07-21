import { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

export default function Texts() {

    useEffect(() => {
        initThree();
    }, []);

    function initThree() {
        let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, -400, 700);

        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf0f0f0);

        const loader = new FontLoader();
        loader.load('font/helvetiker_regular.typeface.json', function (font) {
            const color = new THREE.Color(0x006699);
            const matDark = new THREE.LineBasicMaterial({
                color: color,
                side: THREE.DoubleSide
            });

            const matLite = new THREE.MeshBasicMaterial({
                color: color,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
            });

            const message = '  Three.js\nSimple text.';
            const shapes = font.generateShapes(message, 100);
            const geometry = new THREE.ShapeGeometry(shapes);
            geometry.computeBoundingBox();
            const xMid = - 0.5 * ((geometry.boundingBox?.max.x || 0) - (geometry.boundingBox?.min.x || 0));
            geometry.translate(xMid, 0, 0);

            const text = new THREE.Mesh(geometry, matLite);
            text.position.z = -150;
            scene.add(text);

            const linePoints: THREE.Vector2[][] = [];
            for (let i = 0;i < shapes.length;i++) {
                const shape = shapes[i];
                linePoints.push(shape.getPoints());
                if (shape.holes && shape.holes.length > 0) {
                    for (let j = 0 ; j < shape.holes.length;j++) {
                        const hole = shape.holes[j];
                        linePoints.push(hole.getPoints());
                    }
                }
            }

            const lineText = new THREE.Object3D();
            for (let i = 0 ; i < linePoints.length;i++) {
                const points = linePoints[i];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                geometry.translate(xMid, 0,0);
                const lineMesh = new THREE.Line(geometry, matDark);
                lineText.add(lineMesh);
            }
            scene.add(lineText);

            const style = SVGLoader.getStrokeStyle( 5, color.getStyle() );
			const strokeText = new THREE.Group();
            for (let i = 0 ; i < linePoints.length; i++) {
                const points = linePoints[i];
                const geometry = SVGLoader.pointsToStroke( points as any, style );
                geometry.translate( xMid, 0, 0 );
                const strokeMesh = new THREE.Mesh( geometry, matDark );
                strokeText.add( strokeMesh );
            }
            strokeText.position.z = 150;
            scene.add(strokeText);

            
            let textGeo = new TextGeometry(message, {
                font: font,
                size: 100,
                height: 20,
                curveSegments: 4,
                bevelThickness: 2,
                bevelSize: 1.5,
                bevelEnabled: true
            });

            let textMesh1 = new THREE.Mesh( textGeo, matLite );
            textMesh1.position.x = xMid;
            textMesh1.position.y = 0;
            textMesh1.position.z = 300;

            scene.add(textMesh1);
        });

        let renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio( window.devicePixelRatio );
        document.getElementById('three')?.appendChild(renderer.domElement);

        const consorl = new OrbitControls(camera, renderer.domElement);
        consorl.target.set(0,0,0);
        consorl.update();

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene,camera);
        }
        animate();
    }

    return (<div id="three"></div>)
}