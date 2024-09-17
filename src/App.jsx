import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import useWindowSize from "./hooks/useWindowSize";

import { Canvas } from "@react-three/fiber";

import { Particles } from "./Particles";

import {
  springTransition,
  contentAnimation,
  mobileDimensions,
  desktopDimensions,
} from "./animations";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

function App() {
  const isMobile = useWindowSize();
  const clickCooldownRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const wrapperVariants = {
    closed: isMobile ? mobileDimensions.closed : desktopDimensions.closed,
    open: isMobile ? mobileDimensions.open : desktopDimensions.open,
  };

  const handleToggle = () => {
    if (clickCooldownRef.current) return;

    setIsOpen((isOpen) => !isOpen);
    clickCooldownRef.current = true;

    setTimeout(() => {
      clickCooldownRef.current = false;
    }, 400);
  };

  return (
    <div className="container">
      <motion.div
        animate={isOpen ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
        transition={{
          type: "spring",
          duration: 0.6,
          bounce: 0,
          exit: {
            duration: 0.2,
            bounce: 0,
          },
        }}
        className={`canvas-inner ${isOpen ? "open" : "closed"}`}
      >
        <Canvas
          gl={{ antialias: false }} // Disabling antialiasing for performance
          camera={{ position: [0, 0, 0.5] }}
          dpr={1}
        >
          <Particles />

          <EffectComposer>
            <Bloom
              intensity={0.15}
              luminanceSmoothing={13}
              luminanceThreshold={0.4}
            />
          </EffectComposer>
        </Canvas>
      </motion.div>

      <motion.div
        onClick={handleToggle}
        variants={wrapperVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        transition={springTransition}
        className="container-inner"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {isOpen ? (
            <motion.div
              key="closed-island"
              layout
              className="canvas-wrapper"
              transition={springTransition}
            >
              <motion.div
                key="languages"
                layout
                {...contentAnimation}
                className="languages"
              >
                <div className="language-info">
                  <span className="language-name">Turkish</span>
                  <span className="language-listening">Dinliyor</span>
                </div>
                <div className="language-info second-language">
                  <span className="language-name">English</span>
                  <span className="language-listening">Listening</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="open-island"
              className="idle-wrapper"
              transition={springTransition}
            >
              <motion.img
                initial={{
                  opacity: 0,
                  filter: "blur(10px)",
                }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(10px)" }}
                transition={{
                  ...springTransition,
                  duration: 0.2,
                  bounce: 0.1,

                  filter: { type: "just" },
                }}
                className="apple-app-icon"
                src="/translate-icon.png"
                alt="Apple's Translate app icon"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default App;
