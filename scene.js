var scene, renderer, camera, stars=[], planets =[];
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

init();

render();

function init(){
  //SCENE
  scene = new THREE.Scene();

  //CAMERA
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1, 1000);
  camera.position.z = 7;
  
  //LIGHTS
  var light = new THREE.DirectionalLight(0xf5f5f5, 1);
  light.position.set( -1, 2, 4);
  scene.add(light);

  //RENDERER
  renderer = new THREE.WebGLRenderer({antialias : true});
  renderer.setClearColor("#1c1624");
  renderer.setSize(window.innerWidth,window.innerHeight);

  document.body.appendChild(renderer.domElement);
  window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix();
  })

  
  
  drawSphereWithRing()

  



  addSphere();
   
  window.addEventListener( 'mousemove', onMouseMove, false );

  // var material = new THREE.MeshPhongMaterial({
  //   color: 0xF3FFE2,
  //   specular: 0xffffff,
  //   shininess: 1000,
  //   lightMap: null,
  //   lightMapIntensity: 1,
  //   bumpMap: null,
  //   bumpScale: 1,
  //   normalMap: null,
  //   normalScale: 1,
  //   displacementMap: null,
  //   displacementScale: 1,
  //   displacementBias: 0,
  //   specularMap: null
  // });
  

  // var geometry2 = new THREE.SphereGeometry(50, 20, 20);
  // var mesh2 = new THREE.Mesh(geometry2, material);
  // mesh2.position.z = -500;
  // mesh2.position.x = 100;
  // scene.add(mesh2);

 
}



function drawSphereWithRing(){
  for(let i = -1000; i < 1000; i+= 100){
    var planetGeometry = new THREE.SphereGeometry(20,15,15);
    var planetMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var planet = new THREE.Mesh(planetGeometry,planetMaterial);
  
    var ringGeometry = new THREE.TorusGeometry(30, 2, 40, 25);
    var ringMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    var ring= new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x  = Math.PI /2;
    planet.position.x = Math.random() * 1000 - 500;
    
    planet.position.y = Math.random() * 1000 - 500;
    planet.position.z = i;
    const rotation = new THREE.Euler();
    planet.rotation.x = Math.random() * 2 * Math.PI;
    planet.rotation.y = Math.random() * 2 * Math.PI;
    planet.rotation.z = Math.random() * 2 * Math.PI;
  
  
    planet.add(ring);
    scene.add(planet);

    stars.push(planet);
  }

}


function addSphere(){

  // The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
  for ( var z= -1000; z < 1000; z+=20 ) {

    // Make a sphere (exactly the same as before). 
    var geometry   = new THREE.SphereGeometry(0.5, 32, 32)
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    var sphere = new THREE.Mesh(geometry, material)

    // This time we give the sphere random x and y positions between -500 and 500
    sphere.position.x = Math.random() * 1000 - 500;
    sphere.position.y = Math.random() * 1000 - 500;

    // Then set the z position to where it is in the loop (distance of camera)
    sphere.position.z = z;

    // scale it up a bit
    sphere.scale.x = sphere.scale.y = 2;

    //add the sphere to the scene
    scene.add( sphere );

    //finally push it to the stars array 
    stars.push(sphere); 
  }
}

function animateStars() { 
				
  // loop through each star
  for(var i=0; i<stars.length; i++) {
    
    var star = stars[i]; 
      
    // and move it forward dependent on the mouseY position. 
    star.position.z +=  i/10;
      
    // if the particle is too close move it to the back
    if(star.position.z>1000) star.position.z-=2000; 
    
  }

}

function animatePlanets() { 
				
  // loop through each star
  for(var i=0; i<planets.length; i++) {
    
    var planet = planets[i]; 
      
    // and move it forward dependent on the mouseY position. 
    planet.position.z +=  i/10;
      
    // if the particle is too close move it to the back
    if(planet.position.z>1000) planet.position.z-=2000; 
    
  }

}


function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {
  requestAnimationFrame( render );

	raycaster.setFromCamera( mouse, camera );

	//calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );

	for ( let i = 0; i < intersects.length; i ++ ) {

		intersects[ i ].object.material.color.set("#ffffff");

  }

  //render the scene
 renderer.render( scene, camera );
    animateStars();
    animatePlanets();

      

}


