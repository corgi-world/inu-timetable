import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

interface IProps {
  handleInView: () => void;
}

export default function IntersectObserver({ handleInView }: IProps) {
  const target = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting) {
          handleInView();
        }
      },
      { threshold: 1 },
    );

    if (target.current) {
      observer.observe(target.current);
    }

    return () => observer.disconnect();
  }, []);

  return <Wrapper ref={target} />;
}

const Wrapper = styled.div`
  height: 20px;
`;
