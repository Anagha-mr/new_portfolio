"use client";

/**
 * Dark-room / gallery lighting: one controlled key light, a very low
 * ambient fill so nothing goes fully black, and a faint cherry bounce for
 * material definition. Deliberately no rim light or bloom — those read as
 * "gaming," not "editorial."
 */
export function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.26} color="#817b73" />
      <directionalLight
        position={[4, 3.5, 5]}
        intensity={1.1}
        color="#f1ede5"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-radius={4}
      />
      <pointLight position={[-3, -1.5, -2]} intensity={0.35} color="#850e17" distance={8} decay={2} />
    </>
  );
}
