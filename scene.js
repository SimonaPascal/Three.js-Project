var scene, renderer, camera, gui, stars=[], planets =[], balls=[];
var controls;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
var speed = 20;


init();

render();

function init(){
  //SCENE
  scene = new THREE.Scene();

  //CAMERA
  camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1, 1000);
  camera.position.z = 200;
  
  //LIGHTS
  var keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
  keyLight.position.set(-100, 0, 100);

  var fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);

  var backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();
  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(backLight);

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

  //CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;
  
  // OBJECTS
  drawSphereWithRing()
  addSphere();

  window.addEventListener( 'click', onMouseClick, false );
  window.addEventListener('keydown', keyPressed);

  loadExternModel()
  
  
  addDatGui()

 
}

function loadExternModel(){

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setTexturePath('/assets/');
  mtlLoader.setPath('/assets/');
  mtlLoader.load('r2-d2.mtl', function (materials) {
  
      materials.preload();
  
      var objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.setPath('/assets/');
      objLoader.load('r2-d2.obj', function (object) {
  
          scene.add(object);
          object.position.y -= 60; 
      });
  
  });
}

function addDatGui(){
  gui = new dat.GUI();
  //gui.add(light, "intensity", 0, 20);
  gui.add(camera.position, 'x', -500,500).step(5);
  gui.add(camera.position, 'y', -500,500).step(5);
  gui.add(camera.position, 'z', 0,2000).step(5);
  
  
}
function drawSphereWithRing(){
  for(let i = -1000; i < 1000; i+= 50){
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
  for ( var z= -2000; z < 2000; z+=speed ) {

    // Make a sphere (exactly the same as before). 
    var geometry   = new THREE.SphereGeometry(1.5, 32, 32)
    var particleMaterial = new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load('images/particle.jpeg')});
    var sphere = new THREE.Mesh(geometry, particleMaterial)

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


function onMouseClick( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  
  raycaster.setFromCamera( mouse, camera );

	//calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(scene.children);

	for ( let i = 0; i < intersects.length; i ++ ){

   intersects[ i ].object.material.color.set("#ffffff");
   var ringGeometry = new THREE.TorusGeometry(50, 2, 40, 25);
   var ringMaterial = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
   var ring= new THREE.Mesh(ringGeometry, ringMaterial);
   ring.rotation.x  = Math.PI/2;
   intersects[ i ].object.add(ring);
   
  
  }

}

function keyPressed(e){
  var delta = 1000;
  switch(e.key) {
    case 'ArrowUp':
        camera.position.x - delta;
        break;
    case 'ArrowDown':
        camera.position.x + delta;
        break;
    case 'ArrowLeft':
        camera.position.z - delta;
        break;
    case 'ArrowRight':
        camera.position.z + delta;
        break;
  }
  e.preventDefault();
  
}


function render() {
  requestAnimationFrame( render );

	 //render the scene
   renderer.render( scene, camera );
   controls.update();
   animateStars();
   animatePlanets();
  

}

 

      




