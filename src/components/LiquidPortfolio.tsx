import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { motion, useInView } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MoveRight,
  Radio,
  ShieldCheck,
  Sparkles,
  Terminal,
} from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import * as THREE from "three";

type LiquidState = { pointer: [number, number]; intensity: number };

const cyan = "#00f0ff";
const acid = "#39ff14";

const sectionVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const expertise = [
  {
    number: "01",
    title: "Cryptography",
    copy: "Breaking down the mathematics behind private, verifiable systems.",
    accent: "cyan",
    icon: ShieldCheck,
    className: "md:col-span-7",
  },
  {
    number: "02",
    title: "Capture The Flag",
    copy: "Thinking like an attacker to build with better instincts.",
    accent: "acid",
    icon: Terminal,
    className: "md:col-span-5 md:translate-y-12",
  },
  {
    number: "03",
    title: "Machine Learning",
    copy: "Turning messy signals into decisions that can move in the real world.",
    accent: "acid",
    icon: Sparkles,
    className: "md:col-span-5",
  },
];

function LiquidShader({ state }: { state: LiquidState }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const uniforms = useRef({
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2(0.5, 0.5) },
    uResolution: { value: new THREE.Vector2(size.width, size.height) },
    uIntensity: { value: 0 },
  });

  useFrame((_, delta) => {
    if (!material.current) return;
    const values = material.current.uniforms;
    values.uTime.value += Math.min(delta, 0.05);
    values.uPointer.value.lerp(new THREE.Vector2(state.pointer[0], state.pointer[1]), 0.06);
    values.uIntensity.value = THREE.MathUtils.lerp(values.uIntensity.value, state.intensity, 0.08);
    values.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh position={[0, 0, -1]}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        depthWrite={false}
        uniforms={uniforms.current}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = vec4(position.xy, 0.0, 1.0);
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform vec2 uResolution;
          uniform float uIntensity;

          float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
          float noise(vec2 p) {
            vec2 i = floor(p); vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
          }
          float fbm(vec2 p) {
            float value = 0.0; float amplitude = 0.5;
            for (int i = 0; i < 5; i++) { value += amplitude * noise(p); p = p * 2.0 + 1.7; amplitude *= 0.5; }
            return value;
          }

          void main() {
            vec2 uv = vUv;
            vec2 aspect = vec2(uResolution.x / max(uResolution.y, 1.0), 1.0);
            vec2 p = (uv - 0.5) * aspect;
            vec2 mouse = (uPointer - 0.5) * aspect;
            float time = uTime * 0.08;
            float mouseField = exp(-length(p - mouse) * 2.8) * (0.35 + uIntensity * 0.8);
            vec2 flow = vec2(fbm(p * 2.2 + time), fbm(p * 2.2 - time + 4.0));
            p += (flow - 0.5) * (0.16 + uIntensity * 0.12) + mouseField * normalize(p - mouse + 0.001) * 0.11;
            float liquid = fbm(p * 3.4 + vec2(time * 1.6, -time));
            float filament = sin((p.x + liquid * 0.65) * 8.0 - time * 9.0) * 0.5 + 0.5;
            float glow = smoothstep(0.62, 0.9, liquid) + filament * 0.12;
            vec3 deep = vec3(0.008, 0.02, 0.03);
            vec3 blue = vec3(0.0, 0.22, 0.28);
            vec3 green = vec3(0.12, 0.44, 0.05);
            vec3 col = mix(deep, blue, smoothstep(0.18, 0.72, liquid));
            col = mix(col, green, smoothstep(0.7, 1.0, liquid) * 0.62);
            col += vec3(0.0, 0.44, 0.52) * glow * 0.18;
            col *= 0.7 + 0.3 * smoothstep(1.1, 0.0, length((uv - 0.5) * 1.2));
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function CoreMark({ active }: { active: boolean }) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!group.current || !core.current) return;
    group.current.rotation.y += delta * (active ? 0.55 : 0.24);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, active ? -0.22 : 0.08, 0.05);
    const target = active ? 1.1 : 1;
    core.current.scale.lerp(new THREE.Vector3(target, target, target), 0.05);
  });

  return (
    <Float speed={1.6} rotationIntensity={0.25} floatIntensity={0.35}>
      <group ref={group} rotation={[0.08, 0.2, -0.05]}>
        <mesh ref={core} castShadow>
          <icosahedronGeometry args={[1.22, 5]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.55}
            roughness={0.1}
            transmission={0.94}
            ior={1.5}
            chromaticAberration={0.08}
            color={cyan}
            attenuationColor={acid}
            attenuationDistance={1.1}
          />
        </mesh>
        <mesh position={[0, 0.04, 0.02]} scale={[1.8, 0.11, 0.14]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={active ? acid : cyan} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.75, 0.02]} rotation={[0, 0, Math.PI]} scale={[0.18, 1, 0.16]}>
          <coneGeometry args={[1, 1.6, 4]} />
          <meshBasicMaterial color={acid} toneMapped={false} />
        </mesh>
      </group>
    </Float>
  );
}

function LiquidCanvas({ state, active }: { state: LiquidState; active: boolean }) {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 opacity-95">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
        <LiquidShader state={state} />
        <ambientLight intensity={0.4} color="#b3ffff" />
        <pointLight position={[2.5, 1.5, 3]} intensity={active ? 8 : 4} color={cyan} distance={8} />
        <pointLight position={[-2, -1, 2]} intensity={active ? 6 : 3} color={acid} distance={7} />
        <CoreMark active={active} />
        <EffectComposer multisampling={0}>
          <Bloom intensity={1.1} luminanceThreshold={0.18} mipmapBlur />
        </EffectComposer>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,transparent_8%,color-mix(in_oklab,var(--obsidian)_35%,transparent)_72%,var(--obsidian)_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(0.8_0.08_190_/_6%)_1px,transparent_1px),linear-gradient(90deg,oklch(0.8_0.08_190_/_6%)_1px,transparent_1px)] [background-size:72px_72px]" />
    </div>
  );
}

function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div ref={ref} className={className} variants={sectionVariants} initial="hidden" animate={inView ? "visible" : "hidden"}>
      {children}
    </motion.div>
  );
}

function ExpertiseCard({ item, onEnter }: { item: (typeof expertise)[number]; onEnter: () => void }) {
  const Icon = item.icon;
  const acidCard = item.accent === "acid";
  return (
    <motion.article
      onMouseEnter={onEnter}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className={`group relative min-h-64 overflow-hidden border border-line bg-surface p-7 backdrop-blur-xl ${item.className}`}
    >
      <div className={`absolute right-5 top-5 font-mono text-xs ${acidCard ? "text-acid" : "text-cyan"}`}>{item.number}</div>
      <div className={`mb-20 flex size-11 items-center justify-center border ${acidCard ? "border-acid/40 text-acid" : "border-cyan/40 text-cyan"}`}>
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="relative z-10">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">{item.title}</h3>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{item.copy}</p>
      </div>
      <div className={`absolute -bottom-12 -right-8 size-48 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-80 ${acidCard ? "bg-acid/10" : "bg-cyan/10"}`} />
      <ArrowUpRight className={`absolute bottom-7 right-7 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 ${acidCard ? "text-acid" : "text-cyan"}`} size={18} />
    </motion.article>
  );
}

function ProjectCard({ number, title, tag, description, stack, children, accent }: { number: string; title: string; tag: string; description: string; stack: string[]; children: ReactNode; accent: "cyan" | "acid" }) {
  const acidCard = accent === "acid";
  return (
    <motion.article whileHover={{ y: -10 }} transition={{ duration: 0.3 }} className={`group relative min-w-[min(82vw,620px)] overflow-hidden border border-line bg-surface-strong p-6 backdrop-blur-md md:p-8`}>
      <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${acidCard ? "shadow-[inset_0_0_0_1px_var(--acid),inset_0_0_45px_color-mix(in_oklab,var(--acid)_12%,transparent)]" : "shadow-[inset_0_0_0_1px_var(--cyan),inset_0_0_45px_color-mix(in_oklab,var(--cyan)_12%,transparent)]"}`} />
      <div className="relative z-10 flex items-start justify-between font-mono text-xs text-muted-foreground">
        <span>PROJECT / {number}</span><span className={acidCard ? "text-acid" : "text-cyan"}>{tag}</span>
      </div>
      <div className="relative z-10 my-16">{children}</div>
      <div className="relative z-10 max-w-lg">
        <h3 className="text-4xl font-semibold tracking-tight text-foreground">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((tech) => <span key={tech} className="border border-line px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{tech}</span>)}
        </div>
      </div>
      <ExternalLink className={`absolute bottom-7 right-7 ${acidCard ? "text-acid" : "text-cyan"}`} size={18} />
    </motion.article>
  );
}

export function LiquidPortfolio() {
  const [liquidState, setLiquidState] = useState<LiquidState>({ pointer: [0.5, 0.5], intensity: 0 });
  const [coreActive, setCoreActive] = useState(false);

  return (
    <main onMouseMove={(event) => setLiquidState((current) => ({ ...current, pointer: [event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight] }))} className="relative min-h-screen overflow-hidden bg-obsidian text-foreground">
      <LiquidCanvas state={liquidState} active={coreActive} />
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <a href="#top" className="font-mono text-sm font-medium tracking-[0.2em] text-foreground">TT<span className="text-cyan">.</span></a>
        <div className="hidden items-center gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex">
          <a className="story-link transition-colors hover:text-cyan" href="#about">01 / About</a>
          <a className="story-link transition-colors hover:text-cyan" href="#work">02 / Work</a>
          <a className="story-link transition-colors hover:text-cyan" href="#contact">03 / Contact</a>
        </div>
        <a href="mailto:tushar.tiple@example.com" className="group flex items-center gap-2 border border-cyan/35 px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-cyan transition-colors hover:bg-cyan hover:text-obsidian">
          <span className="size-1.5 rounded-full bg-acid shadow-[0_0_10px_var(--acid)]" /> Available for signals
        </a>
      </nav>

      <section id="top" className="relative z-10 mx-auto flex min-h-[calc(100svh-88px)] max-w-7xl flex-col justify-center px-6 pb-20 pt-10 md:px-10 md:pt-0">
        <div className="max-w-3xl">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-7 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-cyan">
            <span className="inline-block h-px w-10 bg-cyan" /> Engineering the unknown
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.75 }} className="text-[clamp(4rem,12vw,10rem)] font-semibold leading-[0.84] tracking-[-0.07em] text-foreground">
            Tushar<br /><span className="text-glow-cyan text-cyan">Tiple</span><span className="text-acid">_</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }} className="mt-8 max-w-md text-base leading-7 text-muted-foreground md:text-lg">
            Computer Engineering Student <span className="text-cyan">&</span> Beginner Researcher.<br />I build sharp tools for complicated worlds.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} className="mt-20 flex items-end justify-between">
          <a href="#about" className="group flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-cyan">
            <ArrowDownRight className="text-cyan transition-transform group-hover:translate-y-1 group-hover:translate-x-1" size={18} /> Scroll to inspect
          </a>
          <div className="hidden text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:block"><span className="text-acid">© 2026</span><br />Pune / India</div>
        </motion.div>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-7xl px-6 py-28 md:px-10 md:py-40">
        <Reveal><div className="mb-14 flex items-end justify-between border-b border-line pb-5"><div><p className="font-mono text-xs text-cyan">01 / THE STACK</p><h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Curious by default.</h2></div><span className="hidden font-mono text-xs text-muted-foreground md:block">[ focus areas ]</span></div></Reveal>
        <Reveal className="grid gap-4 md:grid-cols-12">
          {expertise.map((item) => <ExpertiseCard key={item.number} item={item} onEnter={() => setLiquidState((current) => ({ ...current, intensity: 1 }))} />)}
        </Reveal>
        <div onMouseLeave={() => setLiquidState((current) => ({ ...current, intensity: 0 }))} onMouseEnter={() => setLiquidState((current) => ({ ...current, intensity: 1 }))} className="mt-4 border border-line bg-surface p-7 backdrop-blur-xl md:flex md:items-center md:justify-between md:p-10">
          <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-2xl">The best projects live between disciplines. I follow the interesting question until it becomes something you can touch.</p>
          <div className="mt-7 flex items-center gap-4 md:mt-0"><span className="font-mono text-xs uppercase tracking-widest text-acid">Always learning</span><Radio className="animate-pulse text-acid" size={18} /></div>
        </div>
      </section>

      <section id="work" className="relative z-10 pb-28 md:pb-40">
        <Reveal className="mx-auto max-w-7xl px-6 md:px-10"><div className="flex items-end justify-between border-b border-line pb-5"><div><p className="font-mono text-xs text-acid">02 / SELECTED WORK</p><h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">Built to move.</h2></div><MoveRight className="text-cyan" /></div></Reveal>
        <Reveal className="hide-scrollbar mt-10 flex gap-5 overflow-x-auto px-6 pb-8 md:px-[max(2.5rem,calc((100vw-80rem)/2))]">
          <ProjectCard number="01" title="VarunEye" tag="VISION SYSTEM" description="An intelligent road-safety vision system that turns a live camera feed into useful, searchable signals." stack={["YOLOv8", "PostgreSQL", "Python"]} accent="acid">
            <div className="relative aspect-[2.4/1] overflow-hidden border border-acid/30 bg-obsidian liquid-grid"><div className="absolute left-[18%] top-[27%] h-1/2 w-1/3 border border-acid shadow-[0_0_18px_color-mix(in_oklab,var(--acid)_70%,transparent)]" /><div className="absolute right-[15%] top-[40%] h-[28%] w-1/4 border border-acid/60" /><span className="absolute bottom-3 left-3 font-mono text-[9px] text-acid">TRACKING / 04 OBJECTS</span><span className="absolute right-3 top-3 font-mono text-[9px] text-acid">LIVE ●</span></div>
          </ProjectCard>
          <ProjectCard number="02" title="Arogya" tag="IOT HEALTH HUB" description="A calm, connected health layer designed to make the invisible data around us more human." stack={["Sensors", "Realtime", "UX"]} accent="cyan">
            <div className="relative aspect-[2.4/1] overflow-hidden border border-cyan/30 bg-obsidian"><div className="absolute inset-0 opacity-50 [background-image:radial-gradient(circle_at_center,var(--cyan)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:linear-gradient(90deg,transparent,black,transparent)]" /><div className="absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan shadow-[0_0_35px_color-mix(in_oklab,var(--cyan)_50%,transparent)]" /><div className="absolute left-[30%] top-[28%] size-2 rounded-full bg-cyan shadow-[0_0_18px_var(--cyan)]" /><div className="absolute right-[24%] bottom-[27%] size-2 rounded-full bg-acid shadow-[0_0_18px_var(--acid)]" /><div className="absolute left-[31%] top-[30%] h-px w-[38%] rotate-[22deg] bg-cyan/50" /><div className="absolute bottom-3 left-3 font-mono text-[9px] text-cyan">NETWORK / STABLE</div></div>
          </ProjectCard>
        </Reveal>
      </section>

      <footer id="contact" className="relative z-10 border-t border-line bg-obsidian/80 px-6 pb-8 pt-24 md:px-10 md:pt-36">
        <div className="mx-auto max-w-7xl"><Reveal><div className="max-w-3xl"><p className="font-mono text-xs text-cyan">03 / OPEN CHANNEL</p><h2 className="mt-5 text-[clamp(3.5rem,10vw,9rem)] font-semibold leading-[0.85] tracking-[-0.07em]">Let's make<br /><span className="text-acid text-glow-acid">something real.</span></h2></div></Reveal><div className="mt-24 flex flex-col justify-between gap-10 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:flex-row md:items-end"><div><span className="text-foreground">Tushar Tiple</span><br />Computer Engineering / Research</div><div className="flex items-center gap-4"><a aria-label="GitHub" href="https://github.com" target="_blank" rel="noreferrer" className="text-foreground transition-all hover:scale-110 hover:text-cyan hover:drop-shadow-[0_0_15px_var(--cyan)]"><Github size={19} /></a><a aria-label="LinkedIn" href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-foreground transition-all hover:scale-110 hover:text-cyan hover:drop-shadow-[0_0_15px_var(--cyan)]"><Linkedin size={19} /></a><a aria-label="Email" href="mailto:tushar.tiple@example.com" className="text-foreground transition-all hover:scale-110 hover:text-cyan hover:drop-shadow-[0_0_15px_var(--cyan)]"><Mail size={19} /></a><span className="ml-4 text-acid">System Secured.</span></div></div></div>
      </footer>
    </main>
  );
}