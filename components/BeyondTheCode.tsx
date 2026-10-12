
"use client"

import { useState } from "react"

const hobbies = [
  {
    title: "Stories, games & imagination",
    description:
      "I'm a fan of Dungeons & Dragons and board games, especially the creativity, strategy, and shared storytelling that bring people together around a table. I enjoy the way games create little worlds of their own, where problem-solving and imagination go hand in hand.",
    style: "bg-white/75 shadow-sm",
    titleStyle: "text-[#05668D]",
    textStyle: "text-[#05668D]",
  },
  {
    title: "Community & volunteering",
    description:
      "I volunteer weekly at Dundee Central Library, giving me an opportunity to contribute to my local community and spend time in a place that celebrates knowledge, learning, and a love of books.",
    style: "bg-[#02C39A]/20",
    titleStyle: "text-[#05668D]",
    textStyle: "text-[#05668D]",
  },
  {
    title: "Bugs & eight-legged companions",
    description:
      "I keep tarantulas and enjoy pinning insects, combining a fascination with invertebrates with an appreciation for their intricate forms, colours, and details. It's a hobby that reflects my curiosity about the natural world and the things people might otherwise overlook.",
    style: "border border-[#02C39A]",
    titleStyle: "text-[#05668D]",
    textStyle: "text-[#05668D]",
  },
  {
    title: "Gothic fiction, horror & cinema",
    description:
      "I'm drawn to Gothic literature, horror, and writing, particularly stories that explore unsettling ideas, strange atmospheres, and the darker sides of human nature. I'm also a fan of surreal cinema, with its strange imagery, dreamlike narratives, and willingness to leave questions unanswered. I love art that stays with you long after you've finished reading or watching. I love frequenting my local cinema- The DCA!",
    style: "bg-[#05668D]",
    titleStyle: "text-[#02C39A]",
    textStyle: "text-white/90",
  },
]

export default function BeyondTheCode() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((index) => (index + 1) % hobbies.length)
  }

  const previous = () => {
    setCurrentIndex(
      (index) => (index - 1 + hobbies.length) % hobbies.length
    )
  }

  // Show two cards on desktop and one on mobile.
  const visibleHobbies = [
    hobbies[currentIndex],
    hobbies[(currentIndex + 1) % hobbies.length],
  ]

  return (
    <section className="mt-24">
      <p className="font-semibold uppercase tracking-[0.2em] text-[#028090]">
        Beyond the code
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-heading text-3xl font-bold text-[#05668D] md:text-4xl">
          A little more about me.
        </h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={previous}
            aria-label="Previous hobbies"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-[#02C39A] text-xl text-[#05668D] transition hover:bg-[#02C39A]/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#028090]"
          >
            &#8592;
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next hobbies"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#05668D] text-xl text-white transition hover:bg-[#028090] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#028090]"
          >
            &#8594;
          </button>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-lg leading-8 text-[#05668D]">
        Outside of technology, I like to thing of myself as somewhat of a contrarian. I'm drawn to the imaginative, the unusual,
        and the slightly macabre. From tabletop adventures and volunteering
        to Gothic literature, horror, and the fascinating world of
        invertebrates, I enjoy exploring interests that inspire curiosity
        , creativity, and community.
      </p>

      <div
        className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        aria-live="polite"
      >
        {visibleHobbies.map((hobby, index) => (
          <article
            key={`${currentIndex}-${index}`}
            className={`min-h-64 rounded-2xl p-8 transition-all duration-300 ${hobby.style}`}
          >
            <h3 className={`text-xl font-bold ${hobby.titleStyle}`}>
              {hobby.title}
            </h3>

            <p className={`mt-4 leading-7 ${hobby.textStyle}`}>
              {hobby.description}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-[#05668D]/75">
          Showing {currentIndex + 1}–{currentIndex + 2 > hobbies.length
            ? hobbies.length
            : currentIndex + 2} of {hobbies.length} interests
        </p>

        <div className="flex gap-2">
          {hobbies.map((hobby, index) => (
            <button
              key={hobby.title}
              type="button"
              onClick={() => setCurrentIndex(index)}
              aria-label={`Start at ${hobby.title}`}
              aria-current={index === currentIndex ? "true" : undefined}
              className={`h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? "w-7 bg-[#028090]"
                  : "w-2.5 bg-[#05668D]/25 hover:bg-[#028090]/60"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
