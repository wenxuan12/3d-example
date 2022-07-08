import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

function simple() {
    let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(5,5,5);
    camera.lookAt(0,0,0);

    let scene = new THREE.Scene();
    
    const axesHelper = new THREE.AxesHelper( 3 );
    scene.add( axesHelper );


    //环境光    环境光颜色与网格模型的颜色进行RGB进行乘法运算
    var ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);

    //点光源
    var point = new THREE.PointLight(0xffffff);
    point.position.set(40, 40, 40); //点光源位置
    scene.add(point); 
    
    var geometry = new THREE.BoxGeometry(1, 1, 1); //创建一个立方体几何对象Geometry
    var material = new THREE.MeshLambertMaterial({ //材质对象Material
      color: 0x0000ff
    });
    var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    scene.add(mesh); //网格模型添加到场景中

    let renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xb9d3ff, 1);

    let controls = new OrbitControls(camera, renderer.domElement);
    
    document.body.appendChild(renderer.domElement);
    function animation() {
        requestAnimationFrame(animation);
        mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
        renderer.render(scene, camera);
    }
    animation();
}

export default simple;