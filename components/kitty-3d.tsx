"use client"

import { Suspense, useEffect, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

type VectorRef = { current: THREE.Vector3 }
type RopePoint = { position: THREE.Vector3; previous: THREE.Vector3 }

const ROPE_SEGMENTS = 7
const ROPE_SEGMENT_LENGTH = 0.6
const YARN_ANCHOR_X = 2.5
const YARN_PLANE_POINT = new THREE.Vector3(YARN_ANCHOR_X, 6, 0)
// Generous safety net only; real bounds come from the camera's own frustum.
const ANCHOR_MIN = new THREE.Vector3(-30, -30, -30)
const ANCHOR_MAX = new THREE.Vector3(30, 30, 30)
const ARM_REACH_DISTANCE = 11
const FULL_REACH_DISTANCE = 6.5

// Tracks the pointer across the whole page and raycasts it onto a fixed plane
// in front of the cat, so the yarn's anchor matches the cursor everywhere, not
// just inside the canvas.
function PointerAnchor({ anchorRef }: { anchorRef: VectorRef }) {
  const { camera, gl } = useThree()
  const pointerRef = useRef({ x: 0, y: 0 })
  const planeRef = useRef(new THREE.Plane())
  const raycasterRef = useRef(new THREE.Raycaster())

  useEffect(() => {
  const handlePointerMove = (event: PointerEvent) => {
    const canvas = gl.domElement
    const rect = canvas.getBoundingClientRect()

    pointerRef.current.x =
      ((event.clientX - rect.left) / rect.width) * 2 - 1

    pointerRef.current.y =
      -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  window.addEventListener("pointermove", handlePointerMove)

  return () => {
    window.removeEventListener("pointermove", handlePointerMove)
  }
}, [gl])

  useEffect(() => {
    const planeNormal = camera.position.clone().sub(YARN_PLANE_POINT).normalize()
    planeRef.current.setFromNormalAndCoplanarPoint(planeNormal, YARN_PLANE_POINT)
  }, [camera])

  useFrame(() => {
    raycasterRef.current.setFromCamera(new THREE.Vector2(pointerRef.current.x, pointerRef.current.y), camera)
    const intersection = new THREE.Vector3()
    const hit = raycasterRef.current.ray.intersectPlane(planeRef.current, intersection)

    if (hit) {
      anchorRef.current.copy(intersection.clamp(ANCHOR_MIN, ANCHOR_MAX))
    }
  })

  return null
}

type CatRig = {
  head?: THREE.Object3D
  shoulder?: THREE.Object3D
  elbow?: THREE.Object3D
  paw?: THREE.Object3D

  leftEye?: THREE.Object3D
rightEye?: THREE.Object3D

leftEyeRestScale?: THREE.Vector3
rightEyeRestScale?: THREE.Vector3


  tailBones: THREE.Object3D[]

  headRestRotation: THREE.Euler
  shoulderRestRotation: THREE.Euler
  elbowRestRotation: THREE.Euler
  pawRestRotation: THREE.Euler
  shoulderRestPosition: THREE.Vector3
}

function CatModel({
  yarnRef,
  pawRef,
  grabbedRef,
}: {
  yarnRef: VectorRef
  pawRef: VectorRef
  grabbedRef: React.MutableRefObject<boolean>
}) {
  const { scene } = useGLTF("/cat.glb")

  const rigRef = useRef<CatRig>({
    tailBones: [],
    headRestRotation: new THREE.Euler(),
    shoulderRestRotation: new THREE.Euler(),
    elbowRestRotation: new THREE.Euler(),
    pawRestRotation: new THREE.Euler(),
    shoulderRestPosition: new THREE.Vector3(),
  })

  const armStateRef =
    useRef<"rest" | "ready" | "attack">("rest")

  const attackStartedAtRef = useRef(0)
  const nextAttackAllowedAtRef = useRef(0)
  const attackTargetRef =
  useRef(new THREE.Vector3())

  const nextBlinkAtRef = useRef(
  performance.now() + 1500 + Math.random() * 2500
)

const blinkStartedAtRef = useRef(0)
const isBlinkingRef = useRef(false)

  // ============================================================
  // FIND BONES
  // ============================================================

  useEffect(() => {
    const rig: CatRig = {
      tailBones: [],
      headRestRotation: new THREE.Euler(),
      shoulderRestRotation: new THREE.Euler(),
      elbowRestRotation: new THREE.Euler(),
      pawRestRotation: new THREE.Euler(),
      shoulderRestPosition: new THREE.Vector3(),
    }

    scene.traverse((object) => {
        const normalizedName = object.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")

        
         // Eyes are child objects/meshes of cathead,
  // not necessarily bones.
  if (normalizedName === "lefteye") {
    rig.leftEye = object
  }

  if (normalizedName === "righteye") {
    rig.rightEye = object
  }



      if (object.type !== "Bone") return

  
      if (
        !rig.head &&
        (
          normalizedName === "head" ||
          normalizedName === "cathead"
        )
      ) {
        rig.head = object
      }

      if (normalizedName.startsWith("tail")) {
        rig.tailBones.push(object)
      }
      

      if (normalizedName === "shoulder") {
        rig.shoulder = object
      }

      if (normalizedName === "elbow") {
        rig.elbow = object
      }

      if (normalizedName === "paw") {
        rig.paw = object
      }

    })

    rig.tailBones.sort(
      (first, second) =>
        first.name.localeCompare(
          second.name,
          undefined,
          { numeric: true }
        )
    )

      rig.leftEyeRestScale =
  rig.leftEye?.scale.clone()

rig.rightEyeRestScale =
  rig.rightEye?.scale.clone()

    rig.headRestRotation =
      rig.head?.rotation.clone() ??
      new THREE.Euler()

    rig.shoulderRestRotation =
      rig.shoulder?.rotation.clone() ??
      new THREE.Euler()

    rig.elbowRestRotation =
      rig.elbow?.rotation.clone() ??
      new THREE.Euler()

    rig.pawRestRotation =
      rig.paw?.rotation.clone() ??
      new THREE.Euler()

    rig.shoulder?.getWorldPosition(
      rig.shoulderRestPosition
    )

    rigRef.current = rig
  }, [scene])

  // ============================================================
  // ANIMATION
  // ============================================================

  useFrame((_, delta) => {
    const rig = rigRef.current
    const now = performance.now()

    const {
      head,
      shoulder,
      elbow,
      paw,
      tailBones,
      headRestRotation,
      shoulderRestRotation,
      elbowRestRotation,
      pawRestRotation,
    } = rig

    // ==========================================================
    // HELPERS
    // ==========================================================

    const smooth = (
      current: number,
      target: number,
      speed: number
    ) =>
      THREE.MathUtils.damp(
        current,
        target,
        speed,
        delta
      )

    const smoothAngle = (
      current: number,
      target: number,
      speed: number
    ) => {
      const difference =
        Math.atan2(
          Math.sin(target - current),
          Math.cos(target - current)
        )

      return (
        current +
        difference *
          (1 - Math.exp(-speed * delta))
      )
    }

    const smoothQuaternion = (
      current: THREE.Quaternion,
      target: THREE.Quaternion,
      speed: number
    ) => {
      const amount =
        1 - Math.exp(-speed * delta)

      const adjustedTarget =
        target.clone()

      /*
       * Keep the target quaternion in a consistent
       * hemisphere so transitions don't suddenly
       * perform a full spin.
       */
      if (
        current.dot(adjustedTarget) < 0
      ) {
        adjustedTarget.x *= -1
        adjustedTarget.y *= -1
        adjustedTarget.z *= -1
        adjustedTarget.w *= -1
      }

      current.slerp(
        adjustedTarget,
        amount
      )
    }

    const quaternionFromRotation = (
      x: number,
      y: number,
      z: number,
      order: THREE.EulerOrder = "XYZ"
    ) => {
      return new THREE.Quaternion()
        .setFromEuler(
          new THREE.Euler(
            x,
            y,
            z,
            order
          )
        )
    }

    // ==========================================================
    // HEAD
    // ==========================================================

    if (head) {
      const headPosition =
        new THREE.Vector3()

      head.getWorldPosition(
        headPosition
      )

      const headToBall =
        yarnRef.current
          .clone()
          .sub(headPosition)

      const desiredYaw =
        headRestRotation.y -
        THREE.MathUtils.clamp(
          headToBall.z * 0.18,
          -0.6,
          0.6
        )

      const desiredPitch =
        headRestRotation.z +
        THREE.MathUtils.clamp(
          headToBall.y * 0.22,
          -0.6,
          0.6
        )

      head.rotation.y =
        smoothAngle(
          head.rotation.y,
          desiredYaw,
          5
        )

      head.rotation.z =
        smoothAngle(
          head.rotation.z,
          desiredPitch,
          5
        )
    }

   // ==========================================================
// EYE BLINK
// ==========================================================

const {
  leftEye,
  rightEye,
  leftEyeRestScale,
  rightEyeRestScale,
} = rig

if (
  leftEye &&
  rightEye &&
  leftEyeRestScale &&
  rightEyeRestScale
) {
  const BLINK_DURATION = 160

  if (
    !isBlinkingRef.current &&
    now >= nextBlinkAtRef.current
  ) {
    isBlinkingRef.current = true
    blinkStartedAtRef.current = now
  }

  if (isBlinkingRef.current) {
    const progress =
      THREE.MathUtils.clamp(
        (now - blinkStartedAtRef.current) /
          BLINK_DURATION,
        0,
        1
      )

    // 0 open
    // 1 closed
    // 0 open
    const blinkAmount =
      Math.sin(progress * Math.PI)

    const scaleMultiplier =
      THREE.MathUtils.lerp(
        1,
        0.05,
        blinkAmount
      )

    // Multiply ORIGINAL Blender scale.
    leftEye.scale.set(
      leftEyeRestScale.x,
      leftEyeRestScale.y * scaleMultiplier,
      leftEyeRestScale.z
    )

    rightEye.scale.set(
      rightEyeRestScale.x,
      rightEyeRestScale.y * scaleMultiplier,
      rightEyeRestScale.z
    )

    if (progress >= 1) {
      isBlinkingRef.current = false

      // Restore EXACT original transforms.
      leftEye.scale.copy(
        leftEyeRestScale
      )

      rightEye.scale.copy(
        rightEyeRestScale
      )

      const doubleBlink =
        Math.random() < 0.18

      nextBlinkAtRef.current =
        doubleBlink
          ? now + 180 + Math.random() * 120
          : now + 2000 + Math.random() * 4000
    }
  } else {
    // Force original Blender scale while not blinking.
    leftEye.scale.copy(
      leftEyeRestScale
    )

    rightEye.scale.copy(
      rightEyeRestScale
    )
  }
}

    // ==========================================================
    // ARM
    // ==========================================================

    if (shoulder && elbow && paw) {
      const shoulderPosition =
        new THREE.Vector3()

      const elbowPosition =
        new THREE.Vector3()

      const pawPosition =
        new THREE.Vector3()

      shoulder.getWorldPosition(
        shoulderPosition
      )

      elbow.getWorldPosition(
        elbowPosition
      )

      paw.getWorldPosition(
        pawPosition
      )

      const toBall =
        yarnRef.current
          .clone()
          .sub(shoulderPosition)

      const distanceFromShoulder =
        toBall.length()

      const distanceFromPaw =
        pawPosition.distanceTo(
          yarnRef.current
        )

      // ========================================================
      // SETTINGS
      // ========================================================

      const READY_RADIUS = 11

      /*
       * Keep your current larger attack radius.
       */
      const ATTACK_RADIUS = 4.5

      /*
       * Faster overall attack.
       */
      const ATTACK_DURATION = 340

      const MIN_ATTACK_INTERVAL = 100
const MAX_ATTACK_INTERVAL = 1500

const getRandomAttackInterval = () =>
  MIN_ATTACK_INTERVAL +
  Math.random() *
    (MAX_ATTACK_INTERVAL - MIN_ATTACK_INTERVAL)

      // --------------------------------------------------------
      // READY ARM POSE
      // --------------------------------------------------------

      const READY_SHOULDER_X = 0.35

      /*
       * IMPORTANT:
       *
       * Changed from +Math.PI to -Math.PI.
       *
       * Same final orientation, but puts the
       * horizontal transition on the other side.
       */
      const READY_SHOULDER_Y = 0

      const READY_SHOULDER_Z = 0.55

      const READY_ELBOW_Z = 1.45
      const READY_PAW_Z = 0.35

      // --------------------------------------------------------
      // STRAIGHT ATTACK POSE
      // --------------------------------------------------------

      const STRAIGHT_ELBOW_Z = 0
      const STRAIGHT_PAW_Z = 0

      // ========================================================
      // STATE MACHINE
      // ========================================================

      const state =
        armStateRef.current

      if (state === "attack") {
  // Stop attacking once kitty has caught the yarn.
  if (grabbedRef.current) {
    armStateRef.current = "ready"
  }

  const attackAge =
    now - attackStartedAtRef.current

        if (
          attackAge >=
          ATTACK_DURATION
        ) {
          armStateRef.current =
            distanceFromShoulder <
            READY_RADIUS
              ? "ready"
              : "rest"
        }
      } else {
        if (
          distanceFromShoulder >=
          READY_RADIUS
        ) {
          armStateRef.current =
            "rest"
        } else {
          armStateRef.current =
            "ready"

if (
  !grabbedRef.current &&
  distanceFromPaw < ATTACK_RADIUS &&
  now > nextAttackAllowedAtRef.current
) {
  // Lock onto the yarn's CURRENT position.
  // It cannot track the yarn after this point.
  attackTargetRef.current.copy(
    yarnRef.current
  )

  armStateRef.current = "attack"
  attackStartedAtRef.current = now

  nextAttackAllowedAtRef.current =
    now + getRandomAttackInterval()
}
        }
      }

      const currentState =
        armStateRef.current

      // ========================================================
      // REST
      // ========================================================

      if (currentState === "rest") {
        const restShoulderQuaternion =
          quaternionFromRotation(
            shoulderRestRotation.x,
            shoulderRestRotation.y,
            shoulderRestRotation.z,
            shoulder.rotation.order
          )

        smoothQuaternion(
          shoulder.quaternion,
          restShoulderQuaternion,
          6
        )

        elbow.rotation.x =
          smoothAngle(
            elbow.rotation.x,
            elbowRestRotation.x,
            7
          )

        elbow.rotation.y =
          smoothAngle(
            elbow.rotation.y,
            elbowRestRotation.y,
            7
          )

        elbow.rotation.z =
          smoothAngle(
            elbow.rotation.z,
            elbowRestRotation.z,
            7
          )

        paw.rotation.x =
          smoothAngle(
            paw.rotation.x,
            pawRestRotation.x,
            7
          )

        paw.rotation.y =
          smoothAngle(
            paw.rotation.y,
            pawRestRotation.y,
            7
          )

        paw.rotation.z =
          smoothAngle(
            paw.rotation.z,
            pawRestRotation.z,
            7
          )
      }

      // ========================================================
      // READY
      // ========================================================

      else if (
        currentState === "ready"
      ) {
        const direction =
          toBall.clone()

        if (
          direction.lengthSq() >
          0.000001
        ) {
          direction.normalize()
        }

        const followX =
          THREE.MathUtils.clamp(
            direction.x,
            -1,
            1
          )

        const followY =
          THREE.MathUtils.clamp(
            direction.y,
            -1,
            1
          )

        const followZ =
          THREE.MathUtils.clamp(
            direction.z,
            -1,
            1
          )

        // ------------------------------------------------------
        // SHOULDER FOLLOWS YARN
        // ------------------------------------------------------

        const targetShoulderX =
  shoulderRestRotation.x +
  READY_SHOULDER_X -
  followX * 0.18

const targetShoulderY =
  shoulderRestRotation.y +
  followZ * 0.65

const targetShoulderZ =
  shoulderRestRotation.z +
  READY_SHOULDER_Z +
  followY * 0.55

        const readyShoulderQuaternion =
          quaternionFromRotation(
            targetShoulderX,
            targetShoulderY,
            targetShoulderZ,
            shoulder.rotation.order
          )

        smoothQuaternion(
          shoulder.quaternion,
          readyShoulderQuaternion,
          7
        )

        // ------------------------------------------------------
        // CURVED ELBOW
        // ------------------------------------------------------

        elbow.rotation.x =
          smoothAngle(
            elbow.rotation.x,
            elbowRestRotation.x,
            8
          )

        elbow.rotation.y =
          smoothAngle(
            elbow.rotation.y,
            elbowRestRotation.y,
            8
          )

        elbow.rotation.z =
          smoothAngle(
            elbow.rotation.z,
            elbowRestRotation.z +
              READY_ELBOW_Z,
            9
          )

        // ------------------------------------------------------
        // CURVED PAW
        // ------------------------------------------------------

        paw.rotation.x =
          smoothAngle(
            paw.rotation.x,
            pawRestRotation.x,
            8
          )

        paw.rotation.y =
          smoothAngle(
            paw.rotation.y,
            pawRestRotation.y,
            8
          )

        paw.rotation.z =
          smoothAngle(
            paw.rotation.z,
            pawRestRotation.z +
              READY_PAW_Z,
            9
          )
      }

      // ========================================================
      // ATTACK
      // ========================================================

      else if (
        currentState === "attack"
      ) {
        const attackAge =
          now -
          attackStartedAtRef.current

        const progress =
          THREE.MathUtils.clamp(
            attackAge /
              ATTACK_DURATION,
            0,
            1
          )

        // ------------------------------------------------------
        // FAST STRIKE CURVE
        // ------------------------------------------------------
        //
        // Peak extension at 32% instead of 45%.
        // With 340ms duration this is about 109ms.
        //

        let attackAmount = 0

        if (progress < 0.32) {
          const p =
            progress / 0.32

          attackAmount =
            p *
            p *
            (3 - 2 * p)
        } else {
          const p =
            (
              progress -
              0.32
            ) / 0.68

          attackAmount =
            1 -
            p *
              p *
              (3 - 2 * p)
        }

        // ======================================================
        // READY SHOULDER POSE
        // ======================================================

        const direction =
  attackTargetRef.current
    .clone()
    .sub(
      shoulderPosition
    )

        if (
          direction.lengthSq() >
          0.000001
        ) {
          direction.normalize()
        }

        const followX =
          THREE.MathUtils.clamp(
            direction.x,
            -1,
            1
          )

        const followY =
          THREE.MathUtils.clamp(
            direction.y,
            -1,
            1
          )

        const followZ =
          THREE.MathUtils.clamp(
            direction.z,
            -1,
            1
          )

        const readyShoulderX =
          shoulderRestRotation.x +
          READY_SHOULDER_X -
          followX * 0.18

        const readyShoulderY =
          shoulderRestRotation.y +
          READY_SHOULDER_Y +
          followZ * 0.65

        const readyShoulderZ =
          shoulderRestRotation.z +
          READY_SHOULDER_Z -
          followY * 0.55

        const readyShoulderQuaternion =
          quaternionFromRotation(
            readyShoulderX,
            readyShoulderY,
            readyShoulderZ,
            shoulder.rotation.order
          )

        // ======================================================
        // AIM WHOLE ARM TOWARD YARN
        // ======================================================

        const currentUpperArmDirection =
          elbowPosition
            .clone()
            .sub(
              shoulderPosition
            )

       const desiredArmDirection =
  attackTargetRef.current
    .clone()
    .sub(
      shoulderPosition
    )

        if (
          currentUpperArmDirection.lengthSq() >
            0.000001 &&
          desiredArmDirection.lengthSq() >
            0.000001
        ) {
          currentUpperArmDirection.normalize()
          desiredArmDirection.normalize()

          /*
           * Rotation required to make the
           * shoulder -> elbow direction point
           * directly toward the yarn.
           */
          const aimDelta =
            new THREE.Quaternion()
              .setFromUnitVectors(
                currentUpperArmDirection,
                desiredArmDirection
              )

          const currentWorldQuaternion =
            new THREE.Quaternion()

          shoulder.getWorldQuaternion(
            currentWorldQuaternion
          )

          const aimedWorldQuaternion =
            aimDelta
              .clone()
              .multiply(
                currentWorldQuaternion
              )

          const parentWorldQuaternion =
            new THREE.Quaternion()

          if (shoulder.parent) {
            shoulder.parent
              .getWorldQuaternion(
                parentWorldQuaternion
              )
          }

          const aimedLocalQuaternion =
            parentWorldQuaternion
              .clone()
              .invert()
              .multiply(
                aimedWorldQuaternion
              )

          /*
           * Curved READY shoulder
           *       ↓
           * direct straight aim
           *       ↓
           * curved READY shoulder
           */
          const directAimAmount =
  THREE.MathUtils.clamp(
    attackAmount * 1.35,
    0,
    1
  )

const attackShoulderQuaternion =
  readyShoulderQuaternion
    .clone()
    .slerp(
      aimedLocalQuaternion,
      directAimAmount
    )

          smoothQuaternion(
            shoulder.quaternion,
            attackShoulderQuaternion,
            16
          )
        } else {
          smoothQuaternion(
            shoulder.quaternion,
            readyShoulderQuaternion,
            10
          )
        }

        // ======================================================
// STRAIGHTEN ELBOW COMPLETELY
// ======================================================

const straightenAmount =
  THREE.MathUtils.clamp(
    attackAmount * 1.6,
    0,
    1
  )

const targetElbowX =
  THREE.MathUtils.lerp(
    elbowRestRotation.x,
    0,
    straightenAmount
  )

const targetElbowY =
  THREE.MathUtils.lerp(
    elbowRestRotation.y,
    0,
    straightenAmount
  )

const targetElbowZ =
  THREE.MathUtils.lerp(
    elbowRestRotation.z + READY_ELBOW_Z,
    0,
    straightenAmount
  )

elbow.rotation.x =
  smoothAngle(
    elbow.rotation.x,
    targetElbowX,
    24
  )

elbow.rotation.y =
  smoothAngle(
    elbow.rotation.y,
    targetElbowY,
    24
  )

elbow.rotation.z =
  smoothAngle(
    elbow.rotation.z,
    targetElbowZ,
    24
  )

        // ======================================================
        // STRAIGHTEN PAW
        // ======================================================
// ======================================================
// STRAIGHTEN PAW COMPLETELY
// ======================================================

const targetPawX =
  THREE.MathUtils.lerp(
    pawRestRotation.x,
    0,
    straightenAmount
  )

const targetPawY =
  THREE.MathUtils.lerp(
    pawRestRotation.y,
    0,
    straightenAmount
  )

const targetPawZ =
  THREE.MathUtils.lerp(
    pawRestRotation.z + READY_PAW_Z,
    0,
    straightenAmount
  )

paw.rotation.x =
  smoothAngle(
    paw.rotation.x,
    targetPawX,
    24
  )

paw.rotation.y =
  smoothAngle(
    paw.rotation.y,
    targetPawY,
    24
  )

paw.rotation.z =
  smoothAngle(
    paw.rotation.z,
    targetPawZ,
    24
  )
      }

      // ========================================================
      // PUBLISH PAW POSITION
      // ========================================================

      paw.getWorldPosition(
        pawRef.current
      )
    }

    // ==========================================================
    // TAIL
    // ==========================================================

    tailBones.forEach(
      (tail, index) => {
        const targetRotation =
          Math.sin(
            now *
              0.00135 -
              index * 0.45
          ) *
          (
            0.6 -
            index * 0.06
          )

        tail.rotation.x =
          smooth(
            tail.rotation.x,
            targetRotation,
            5
          )
      }
    )
  })

  return (
  <primitive
    object={scene}
    position={[0, 3.5, 0]}
  />
)
}

function YarnBall({
  anchorRef,
  yarnRef,
  pawRef,
  grabbedRef,
}: {
  anchorRef: VectorRef
  yarnRef: VectorRef
  pawRef: VectorRef
  grabbedRef: React.MutableRefObject<boolean>
}) {
  const { scene } = useGLTF("/Yarn.glb")

  const groupRef = useRef<THREE.Group>(null)
  const ballRef = useRef<THREE.Object3D>(null)

  // ------------------------------------------------------------
  // GRAB STATE
  // ------------------------------------------------------------


  // Time at which the cat loses its grip.
  const releaseAtRef = useRef(0)

  // Prevent immediate re-grabbing after release.
  const grabCooldownUntilRef = useRef(0)

  // How far from the paw the yarn sits while being held.
  const grabOffsetRef = useRef(new THREE.Vector3())

  const ropeRef = useRef<RopePoint[]>(
    Array.from(
      { length: ROPE_SEGMENTS + 1 },
      (_, index) => ({
        position: new THREE.Vector3(
          YARN_ANCHOR_X,
          7.5 - index * ROPE_SEGMENT_LENGTH,
          0
        ),
        previous: new THREE.Vector3(
          YARN_ANCHOR_X,
          7.5 - index * ROPE_SEGMENT_LENGTH,
          0
        ),
      })
    )
  )

  const lineRef = useRef<THREE.Line>(
    (() => {
      const geometry =
        new THREE.BufferGeometry()

      geometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array(
            (ROPE_SEGMENTS + 1) * 3
          ),
          3
        )
      )

      return new THREE.Line(
        geometry,
        new THREE.LineBasicMaterial({
          color: "#028090",
        })
      )
    })()
  )

  useEffect(() => {
    const group = groupRef.current
    const line = lineRef.current

    group?.add(line)

    return () => {
      group?.remove(line)
    }
  }, [])

  useFrame((_, delta) => {
    const rope = ropeRef.current
    const now = performance.now()

    // ----------------------------------------------------------
    // ANCHOR
    // ----------------------------------------------------------

    const anchor = rope[0]

    anchor.position.copy(
      anchorRef.current
    )

    anchor.previous.copy(
      anchor.position
    )

    // ----------------------------------------------------------
    // NORMAL ROPE PHYSICS
    // ----------------------------------------------------------

    /*
     * Don't run normal gravity/inertia on the final ball
     * while the cat has it in its paw.
     *
     * The other rope points can still move normally,
     * allowing the string to stretch toward the paw.
     */
    for (
      let index = 1;
      index < rope.length;
      index += 1
    ) {
      const point = rope[index]

      // Final point = yarn ball.
      const isBall =
        index === rope.length - 1

      if (grabbedRef.current && isBall) {
        continue
      }

      const velocity = point.position
        .clone()
        .sub(point.previous)
        .multiplyScalar(0.9)

      point.previous.copy(
        point.position
      )

      point.position.add(velocity)

      point.position.y -= 0.02
    }

    const ball =
      rope[rope.length - 1]

    // ----------------------------------------------------------
    // DETECT PAW CONTACT
    // ----------------------------------------------------------

    const distanceToPaw =
  ball.position.distanceTo(
    pawRef.current
  )

const GRAB_RADIUS = 1.8

if (
  !grabbedRef.current &&
  now > grabCooldownUntilRef.current &&
  distanceToPaw < GRAB_RADIUS
) {
  grabbedRef.current = true

  const holdDuration =
    650 + Math.random() * 950

  releaseAtRef.current =
    now + holdDuration

  grabOffsetRef.current
    .copy(ball.position)
    .sub(pawRef.current)

  if (
    grabOffsetRef.current.length() >
    0.35
  ) {
    grabOffsetRef.current
      .normalize()
      .multiplyScalar(0.35)
  }
}

    // ----------------------------------------------------------
    // CAT IS HOLDING YARN
    // ----------------------------------------------------------

    if (grabbedRef.current) {
      /*
       * Pin the ball to the animated paw.
       */
      const heldPosition =
        pawRef.current
          .clone()
          .add(
            grabOffsetRef.current
          )

      /*
       * Smooth it very slightly so the ball feels
       * grabbed rather than rigidly welded.
       */
      ball.position.lerp(
        heldPosition,
        0.82
      )

      /*
       * Kill normal ball velocity while held.
       */
      ball.previous.copy(
        ball.position
      )

      // --------------------------------------------------------
      // STRING STRETCH
      // --------------------------------------------------------

      /*
       * While grabbed, allow every rope segment to become
       * longer than normal.
       *
       * Normal:
       *     0.6
       *
       * Grabbed:
       *     ~0.9
       *
       * This makes the string visibly lengthen as the cat
       * pulls the ball away.
       */
      const grabbedSegmentLength =
        ROPE_SEGMENT_LENGTH * 0.5

      for (
        let iteration = 0;
        iteration < 6;
        iteration += 1
      ) {
        for (
          let index = 1;
          index < rope.length;
          index += 1
        ) {
          const previous =
            rope[index - 1]

          const point =
            rope[index]

          const isBall =
            index === rope.length - 1

          const delta =
            point.position
              .clone()
              .sub(previous.position)

          const distance =
            delta.length() || 1

          const correction =
            delta.multiplyScalar(
              (
                distance -
                grabbedSegmentLength
              ) / distance
            )

          /*
           * Never move the ball away from the paw
           * while grabbed.
           *
           * Instead, pull the rope toward the ball.
           */
          if (isBall) {
            previous.position.add(
              correction
            )
          } else if (index === 1) {
            point.position.sub(
              correction
            )
          } else {
            previous.position.add(
              correction
                .clone()
                .multiplyScalar(0.5)
            )

            point.position.sub(
              correction
                .clone()
                .multiplyScalar(0.5)
            )
          }
        }

        /*
         * Re-pin after each solver pass so the rope
         * can never pull the yarn out of the paw.
         */
        ball.position.copy(
          heldPosition
        )
      }

      // --------------------------------------------------------
      // ESCAPE!
      // --------------------------------------------------------

// --------------------------------------------------------
// ESCAPE / RANDOM CAT PUSH
// --------------------------------------------------------

if (now >= releaseAtRef.current) {
  grabbedRef.current = false

  // Prevent instant re-grabbing.
  grabCooldownUntilRef.current =
    now + 1450

  /*
   * Randomly decide whether kitty actively bats
   * the yarn away or simply loses its grip.
   *
   * 45% chance of a deliberate push.
   */
  const catPushesBall =
    Math.random() < 0.75

  // Direction FROM paw TO yarn.
  //
  // This means the force naturally travels away
  // from the cat's paw.
  const awayFromPaw =
    ball.position
      .clone()
      .sub(pawRef.current)

  if (awayFromPaw.lengthSq() < 0.0001) {
    /*
     * Ball is almost exactly centered on paw,
     * so use the shoulder/anchor side to determine
     * an outward direction instead.
     */
    awayFromPaw
      .copy(ball.position)
      .sub(anchorRef.current)

    if (awayFromPaw.lengthSq() < 0.0001) {
      awayFromPaw.set(
        0.5,
        -0.15,
        0.25
      )
    }
  }

  awayFromPaw.normalize()

  if (catPushesBall) {
    // ======================================================
    // CAT BATS / PUSHES BALL AWAY
    // ======================================================

    /*
     * Strong outward movement.
     *
     * Keep most of the velocity pointing directly
     * away from the paw, then add just enough
     * randomness to keep every bat unique.
     */
    const pushDirection =
      awayFromPaw.clone()

    pushDirection.x +=
      (Math.random() - 0.5) * 0.25

    pushDirection.y +=
      (Math.random() - 0.5) * 0.2

    pushDirection.z +=
      (Math.random() - 0.5) * 0.25

    pushDirection.normalize()

    /*
     * Cat pushes are noticeably stronger
     * than a normal escape.
     */
    const pushStrength =
      5.15 +
      Math.random() * 0.65

    /*
     * Verlet velocity:
     *
     * velocity =
     * position - previous
     *
     * Therefore putting previous behind the ball
     * launches the ball forward.
     */
    ball.previous.copy(
      ball.position
        .clone()
        .sub(
          pushDirection.multiplyScalar(
            pushStrength
          )
        )
    )

    /*
     * Longer cooldown after a deliberate bat,
     * otherwise kitty can immediately grab the
     * ball it just pushed.
     */
    grabCooldownUntilRef.current =
      now + 1800
  } else {
    // ======================================================
    // NORMAL ESCAPE FROM GRIP
    // ======================================================

    const escapeDirection =
      awayFromPaw.clone()

    /*
     * More randomness than the deliberate push.
     * This should feel like the yarn slipping free.
     */
    escapeDirection.x +=
      (Math.random() - 0.5) * 0.5

    escapeDirection.y +=
      0.1 +
      Math.random() * 0.25

    escapeDirection.z +=
      (Math.random() - 0.5) * 0.5

    escapeDirection.normalize()

    const escapeStrength =
      0.55 +
      Math.random() * 0.35

    ball.previous.copy(
      ball.position
        .clone()
        .sub(
          escapeDirection.multiplyScalar(
            escapeStrength
          )
        )
    )
  }
}

    // ----------------------------------------------------------
    // NORMAL ROPE CONSTRAINTS
    // ----------------------------------------------------------

} else {
      /*
       * Once released, return immediately to the normal
       * rope segment length.
       *
       * That creates a nice little snap/tension effect
       * after the yarn escapes.
       */
      for (
        let iteration = 0;
        iteration < 6;
        iteration += 1
      ) {
        for (
          let index = 1;
          index < rope.length;
          index += 1
        ) {
          const previous =
            rope[index - 1]

          const point =
            rope[index]

          const delta =
            point.position
              .clone()
              .sub(previous.position)

          const distance =
            delta.length() || 1

          const correction =
            delta.multiplyScalar(
              (
                distance -
                ROPE_SEGMENT_LENGTH
              ) / distance
            )

          if (index === 1) {
            point.position.sub(
              correction
            )
          } else {
            previous.position.add(
              correction
                .clone()
                .multiplyScalar(0.5)
            )

            point.position.sub(
              correction
                .clone()
                .multiplyScalar(0.5)
            )
          }
        }
      }
    }

    // ----------------------------------------------------------
    // UPDATE SHARED YARN POSITION
    // ----------------------------------------------------------

    yarnRef.current.copy(
      ball.position
    )

    // ----------------------------------------------------------
    // UPDATE YARN MODEL
    // ----------------------------------------------------------

    if (ballRef.current) {
      ballRef.current.position.copy(
        ball.position
      )
    }

    // ----------------------------------------------------------
    // UPDATE STRING GEOMETRY
    // ----------------------------------------------------------

    const positions =
      lineRef.current.geometry
        .attributes
        .position as THREE.BufferAttribute

    rope.forEach(
      (point, index) => {
        positions.setXYZ(
          index,
          point.position.x,
          point.position.y,
          point.position.z
        )
      }
    )

    positions.needsUpdate = true
  })

  return (
    <group ref={groupRef}>
      <primitive
        ref={ballRef}
        object={scene}
        scale={0.5}
      />
    </group>
  )
}

function CameraView() {
  const { camera } = useThree()

  useEffect(() => {
    camera.position.set(26, 11.2, 0)
    camera.lookAt(-3.3, 3.1, 0)
    camera.updateProjectionMatrix()
  }, [camera])

  return null
}

useGLTF.preload("/cat.glb")
useGLTF.preload("/Yarn.glb")

export function Kitty3D() {
  const anchorRef = useRef(YARN_PLANE_POINT.clone())
  const yarnRef = useRef(new THREE.Vector3(YARN_ANCHOR_X, 3.3, 0))
  const pawRef = useRef(new THREE.Vector3())
  const catPushRef = useRef(0)
  const grabbedRef = useRef(false)

  return (
  <div className="pointer-events-none absolute inset-0 h-full w-full">
    <Canvas
      gl={{ alpha: true }}
      camera={{ position: [26, 11.2, 0], fov: 40 }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[3, 5, 2]} intensity={2} />

      <Suspense fallback={null}>
        <CameraView />

        <PointerAnchor anchorRef={anchorRef} />

        <CatModel
          yarnRef={yarnRef}
          pawRef={pawRef}
          grabbedRef={grabbedRef}
        />

        <YarnBall
          anchorRef={anchorRef}
          yarnRef={yarnRef}
          pawRef={pawRef}
          grabbedRef={grabbedRef}
        />
      </Suspense>
    </Canvas>
  </div>
)
}