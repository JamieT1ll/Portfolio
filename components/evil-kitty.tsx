"use client"

import { useEffect, useRef, useState } from "react"

type Point = {
  x: number
  y: number
}

type RopePoint = Point & {
  previousX: number
  previousY: number
}

type CatArmState =
  | "rest"
  | "yarnready"
  | "yarnattack"

const ropePointCount = 12
const ropeLength = 220
const ropeSegmentLength =
  ropeLength / (ropePointCount - 1)

export function InteractiveCat() {
  const [ropePoints, setRopePoints] =
    useState<RopePoint[]>([])

  const [catX, setCatX] =
    useState(0)

  const [animationTime, setAnimationTime] =
    useState(0)

  const [headAngle, setHeadAngle] =
    useState(0)

  const targetRef =
    useRef<Point>({
      x: 0,
      y: 0,
    })

  const ropeRef =
    useRef<RopePoint[]>([])

  const catXRef =
    useRef(0)

  const lastWhackRef =
    useRef(0)

  const headAngleRef =
    useRef(0)

  useEffect(() => {
    function centerCat() {
      const nextCatX =
        window.innerWidth / 2 - 60

      catXRef.current =
        nextCatX

      setCatX(nextCatX)
    }

    function handlePointerMove(
      event: PointerEvent
    ) {
      targetRef.current = {
        x: event.clientX,
        y: event.clientY,
      }
    }

    centerCat()

    targetRef.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    }

    const initialRope =
      Array.from(
        {
          length: ropePointCount,
        },
        (_, index) => {
          const y =
            targetRef.current.y +
            index *
              ropeSegmentLength

          return {
            x: targetRef.current.x,
            y,
            previousX:
              targetRef.current.x,
            previousY: y,
          }
        }
      )

    ropeRef.current =
      initialRope

    setRopePoints(
      initialRope
    )

    window.addEventListener(
      "pointermove",
      handlePointerMove
    )

    window.addEventListener(
      "resize",
      centerCat
    )

    let animationFrame: number

    function animateRope(
      currentTime: number
    ) {
      const rope =
        ropeRef.current

      const anchor =
        targetRef.current

      if (rope.length === 0) {
        animationFrame =
          requestAnimationFrame(
            animateRope
          )

        return
      }

      // ==========================================================
      // POINTER ANCHOR
      // ==========================================================

      rope[0].x =
        anchor.x

      rope[0].y =
        anchor.y

      rope[0].previousX =
        anchor.x

      rope[0].previousY =
        anchor.y

      // ==========================================================
      // VERLET ROPE PHYSICS
      // ==========================================================

      for (
        let index = 1;
        index < rope.length;
        index += 1
      ) {
        const point =
          rope[index]

        const velocityX =
          (
            point.x -
            point.previousX
          ) *
          0.985

        const velocityY =
          (
            point.y -
            point.previousY
          ) *
          0.985

        point.previousX =
          point.x

        point.previousY =
          point.y

        point.x +=
          velocityX

        point.y +=
          velocityY +
          0.28
      }

      // ==========================================================
      // ROPE CONSTRAINTS
      // ==========================================================

      for (
        let iteration = 0;
        iteration < 6;
        iteration += 1
      ) {
        rope[0].x =
          anchor.x

        rope[0].y =
          anchor.y

        for (
          let index = 1;
          index < rope.length;
          index += 1
        ) {
          const previous =
            rope[index - 1]

          const point =
            rope[index]

          const deltaX =
            point.x -
            previous.x

          const deltaY =
            point.y -
            previous.y

          const distance =
            Math.sqrt(
              deltaX *
                deltaX +
                deltaY *
                  deltaY
            ) || 1

          const correction =
            (
              distance -
              ropeSegmentLength
            ) /
            distance

          if (index === 1) {
            point.x -=
              deltaX *
              correction

            point.y -=
              deltaY *
              correction
          } else {
            previous.x +=
              deltaX *
              correction *
              0.5

            previous.y +=
              deltaY *
              correction *
              0.5

            point.x -=
              deltaX *
              correction *
              0.5

            point.y -=
              deltaY *
              correction *
              0.5
          }
        }
      }

      // ==========================================================
      // CAT
      // ==========================================================

      const yarn =
        rope[
          rope.length - 1
        ]

      const arm =
        getArmPoints(
          catXRef.current,
          yarn,
          currentTime
        )

      const desiredHeadAngle =
        getCatTracking(
          catXRef.current,
          yarn,
          currentTime
        ).headAngle

      headAngleRef.current +=
        (
          desiredHeadAngle -
          headAngleRef.current
        ) *
        0.08

      // ==========================================================
      // YARN ATTACK
      // ==========================================================

      /*
       * The cat ONLY hits the yarn while:
       *
       * 1. arm is in yarnattack state
       * 2. paw has actually reached the yarn
       * 3. attack cooldown has expired
       */

      if (
        arm.state ===
          "yarnattack" &&
        arm.grabbing &&
        currentTime -
          lastWhackRef.current >
          950
      ) {
        /*
         * Direction from shoulder
         * toward the yarn.
         */
        const attackDX =
          yarn.x -
          arm.shoulder.x

        const attackDY =
          yarn.y -
          arm.shoulder.y

        const attackDistance =
          Math.hypot(
            attackDX,
            attackDY
          ) || 1

        const pushX =
          attackDX /
          attackDistance

        const pushY =
          attackDY /
          attackDistance

        /*
         * Verlet impulse.
         *
         * Changing the previous
         * position produces velocity
         * on the next frame.
         */
        const pushStrength =
          58 +
          Math.random() *
            18

        yarn.previousX -=
          pushX *
          pushStrength

        yarn.previousY -=
          pushY *
          pushStrength

        /*
         * Slight upward kick.
         */
        yarn.previousY +=
          7 +
          Math.random() *
            5

        /*
         * Small sideways variation
         * so every hit isn't identical.
         */
        yarn.previousX +=
          (
            Math.random() -
            0.5
          ) *
          10

        lastWhackRef.current =
          currentTime
      }

      // ==========================================================
      // REACT STATE
      // ==========================================================

      setRopePoints(
        rope.map(
          (point) => ({
            ...point,
          })
        )
      )

      setAnimationTime(
        currentTime
      )

      setHeadAngle(
        headAngleRef.current
      )

      animationFrame =
        requestAnimationFrame(
          animateRope
        )
    }

    animationFrame =
      requestAnimationFrame(
        animateRope
      )

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove
      )

      window.removeEventListener(
        "resize",
        centerCat
      )

      cancelAnimationFrame(
        animationFrame
      )
    }
  }, [])

  // ============================================================
  // SVG ROPE
  // ============================================================

  const ropePath =
    ropePoints
      .map(
        (point, index) =>
          `${
            index === 0
              ? "M"
              : "L"
          } ${point.x} ${point.y}`
      )
      .join(" ")

  const yarnPosition =
    ropePoints[
      ropePoints.length - 1
    ]

  const arm =
    yarnPosition
      ? getArmPoints(
          catX,
          yarnPosition,
          animationTime
        )
      : undefined

  const tracking =
    yarnPosition
      ? getCatTracking(
          catX,
          yarnPosition,
          animationTime
        )
      : {
          headAngle: 0,
          eyeX: 0,
          eyeY: 0,
          tailAngle: 0,
        }

  tracking.headAngle =
    headAngle

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <svg
      className="pointer-events-none fixed inset-0 z-10 h-full w-full"
      aria-hidden="true"
    >
      {/* ===================================================== */}
      {/* YARN STRING */}
      {/* ===================================================== */}

      <path
        d={ropePath}
        fill="none"
        stroke="#028090"
        strokeWidth="4"
      />

      {/* ===================================================== */}
      {/* CAT BODY */}
      {/* ===================================================== */}

      <g
        transform={`translate(${catX} 130)`}
      >
        <path
          d="
            M 30 90
            Q -15 120 10 170
            Q 45 195 100 170
            Q 125 120 80 90
          "
          fill="#00A896"
          stroke="#05668D"
          strokeWidth="4"
        />

        <path
          d="
            M 42 122
            Q 60 145 78 122
            L 82 168
            Q 60 185 38 168
            Z
          "
          fill="#02C39A"
          opacity="0.8"
        />

        <path
          d="
            M 37 105
            Q 60 116 83 105
          "
          fill="none"
          stroke="#05668D"
          strokeWidth="4"
        />

        {/* ================================================= */}
        {/* HEAD */}
        {/* ================================================= */}

        <g
          transform={`rotate(${tracking.headAngle} 60 62)`}
        >
          <path
            d="
              M 18 48
              L 8 5
              L 42 28

              M 78 28
              L 112 5
              L 102 48
            "
            fill="#02C39A"
            stroke="#05668D"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          <path
            d="
              M 18 36
              L 17 16
              L 35 30
              Z

              M 102 36
              L 103 16
              L 85 30
              Z
            "
            fill="#F0F3BD"
          />

          <circle
            cx="60"
            cy="62"
            r="48"
            fill="#00A896"
            stroke="#05668D"
            strokeWidth="4"
          />

          <ellipse
            cx="43"
            cy="60"
            rx="9"
            ry="12"
            fill="#F0F3BD"
          />

          <ellipse
            cx="77"
            cy="60"
            rx="9"
            ry="12"
            fill="#F0F3BD"
          />

          {/* EYES */}

          <g
            transform={`translate(${tracking.eyeX} ${tracking.eyeY})`}
          >
            <ellipse
              cx="43"
              cy="60"
              rx="4"
              ry="8"
              fill="#05668D"
            />

            <ellipse
              cx="77"
              cy="60"
              rx="4"
              ry="8"
              fill="#05668D"
            />

            <circle
              cx="41.5"
              cy="56"
              r="1.5"
              fill="#F0F3BD"
            />

            <circle
              cx="75.5"
              cy="56"
              r="1.5"
              fill="#F0F3BD"
            />
          </g>

          {/* NOSE */}

          <path
            d="
              M 55 76
              L 60 80
              L 65 76
              Z
            "
            fill="#05668D"
          />

          {/* MOUTH */}

          <path
            d="
              M 60 80
              Q 54 88 48 84

              M 60 80
              Q 66 88 72 84
            "
            fill="none"
            stroke="#05668D"
            strokeWidth="2"
          />

          {/* WHISKERS */}

          <path
            d="
              M 42 76 L 12 70
              M 42 82 L 10 84

              M 78 76 L 108 70
              M 78 82 L 110 84
            "
            fill="none"
            stroke="#05668D"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* ================================================= */}
        {/* TAIL */}
        {/* ================================================= */}

        <g
          transform={`rotate(${tracking.tailAngle} 120 170)`}
        >
          <path
            d="
              M 102 165
              Q 160 185 145 235
            "
            fill="none"
            stroke="#05668D"
            strokeWidth="12"
            strokeLinecap="round"
          />

          <path
            d="
              M 126 178 L 137 184
              M 139 191 L 149 197
              M 146 207 L 153 214
            "
            stroke="#02C39A"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* ===================================================== */}
      {/* ARM */}
      {/* ===================================================== */}

      {arm && (
        <g>
          {/* SHOULDER */}

          <circle
            cx={arm.shoulder.x}
            cy={arm.shoulder.y}
            r="11"
            fill="#00A896"
            stroke="#05668D"
            strokeWidth="4"
          />

          {/* UPPER ARM */}

          <path
            d={`
              M ${arm.shoulder.x}
                ${arm.shoulder.y}

              L ${arm.elbow.x}
                ${arm.elbow.y}
            `}
            fill="none"
            stroke="#00A896"
            strokeWidth="17"
            strokeLinecap="round"
          />

          {/* ELBOW */}

          <circle
            cx={arm.elbow.x}
            cy={arm.elbow.y}
            r="9"
            fill="#02C39A"
            stroke="#05668D"
            strokeWidth="3"
          />

          {/* FOREARM */}

          <path
            d={`
              M ${arm.elbow.x}
                ${arm.elbow.y}

              L ${arm.wrist.x}
                ${arm.wrist.y}
            `}
            fill="none"
            stroke="#02C39A"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* PAW */}

          <g
            transform={`
              translate(
                ${arm.wrist.x}
                ${arm.wrist.y}
              )
              rotate(
                ${
                  arm.angle *
                  (180 / Math.PI)
                }
              )
            `}
          >
            <ellipse
              rx="18"
              ry="13"
              fill="#02C39A"
              stroke="#05668D"
              strokeWidth="4"
            />

            <path
              d="
                M 8 -9
                Q 20 -9 23 -3

                M 10 0
                Q 22 0 24 5

                M 8 9
                Q 18 10 20 14
              "
              fill="none"
              stroke="#05668D"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {arm.grabbing && (
              <path
                d="
                  M 15 -12
                  Q 28 0 15 12
                "
                fill="none"
                stroke="#F0F3BD"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}
          </g>
        </g>
      )}

      {/* ===================================================== */}
      {/* YARN BALL */}
      {/* ===================================================== */}

      {yarnPosition && (
        <g
          transform={`
            translate(
              ${yarnPosition.x}
              ${yarnPosition.y}
            )
          `}
        >
          <circle
            r="20"
            fill="#02C39A"
            stroke="#05668D"
            strokeWidth="4"
          />

          <path
            d="
              M -14 -2
              Q 0 -16 14 0

              M -11 10
              Q 0 -5 12 11
            "
            fill="none"
            stroke="#05668D"
            strokeWidth="3"
          />
        </g>
      )}
    </svg>
  )
}

// ============================================================
// ARM
// ============================================================

function getArmPoints(
  catX: number,
  yarn: Point,
  time: number
) {
  const shoulder = {
    x: catX + 78,
    y: 256,
  }

  const dx =
    yarn.x -
    shoulder.x

  const dy =
    yarn.y -
    shoulder.y

  const distance =
    Math.hypot(
      dx,
      dy
    ) || 1

  const dirX =
    dx / distance

  const dirY =
    dy / distance

  // ==========================================================
  // ARM SIZE
  // ==========================================================

  const upperArmLength = 100
  const forearmLength = 105

  const maxReach =
    upperArmLength +
    forearmLength

  // ==========================================================
  // THREE STATES
  // ==========================================================

  /*
   * REST
   *
   * Yarn is too far away.
   */
  const readyDistance = 300

  /*
   * ATTACK
   *
   * Yarn has entered the area the paw can
   * realistically strike.
   */
  const attackDistance =
    maxReach + 18

  let state: CatArmState

  if (
    distance >
    readyDistance
  ) {
    state = "rest"
  } else if (
    distance >
    attackDistance
  ) {
    state = "yarnready"
  } else {
    state = "yarnattack"
  }

  // ==========================================================
  // STATE 1 — REST
  // ==========================================================

  if (state === "rest") {
    /*
     * Relaxed arm hanging beside the cat.
     */

    const elbow = {
      x:
        shoulder.x +
        38,

      y:
        shoulder.y +
        78,
    }

    const wrist = {
      x:
        shoulder.x +
        18,

      y:
        shoulder.y +
        145,
    }

    const angle =
      Math.atan2(
        wrist.y -
          elbow.y,

        wrist.x -
          elbow.x
      )

    return {
      shoulder,
      elbow,
      wrist,
      angle,
      grabbing: false,
      state,
    }
  }

  // ==========================================================
  // STATE 2 — YARN READY
  // ==========================================================

  if (
    state ===
    "yarnready"
  ) {
    /*
     * Track the yarn without touching it.
     *
     * This is the curved "ready to pounce"
     * position.
     */

    const readyReach =
      Math.min(
        distance * 0.7,
        maxReach * 0.76
      )

    const wrist = {
      x:
        shoulder.x +
        dirX *
          readyReach,

      y:
        shoulder.y +
        dirY *
          readyReach,
    }

    // --------------------------------------------------------
    // DOWNWARD ELBOW
    // --------------------------------------------------------

    /*
     * SVG coordinates:
     *
     * +Y = DOWN.
     *
     * So adding Y deliberately curves
     * the elbow downward.
     */

    const midpointX =
      (
        shoulder.x +
        wrist.x
      ) /
      2

    const midpointY =
      (
        shoulder.y +
        wrist.y
      ) /
      2

    /*
     * Strong visible bend.
     */
    const bendAmount =
      72

    /*
     * Add a tiny amount of movement so
     * the ready pose doesn't look frozen.
     */
    const anticipation =
      Math.sin(
        time / 260
      ) *
      4

    const elbow = {
      x:
        midpointX -
        dirX * 8,

      y:
        midpointY +
        bendAmount +
        anticipation,
    }

    /*
     * Paw continues looking directly
     * toward the yarn.
     */
    const angle =
      Math.atan2(
        yarn.y -
          wrist.y,

        yarn.x -
          wrist.x
      )

    return {
      shoulder,
      elbow,
      wrist,
      angle,
      grabbing: false,
      state,
    }
  }

  // ==========================================================
  // STATE 3 — YARN ATTACK
  // ==========================================================

  /*
   * The yarn is now close enough.
   *
   * Fully extend the arm toward it.
   */

  const targetDistance =
    Math.min(
      distance,
      maxReach - 1
    )

  const wrist = {
    x:
      shoulder.x +
      dirX *
        targetDistance,

    y:
      shoulder.y +
      dirY *
        targetDistance,
  }

  // ==========================================================
  // TWO-BONE IK
  // ==========================================================

  const d =
    Math.max(
      1,
      Math.min(
        targetDistance,
        maxReach -
          0.001
      )
    )

  /*
   * Projection of elbow onto
   * shoulder -> wrist line.
   */
  const a =
    (
      upperArmLength *
        upperArmLength -
      forearmLength *
        forearmLength +
      d * d
    ) /
    (2 * d)

  const elbowHeight =
    Math.sqrt(
      Math.max(
        0,
        upperArmLength *
          upperArmLength -
          a * a
      )
    )

  const baseX =
    shoulder.x +
    dirX * a

  const baseY =
    shoulder.y +
    dirY * a

  const perpX =
    -dirY

  const perpY =
    dirX

  /*
   * There are two possible IK solutions.
   */

  const elbowA = {
    x:
      baseX +
      perpX *
        elbowHeight,

    y:
      baseY +
      perpY *
        elbowHeight,
  }

  const elbowB = {
    x:
      baseX -
      perpX *
        elbowHeight,

    y:
      baseY -
      perpY *
        elbowHeight,
  }

  /*
   * Always choose the elbow that points
   * DOWNWARD on the screen.
   *
   * Larger Y = lower in SVG.
   */

  const elbow =
    elbowA.y >
    elbowB.y
      ? elbowA
      : elbowB

  // ==========================================================
  // PAW
  // ==========================================================

  const angle =
    Math.atan2(
      yarn.y -
        elbow.y,

      yarn.x -
        elbow.x
    )

  const distanceToYarn =
    Math.hypot(
      wrist.x -
        yarn.x,

      wrist.y -
        yarn.y
    )

  /*
   * Paw must physically reach the yarn
   * before the hit is triggered.
   */

  const grabbing =
    distanceToYarn <
    28

  return {
    shoulder,
    elbow,
    wrist,
    angle,
    grabbing,
    state,
  }
}

// ============================================================
// HEAD / EYES / TAIL
// ============================================================

function getCatTracking(
  catX: number,
  yarn: Point,
  time: number
) {
  const headX =
    catX + 60

  const headY =
    130 + 62

  const angleToYarn =
    Math.atan2(
      yarn.y -
        headY,

      yarn.x -
        headX
    ) *
    (180 / Math.PI)

  const headAngle =
    Math.max(
      -32,
      Math.min(
        32,
        angleToYarn *
          0.3
      )
    )

  const eyeX =
    Math.max(
      -4,
      Math.min(
        4,
        (
          yarn.x -
          headX
        ) /
          80
      )
    )

  const eyeY =
    Math.max(
      -3,
      Math.min(
        3,
        (
          yarn.y -
          headY
        ) /
          100
      )
    )

  const tailAngle =
    Math.sin(
      time / 700
    ) *
    8

  return {
    headAngle,
    eyeX,
    eyeY,
    tailAngle,
  }
}