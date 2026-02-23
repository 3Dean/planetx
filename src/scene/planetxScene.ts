import {
  Clock,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  LoadingManager,
  Object3D,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MODEL_PATHS } from '../config/constants';

type SceneCallbacks = {
  onProgress: (loaded: number, total: number) => void;
  onReady: () => void;
  onError: (message: string) => void;
};

export class PlanetXScene {
  private readonly scene = new Scene();
  private readonly camera = new PerspectiveCamera(60, 1, 0.1, 5000);
  private readonly renderer = new WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  private readonly controls: OrbitControls;
  private readonly clock = new Clock();
  private readonly trenchPivot = new Group();
  private readonly loader: GLTFLoader;
  private isDisposed = false;

  constructor(
    private readonly container: HTMLElement,
    private readonly callbacks: SceneCallbacks
  ) {
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.setClearColor(0x000000, 1);
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.xr.enabled = true;
    this.renderer.domElement.className = 'scene-canvas';

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = this.createLoader();

    this.configureScene();
    this.configureCameraAndControls();
    this.configureLights();
    this.configureDom();
    this.handleResize();
  }

  async start(): Promise<void> {
    try {
      await this.loadModels();
      this.callbacks.onReady();
      this.renderer.setAnimationLoop(() => this.renderFrame());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load scene assets.';
      this.callbacks.onError(message);
    }
  }

  dispose(): void {
    if (this.isDisposed) return;

    this.isDisposed = true;
    this.renderer.setAnimationLoop(null);
    window.removeEventListener('resize', this.handleResize);
    this.controls.dispose();
    this.renderer.dispose();
    this.container.innerHTML = '';
  }

  private createLoader(): GLTFLoader {
    const manager = new LoadingManager();

    manager.onProgress = (_url, loaded, total) => {
      this.callbacks.onProgress(loaded, total);
    };

    manager.onError = (url) => {
      this.callbacks.onError(`Asset failed to load: ${url}`);
    };

    return new GLTFLoader(manager);
  }

  private configureScene(): void {
    this.scene.background = new Color('#000000');
    this.scene.fog = new Fog('#330033', 1, 1500);
    this.scene.add(this.trenchPivot);
  }

  private configureCameraAndControls(): void {
    this.camera.position.set(0, 1620, 0);
    this.camera.lookAt(0, 1620, -300);

    this.controls.enableDamping = true;
    this.controls.enablePan = false;
    this.controls.minDistance = 50;
    this.controls.maxDistance = 1800;
    this.controls.target.set(0, 1620, -300);
  }

  private configureLights(): void {
    const hemi = new HemisphereLight('#ff0000', '#0033cc', 1.5);
    hemi.position.set(0, 2, 0);
    this.scene.add(hemi);

    const directional = new DirectionalLight('#ffffff', 0.8);
    directional.position.set(1, 3, 1);
    this.scene.add(directional);
  }

  private configureDom(): void {
    this.container.appendChild(this.renderer.domElement);
    this.container.appendChild(VRButton.createButton(this.renderer));

    window.addEventListener('resize', this.handleResize);
  }

  private readonly handleResize = (): void => {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    const dpr = Math.min(window.devicePixelRatio, 2);
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(width, height, false);
  };

  private async loadModels(): Promise<void> {
    const [trench, starfield, planet, title] = await Promise.all([
      this.loadGltf(MODEL_PATHS.trench),
      this.loadGltf(MODEL_PATHS.starfield),
      this.loadGltf(MODEL_PATHS.planet),
      this.loadGltf(MODEL_PATHS.title)
    ]);

    trench.scale.setScalar(100);
    trench.position.set(0, 0, 0);
    this.trenchPivot.add(trench);

    starfield.scale.setScalar(2.5);
    this.disableFog(starfield);
    this.scene.add(starfield);

    planet.scale.setScalar(30);
    planet.position.set(0, 4100, -750);
    this.disableFog(planet);
    this.scene.add(planet);

    title.scale.setScalar(300);
    title.position.set(0, 3000, 0);
    this.disableFog(title);
    this.scene.add(title);
  }

  private async loadGltf(path: string): Promise<Object3D> {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        (gltf: GLTF) => resolve(gltf.scene),
        undefined,
        (error: unknown) => reject(error)
      );
    });
  }

  private disableFog(object: Object3D): void {
    object.traverse((node) => {
      const withMaterial = node as { material?: unknown };
      if (!withMaterial.material) return;

      const materials = Array.isArray(withMaterial.material)
        ? withMaterial.material
        : [withMaterial.material];

      materials.forEach((material) => {
        const maybeFogMaterial = material as { fog?: boolean; needsUpdate?: boolean };
        maybeFogMaterial.fog = false;
        maybeFogMaterial.needsUpdate = true;
      });
    });
  }

  private renderFrame(): void {
    if (this.isDisposed) return;

    const delta = this.clock.getDelta();
    const radiansPerSecond = (Math.PI * 2) / 230;
    this.trenchPivot.rotation.x -= radiansPerSecond * delta;

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }
}
