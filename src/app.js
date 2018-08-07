if (!Detector.webgl) Detector.addGetWebGLMessage();
let scene, clock, animations, camera, controls, ambient, point, loader, renderer, container, stats, player;
var action = {},
	mixer;

init();
animate();
function init() {
	// Create a scene which will hold all our meshes to be rendered
	scene = new THREE.Scene();
	clock = new THREE.Clock();
	// Create and position a camera
	camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
	// Reposition the camera
	camera.position.set(0, 3, 5);
	// Point the camera at a given coordinate
	camera.lookAt(new THREE.Vector3(0, 1, 0));

	// Add an ambient lights
	ambient = new THREE.AmbientLight(0xffffff, 0.2);
	scene.add(ambient);

	// Add a point light that will cast shadows
	point = new THREE.PointLight(0xffffff, 1);
	point.position.set(25, 50, 25);
	point.castShadow = true;
	point.shadow.mapSize.width = 1024;
	point.shadow.mapSize.height = 1024;
	scene.add(point);

	// A mesh is created from the geometry and material, then added to the scene
	var plane = new THREE.Mesh(
		new THREE.PlaneGeometry(50, 50, 50, 50),
		new THREE.MeshBasicMaterial({ color: 0x222222, wireframe: true })
	);
	plane.rotateX(Math.PI / 2);
	scene.add(plane);

	// Add a model
	loader = new THREE.GLTFLoader();
	loader.load('models/eva.glb', function(gltf) {
		player = gltf.scene;
		animations = gltf.animations;
		mixer = new THREE.AnimationMixer(player);
		if (animations && animations.length) {
			mixer
				.clipAction(animations[0])
				.setLoop(THREE.LoopPingPong)
				.play();
		}
		scene.add(player);
		controls = new THREE.PlayerControls(player);
		player.add(camera);
	});

	// Create a renderer
	renderer = new THREE.WebGLRenderer({ antialias: true });
	// Set size
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	// Set color
	renderer.setClearColor(0xf8a5c2);
	renderer.gammaOutput = true;
	// Enable shadow mapping
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// Append to the document
	container = document.createElement('div');
	document.body.appendChild(container);
	document.body.appendChild(renderer.domElement);
	// Add resize listener
	window.addEventListener('resize', onWindowResize, false);
	window.addEventListener('keydown', onPress);
	window.addEventListener('keyup', onRelease);

	// Enable FPS stats
	stats = new Stats();
	container.appendChild(stats.dom);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function onPress(e) {
	if (animations) {
		var key = e.keyCode;
		if (key === 38 || key === 40) {
			mixer.clipAction(animations[0]).stop();
			mixer.clipAction(animations[3]).play();
		}
	}
}

function onRelease(e) {
	if (animations) {
		var key = e.keyCode;
		if (key === 38 || key === 40) {
			mixer.clipAction(animations[3]).stop();
			mixer
				.clipAction(animations[0])
				.setLoop(THREE.LoopPingPong)
				.play();
		}
	}
}

function animate() {
	requestAnimationFrame(animate);
	if (player) controls.update();
	// Update stats
	stats.update();
	render();
}

function render() {
	// Re-render scene
	let delta = clock.getDelta();
	if (mixer) mixer.update(delta);
	renderer.render(scene, camera);
}
