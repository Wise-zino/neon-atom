// Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111122);
        
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);

        // Nucleus (10 protons + 10 neutrons for Neon)
        const nucleusGeometry = new THREE.SphereGeometry(2, 32, 32);
        const nucleusMaterial = new THREE.MeshPhongMaterial({ 
            color: 0xff5555,
            emissive: 0xaa0000,
            emissiveIntensity: 0.2,
            shininess: 30
        });
        const nucleus = new THREE.Mesh(nucleusGeometry, nucleusMaterial);
        scene.add(nucleus);

        // Electron shells
        const shells = [];
        const electronMaterial = new THREE.MeshPhongMaterial({
            color: 0x55aaff,
            emissive: 0x0044aa,
            emissiveIntensity: 0.3,
            shininess: 100
        });

        // First shell (2 electrons)
        const shell1Radius = 6;
        const shell1 = new THREE.Group();
        scene.add(shell1);
        
        const shell1Orbit = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, shell1Radius, shell1Radius, 0, Math.PI * 2, false, 0).getPoints(100)),
            new THREE.LineBasicMaterial({ color: 0x666688, transparent: true, opacity: 0.5 })
        );
        shell1Orbit.rotation.x = Math.PI / 2;
        scene.add(shell1Orbit);
        
        for (let i = 0; i < 2; i++) {
            const electron = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16, 16),
                electronMaterial
            );
            electron.position.x = shell1Radius * Math.cos((i / 2) * Math.PI * 2);
            electron.position.z = shell1Radius * Math.sin((i / 2) * Math.PI * 2);
            shell1.add(electron);
        }

        // Second shell (8 electrons)
        const shell2Radius = 12;
        const shell2 = new THREE.Group();
        scene.add(shell2);
        
        const shell2Orbit = new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(new THREE.EllipseCurve(0, 0, shell2Radius, shell2Radius, 0, Math.PI * 2, false, 0).getPoints(100)),
            new THREE.LineBasicMaterial({ color: 0x666688, transparent: true, opacity: 0.5 })
        );
        shell2Orbit.rotation.x = Math.PI / 2;
        scene.add(shell2Orbit);
        
        for (let i = 0; i < 8; i++) {
            const electron = new THREE.Mesh(
                new THREE.SphereGeometry(0.5, 16, 16),
                electronMaterial
            );
            electron.position.x = shell2Radius * Math.cos((i / 8) * Math.PI * 2);
            electron.position.z = shell2Radius * Math.sin((i / 8) * Math.PI * 2);
            shell2.add(electron);
        }

        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotate electron shells
            shell1.rotation.y += 0.02;
            shell2.rotation.y -= 0.01;
            
            controls.update();
            renderer.render(scene, camera);
        }
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();