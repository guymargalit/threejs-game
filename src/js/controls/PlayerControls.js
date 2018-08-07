THREE.PlayerControls = function(player, domElement) {
	this.player = player;
	this.domElement = domElement !== undefined ? domElement : document;
	this.center = new THREE.Vector3(player.position.x, player.position.y, player.position.z);
	this.moveSpeed = 0.3;
	this.turnSpeed = 0.05;
	var keyState = {};

	this.update = function() {
		this.checkKeyStates();
		this.center = this.player.position;
	};

	this.checkKeyStates = function() {
		if (keyState[38]) {
			this.player.position.x -= this.moveSpeed * Math.sin(this.player.rotation.y);
			this.player.position.z -= this.moveSpeed * Math.cos(this.player.rotation.y);
		}

		if (keyState[40]) {
			this.player.position.x += this.moveSpeed * Math.sin(this.player.rotation.y);
			this.player.position.z += this.moveSpeed * Math.cos(this.player.rotation.y);
		}

		if (keyState[37]) {
			this.player.rotation.y += this.turnSpeed;
		}

		if (keyState[39]) {
			this.player.rotation.y -= this.turnSpeed;
		}
	};

	function onKeyDown(event) {
		event = event || window.event;
		keyState[event.keyCode || event.which] = true;
	}

	function onKeyUp(event) {
		event = event || window.event;
		keyState[event.keyCode || event.which] = false;
	}

	this.domElement.addEventListener('keydown', onKeyDown, false);
	this.domElement.addEventListener('keyup', onKeyUp, false);
};

THREE.PlayerControls.prototype = Object.create(THREE.EventDispatcher.prototype);
