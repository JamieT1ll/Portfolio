import Image from "next/image"

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-5xl overflow-hidden px-6 py-16 md:px-12">

      {/* INTRO */}
      <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr] md:items-center">

        {/* LEFT */}
        <section>
          <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
            About me
          </p>

          <h1 className="animate-fade-up animation-delay-100 mt-3 font-heading text-4xl font-bold text-[#05668D] md:text-6xl">
            Hi, I&apos;m Jamie.
          </h1>

          <p className="animate-fade-up animation-delay-200 mt-6 text-lg leading-8 text-[#05668D]">
            I&apos;m a Computing Science graduate with a passion for building
            software, learning new technologies, and solving technical
            problems.
          </p>

          <p className="animate-fade-up animation-delay-300 mt-4 text-lg leading-8 text-[#05668D]">
            My experience covers web development, software engineering,
            databases, data visualisation, and interactive applications.
            I&apos;ve worked with technologies including Python, Java, C#,
            JavaScript, SQL, React, and more recently Next.js, TypeScript,
            Three.js, and Blender through my personal projects.
          </p>

          <p className="animate-fade-up animation-delay-300 mt-4 text-lg leading-8 text-[#05668D]">
            I enjoy taking an idea from its early stages through to a working
            application, whether that means designing an interface, solving a
            programming problem, experimenting with 3D experiences, or
            learning an unfamiliar technology along the way.
          </p>
        </section>

        {/* RIGHT — PHOTO */}
        <div className="animate-slide-right animation-delay-200">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border-4 border-[#02C39A] shadow-lg">
            <Image
              src="/images/jamie.jpg"
              alt="Jamie Till"
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>

      </div>

      {/* QUALIFICATION */}
      <section className="animate-fade-up mt-24">
        <p className="font-semibold uppercase tracking-[0.2em] text-[#028090]">
          Qualifications
        </p>

        <div className="mt-6 rounded-3xl bg-[#05668D] p-8 text-white md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">

            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#02C39A]">
                University of Dundee
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold">
                BSc (Hons)
                <span className="block">
                  Computing Science
                </span>
              </h2>

              <p className="mt-4 font-semibold text-[#F0F3BD]">
                Upper Second Class · 2:1
              </p>
            </div>

            <div>
              <p className="leading-7 text-white/90">
                My degree provided experience across software development,
                database systems, data visualisation, information security,
                and Agile software engineering. It combined individual
                development with collaborative team projects using Scrum and
                software delivery practices.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "Database Systems",
                  "Data Visualisation",
                  "Agile Software Engineering",
                  "Team Development",
                  "Information Security",
                  "Personal Project",
                ].map((module) => (
                  <span
                    key={module}
                    className="rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-[#F0F3BD]"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="mt-20">
        <p className="animate-fade-up font-semibold uppercase tracking-[0.2em] text-[#028090]">
          Technical experience
        </p>

        <h2 className="animate-fade-up animation-delay-100 mt-3 font-heading text-3xl font-bold text-[#05668D] md:text-4xl">
          Technologies I&apos;ve worked with.
        </h2>

        <div className="mt-8 grid gap-6 md:grid-cols-2">

          <div className="animate-slide-left animation-delay-200 rounded-2xl bg-white/75 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-[#05668D]">
              Programming
            </h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "Python",
                "Java",
                "C#",
                "C++",
                "JavaScript",
                "TypeScript",
                "SQL",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-[#F0F3BD] px-3 py-1.5 text-sm font-semibold text-[#05668D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-slide-right animation-delay-300 rounded-2xl bg-[#02C39A] p-8">
            <h3 className="text-xl font-bold text-[#05668D]">
              Web & tools
            </h3>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                "React",
                "Next.js",
                "HTML",
                "CSS",
                "Git",
                "GitHub",
                "AWS",
                "Three.js",
                "Blender",
              ].map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-white/40 px-3 py-1.5 text-sm font-semibold text-[#05668D]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* HOW I WORK */}
      <section className="mt-20 grid gap-6 md:grid-cols-2">

        <div className="animate-slide-left rounded-2xl border border-[#02C39A] p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#028090]">
            How I work
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#05668D]">
            Collaborative problem solving
          </h2>

          <p className="mt-4 leading-7 text-[#05668D]">
            I&apos;ve worked in Agile and Scrum environments and enjoy
            collaborating with others to solve technical problems. I value
            clear communication, organisation, and being able to explain
            technical ideas in an understandable way.
          </p>
        </div>

        <div className="animate-slide-right animation-delay-100 rounded-2xl border border-[#02C39A] p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#028090]">
            What&apos;s next
          </p>

          <h2 className="mt-3 text-2xl font-bold text-[#05668D]">
            Always learning
          </h2>

          <p className="mt-4 leading-7 text-[#05668D]">
            I&apos;m continuing to develop my software engineering skills by
            building projects, experimenting with new technologies, and
            applying what I&apos;ve learned to practical problems.
          </p>
        </div>

      </section>

    </main>
  )
}