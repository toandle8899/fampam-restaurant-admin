import { useEffect, useRef } from "react";
import Matter from "matter-js";

const images = [
  "/food/edamame.png",
  "/food/summer-rolls.png",
  "/food/wagyu-carpaccio.png",
  "/food/lotus-chips.png",
  "/food/cha-ca.png",
  "/food/banh-mi.png",
  "/food/pho-old-fashioned.png",
];

export const FooterStickers = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Setup Matter.js
    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite;

    const engine = Engine.create();
    engineRef.current = engine;
    
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        pixelRatio: window.devicePixelRatio
      }
    });
    
    // Apply pointer-events auto to the canvas so it can receive mouse events
    render.canvas.style.pointerEvents = "auto";

    // Create boundaries with massive thickness to prevent clipping due to dt throttling
    const ground = Bodies.rectangle(width / 2, height + 500, width * 5, 1000, { isStatic: true, render: { visible: false } });
    const leftWall = Bodies.rectangle(-500, height / 2, 1000, height * 10, { isStatic: true, render: { visible: false } });
    const rightWall = Bodies.rectangle(width + 500, height / 2, 1000, height * 10, { isStatic: true, render: { visible: false } });
    
    Composite.add(engine.world, [ground, leftWall, rightWall]);

    // Create food stickers
    const stickers = images.map((imgSrc, i) => {
      const x = width * 0.2 + Math.random() * (width * 0.6);
      const y = -200 - (i * 120); // stagger falling higher up
      
      return Bodies.circle(x, y, 45, {
        restitution: 0.5, // slightly less bouncy to prevent flying over walls
        friction: 0.2,
        density: 0.05,
        render: {
          sprite: {
            texture: imgSrc,
            xScale: 0.35,
            yScale: 0.35
          }
        }
      });
    });

    Composite.add(engine.world, stickers);

    // Add mouse control
    const mouse = Mouse.create(render.canvas);
    
    // Fix page scrolling being blocked by matter.js on trackpads/mice
    mouse.element.removeEventListener("mousewheel", (mouse as any).mousewheel);
    mouse.element.removeEventListener("DOMMouseScroll", (mouse as any).mousewheel);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });

    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    Render.run(render);
    
    const runner = Runner.create();
    Runner.run(runner, engine);

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      render.canvas.width = newWidth * window.devicePixelRatio;
      render.canvas.height = newHeight * window.devicePixelRatio;
      render.options.width = newWidth;
      render.options.height = newHeight;
      
      Matter.Body.setPosition(ground, { x: newWidth / 2, y: newHeight + 500 });
      Matter.Body.setPosition(rightWall, { x: newWidth + 500, y: newHeight / 2 });
      Matter.Body.setPosition(leftWall, { x: -500, y: newHeight / 2 });
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
      Render.stop(render);
      Runner.stop(runner);
      if (engineRef.current) {
        World.clear(engineRef.current.world, false);
        Engine.clear(engineRef.current);
      }
      render.canvas.remove();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute inset-0 z-0 pointer-events-none" 
      style={{ overflow: 'hidden' }}
    />
  );
};

export default FooterStickers;
