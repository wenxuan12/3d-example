import { useEffect } from 'react';
import './index.scss';
import { Card } from './card';
import * as THREE from 'three';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { Water } from 'three/examples/jsm/objects/Water.js';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';
import waternormals from '../../asset/waternormals.jpg';
import simple from '../../asset/home/simple.jpg';
import extrude from '../../asset/home/extrude.jpg';
import lights from '../../asset/home/lights.png';


export default function Home() {

    useEffect(() => {
        ocean();
    }, []);

    return (
        <div className="home">
            <div className='home-title'>
                3D Examples
            </div>
            <div className='item-list'>
                {
                    list.map((item, index) => {
                        return (<div className='item' key={index} onClick={function() {window.open(item.link)}}  >
                            <Card
                                imgSrc={item.image}
                                title={item.title}
                                description={item.description}
                            />
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
const list = [{
    link: '#/simple',
    title: '简单案例',
    description: '',
    image: simple,
}, {
    link: '#/extrude',
    title: 'ExtrudeGeometry',
    description: '',
    image: extrude,
}, {
    link: '#/lights',
    title: 'Lights Physical',
    description: '',
    image: lights,
}, ];
export function ocean() {
    let clock = new THREE.Clock();
    //
    let scene = new THREE.Scene();

    let camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.set( 30, 30, 100 );

    //
    let renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    document.body.appendChild( renderer.domElement );

    //
    let sun = new THREE.Vector3();

    // Water
    const waterGeometry = new THREE.PlaneGeometry( 100000, 100000 );
    let water = new Water(
        waterGeometry,
        {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: new THREE.TextureLoader().load( waternormals, function ( texture ) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            fog: scene.fog !== undefined
        }
    );

    water.rotation.x = - Math.PI / 2;
    scene.add( water );

    // Skybox
    const sky = new Sky();
    sky.scale.setScalar( 100000 );
    scene.add( sky );

    const skyUniforms = sky.material.uniforms;

    skyUniforms[ 'turbidity' ].value = 10;
    skyUniforms[ 'rayleigh' ].value = 2;
    skyUniforms[ 'mieCoefficient' ].value = 0.005;
    skyUniforms[ 'mieDirectionalG' ].value = 0.8;

    const parameters = {
        elevation: 2,
        azimuth: 180
    };

    const pmremGenerator = new THREE.PMREMGenerator( renderer );
    function updateSun() {

        const phi = THREE.MathUtils.degToRad( 90 - parameters.elevation );
        const theta = THREE.MathUtils.degToRad( parameters.azimuth );

        sun.setFromSphericalCoords( 1, phi, theta );

        sky.material.uniforms[ 'sunPosition' ].value.copy( sun );
        water.material.uniforms[ 'sunDirection' ].value.copy( sun ).normalize();

        scene.environment = pmremGenerator.fromScene( sky as any ).texture;

    }
    updateSun();

    let controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 20;
    controls.lookSpeed = 0.03;
    controls.lookVertical  = false;

    window.addEventListener( 'resize', onWindowResize );
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        controls.handleResize();
    }
    function animate() {
        requestAnimationFrame( animate );
        render();
    }
    function render() {
        const delta = clock.getDelta();
        controls.update( delta );
        renderer.render( scene, camera );
        water.material.uniforms[ 'time' ].value += 1.0 / 60.0;
    }
    animate();
}

