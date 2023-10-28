import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
scene.background= new THREE.Color(0x253045)
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
const clock = new THREE.Clock();
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const axesHelper = new THREE.AxesHelper( 100 );
scene.add( axesHelper );


const geometry = new THREE.BoxGeometry( 18, 6, 24,16,16,16 );

const u_data = {
    u_time:{
        type:'f',
        value:clock.getElapsedTime(),
    },
}

const material = new THREE.ShaderMaterial({
      wireframe: true,
      uniforms:u_data,
      vertexShader: `
      varying vec3 pos;
      uniform float u_time;
      void main()	{
        pos = position;
        gl_Position = projectionMatrix
          * modelViewMatrix
          * vec4(position.x, 4.0*(sin(position.z/4.0 + u_time))+position.y, position.z, 1.0);
      }
      `,
      fragmentShader: `
      varying vec3 pos;
      void main() {
        bool tr;
        tr = (pos.z>2.0) && ( ( (pos.x>0.0) && (pos.x<0.7*pos.z) ) || ( (pos.x<0.0) && (-(1.0/0.7)*pos.x<pos.z) )  ) ;
        if(tr){
            gl_FragColor = vec4(1.0,0.0,0.0,1.0);
        }
        else if(pos.x>3.0){
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
        }
        else if(pos.x <-3.0){
            gl_FragColor=vec4(0.0,0.0,0.0,1.0);
        }
        else{
            gl_FragColor=vec4(1.0,1.0,1.0,1.0);
        }
    }
      `,
    });

const controls = new OrbitControls( camera, renderer.domElement );


const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 30;
camera.position.y = 5;
// camera.lookAt( cube );
const initTime = Date.now()

cube.rotation.z += 300
cube.rotation.y += 300
function animate() {
    u_data.u_time.value = clock.getElapsedTime()
    // camera.target.position.copy( cube );
	requestAnimationFrame( animate );
    // const deltaTime = Date.now() - initTime
	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
    // cube.position.z += Math.sin(deltaTime)*0.2 
    controls.update();
	renderer.render( scene, camera );
}

animate();