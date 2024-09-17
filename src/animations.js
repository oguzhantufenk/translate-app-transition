export const contentAnimation = {
  initial: { opacity: 0, filter: "blur(10px)", y: -15, scale: 0.8 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0, scale: 1.0 },
  exit: { opacity: 0, filter: "blur(10px)", y: -15, scale: 0.8 },
  transition: {
    duration: 0.3,
    type: "spring",
    bounce: 0,
  },
};

export const springTransition = {
  type: "spring",
  duration: 0.7,
  bounce: 0.35,
};

// Dynamic island responsive dimensions
export const mobileDimensions = {
  closed: { width: "150px", height: "40px" },
  open: { width: "350px", height: "70px" },
};

export const desktopDimensions = {
  closed: { width: "200px", height: "50px" },
  open: { width: "450px", height: "90px" },
};
