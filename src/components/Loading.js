import React from 'react';
import { Flex, chakra } from '@chakra-ui/react';

const SpinnerContainer = chakra('div', {
  baseStyle: {
    display: 'inline-block',
    overflow: 'hidden',
    background: 'transparent',
  },
});

const Ldio = chakra('div', {
  baseStyle: {
    width: '100%',
    height: '100%',
    position: 'relative',
    backfaceVisibility: 'hidden',
    transformOrigin: '0 0',
  },
});

const SpinnerItem = chakra('div', {
  baseStyle: {
    position: 'absolute',
    width: '40px',
    height: '40px',
    background: '#0099ff',
    boxSizing: 'content-box',
  },
});

const Loading = ({ fullPage = false, size = 200, height }) => {
  const scale = size / 200;
  const keyframes = `
    @keyframes ldio-x2uulkbinbj {
      0% { background: #ffffff }
      12.5% { background: #ffffff }
      12.625% { background: #0099ff }
      100% { background: #0099ff }
    }
  `;

  const containerHeight = height || (fullPage ? "100vh" : (size > 100 ? "300px" : "auto"));

  return (
    <Flex
      align="center"
      justify="center"
      w={fullPage ? "100%" : "auto"}
      h={containerHeight}
      direction="column"
    >
      <style>{keyframes}</style>
      <SpinnerContainer
        className="loadingio-spinner-blocks-nq4q5u6dq7r"
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <Ldio
            className="ldio-x2uulkbinbj"
            style={{ transform: `translateZ(0) scale(${scale})` }}
        >
          <SpinnerItem style={{ left: '38px', top: '38px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0s' }} />
          <SpinnerItem style={{ left: '80px', top: '38px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.125s' }} />
          <SpinnerItem style={{ left: '122px', top: '38px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.25s' }} />
          <SpinnerItem style={{ left: '38px', top: '80px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.875s' }} />
          <SpinnerItem style={{ left: '122px', top: '80px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.375s' }} />
          <SpinnerItem style={{ left: '38px', top: '122px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.75s' }} />
          <SpinnerItem style={{ left: '80px', top: '122px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.625s' }} />
          <SpinnerItem style={{ left: '122px', top: '122px', animation: 'ldio-x2uulkbinbj 1s linear infinite', animationDelay: '0.5s' }} />
        </Ldio>
      </SpinnerContainer>
    </Flex>
  );
};

export default Loading;
