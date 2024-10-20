export function WaitUntilInteracted(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    const ctx = new AudioContext();
    const emptySourceNode = ctx.createBufferSource();
    emptySourceNode.buffer = ctx.createBuffer(1, 1, 22050);
    emptySourceNode.connect(ctx.destination);
    emptySourceNode.start();
    const int = setInterval(() => {
      ctx.resume();
      if (ctx.state === "running") {
        clearInterval(int);
        emptySourceNode.stop();
        resolve();
      }
    }, 1000 / 24);
  });
}
