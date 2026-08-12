import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 14,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.38,
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.995,
    transition: {
      duration: 0.25,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%', minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
