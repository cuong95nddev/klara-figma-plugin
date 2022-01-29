import {
  render,
  RenderProps,
  unmountComponentAtNode,
} from "@react-three/fiber";
import React, {
  Component,
  forwardRef,
  ForwardRefRenderFunction,
  Suspense,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import styled from "styled-components";

export declare interface BlockProps {
  set: any;
}

const Block = ({ set }: BlockProps) => {
  useLayoutEffect(() => {
    set(new Promise(() => null));
    return () => set(false);
  }, [set]);

  return null;
};

export declare interface ErrorBoundaryProps {
  set: any;
}

export declare interface ErrorBoundaryState {
  error: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { error: false };
  static getDerivedStateFromError = () => ({ error: true });
  componentDidCatch(error: any) {
    this.props.set(error);
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

export interface CanvasProps extends RenderProps<HTMLCanvasElement> {}

const CanvasInner: ForwardRefRenderFunction<
  HTMLCanvasElement,
  CanvasProps & { children?: React.ReactNode }
> = ({ children, ...props }, ref: any) => {
  const container = useRef<HTMLDivElement>(null);

  const [block, setBlock] = useState();
  const [error, setError] = useState();

  // Suspend this component if block is a promise (2nd run)
  if (block) throw block;
  // Throw exception outwards if anything within canvas throws
  if (error) throw error;

  // Render to canvas
  useLayoutEffect(() => {
    render(
      <ErrorBoundary set={setError}>
        <Suspense fallback={<Block set={setBlock} />}>{children}</Suspense>
      </ErrorBoundary>,
      ref,
      props
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  // Cleanup on unmount
  useLayoutEffect(() => {
    return () => unmountComponentAtNode(ref);
  }, []);

  return (
    <CanvasContainer className="canvas-container" ref={container}>
      <CanvasStyled className="canvas" aria-hidden ref={ref} />
    </CanvasContainer>
  );
};

const Canvas = forwardRef(CanvasInner);

const CanvasContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const CanvasStyled = styled.canvas`
  position: absolute;
  inset: 0;
  outline: none;
  cursor: grab;
  opacity: 0;
  animation: fade-in 0.4s ease forwards;
`;

export default Canvas;
