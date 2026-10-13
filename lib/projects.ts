
export type ProjectSection = {
  title: string
  text: string
  image?: string
  imageAlt?: string
}

export type Project = {
  slug: string
  title: string
  subtitle: string
  description: string
  tags: string[]

  // Thumbnail shown on the projects listing page
  thumbnailImage?: string
  thumbnailImageAlt?: string

  // Main image shown on the individual project page
  heroImage?: string
  heroImageAlt?: string

  // Project date, formatted as YYYY-MM-DD
  date: string

  role?: string
  type?: string
  duration?: string

  link?: string
  github?: string

  sections: ProjectSection[]
}

export const projects: Project[] = [
  {
    slug: "portfolio-website",
    title: "Interactive Portfolio Website",
    subtitle: "Interactive 3D Web Portfolio",

    date: "2026-10-01",

    description:
      "This portfolio website was built with Next.js and TypeScript with a focus on interactive design and interesting visuals to show off a little and grab users attention. It features custom 3D models created and rigged in Blender, rendered in the browser using Three.js and React Three Fiber. The site includes an interactive animated cat that reacts to and plays with a physics-based yarn ball controlled by the user's mouse, along with other visual elements such as a rotating media carousel and animations.",

    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Three.js",
      "React Three Fiber",
      "Blender",
      "3D",
      "Animation",
      "Web Development",
    ],

    role: "Designer & Developer",
    type: "Personal Project",

    thumbnailImage: "/images/Portfolio.PNG",
    thumbnailImageAlt: "Interactive Portfolio Website thumbnail",

    heroImage: "/images/Portfolio.PNG",
    heroImageAlt: "Interactive Portfolio Website main preview",

    sections: [
      {
        title: "About the project",
        text:
          "It feels a little strange writing *about* this website on this website. I created this portfolio as both a place to present my work and explore an opportunity to create a different kind of website than the typical. If I wanted to impress users, I decided it would be best to create engaging and creative visuals with interactive 3D elements.",
      },
      {
        title: "The 3D Cat",
        text:
          "Inspired by an old wallpaper I used to use, I dedcided to create a simple, 3D cat to introduce users on the opening page. The 3D elements were created and rigged in Blender before being exported for use on the website.",
      },
      {
        title: "Bringing 3D to the web",
        text:
          "The 3D scene is rendered in the browser using Three.js and React Three Fiber, allowing the models and animations to exist alongside the rest of the Next.js interface. The cat was animated through the armatures as part of the models. Animations for tail wagging, blinking, and interactions with the ball were all done as part of the component. Alongside this, a ",
      },
  {
    title: "Interactive cat",
    text:
      "The cat reacts to a yarn ball controlled by the user's mouse. Its head follows the ball, and when it gets close enough, the cat will reach out, grab it, and eventually let it go again.",
  },
  {
    title: "The rest of the website",
    text:
      "Outside of the 3D elements, I built the rest of the site using Next.js, TypeScript, and Tailwind CSS. I wanted the design to feel fun and personal while keeping everything easy to navigate.",
  },
  {
    title: "Putting my work on display",
    text:
      "The projects section gives each project its own page with screenshots, details, and links to the live versions or source code. I also added tag filters to make it easier to find projects by the technologies I've used.",
  },
    ],
  },

  {
    slug: "forestscape",
    title: "Forestscape",
    subtitle: "Mobile 3D Therapeutic Game",

    date: "2026-05-01",

    description:
      "A 3D therapeutic game developed in Unity for my honours project. It was designed to promote relaxation and help interrupt negative thought patterns through an interactive environment informed by research into game design, soundscapes, and therapeutic practices to promote wellbeing.",

    tags: [
      "Unity",
      "C#",
      "3D",
      "Mobile",
      "Game Development",
      "Honours Project",
    ],

    role: "Solo Developer",
    type: "Honours Project",
    duration: "3+ Months",

    thumbnailImage: "/images/forestscape.PNG",
    thumbnailImageAlt: "Forestscape thumbnail",

    heroImage: "/images/forestscape.PNG",
    heroImageAlt: "Forestscape main project preview",

    link: "https://jamiet1ll.github.io/forestscape/",
    github: "https://github.com/JamieT1ll/TileGame",


sections: [
  {
    title: "About the project",
    text:
      "Forestscape was developed as my honours project over three months. I started with no previous experience using Unity and set out to build a creative, nature-inspired game designed to support relaxation and emotional wellbeing.",
  },
  {
    title: "The goal",
    text:
      "The aim was to create a calming experience where users could build their own forest and shape its soundscape. By combining creativity, natural sounds, and simple game mechanics, I wanted to encourage relaxation and help users step away from negative thought patterns.",
  },
  {
    title: "Research and design",
    text:
      "The design was informed by research into creative wellbeing, natural soundscapes, and the use of game mechanics to support focus and relaxation. This shaped features such as guided mode, wildlife interactions, and sounds that change as the user builds out the forest.",
  },
  {
    title: "Testing and results",
    text:
      "Playtesting and user interviews helped identify issues with tile placement, controls, and audio balance, which I refined during development. Participants responded positively to the atmosphere and natural sounds, with several describing the experience as calming and seeing potential for managing stress.",
  },
  {
    title: "What I would improve",
    text:
      "With more time, I would improve the clarity of the controls, expand the variety of tiles and wildlife, and further balance the audio. I’d also explore more structured ways to measure how the experience affects users’ mood and stress levels.",
  },
],

  },

  {
    slug: "launchpad",
    title: "Launchpad",
    subtitle: "Crowdfunding Web Application",

    date: "2025-12-01",

    description:
      "A team-developed crowdfunding web application. I worked primarily on frontend design and documentation, as well as the integration of AI language model APIs. The application included support for handling image and video media.",

    tags: [
      "TypeScript",
      "React",
      "jQuery",
      "Frontend",
      "AI APIs",
      "Team Project",
      "Web Development",
    ],

    role: "Frontend Developer",
    type: "Team Project",
    duration: "3 Weeks",

    thumbnailImage: "/images/Launchpad.png",
    thumbnailImageAlt: "Launchpad thumbnail",

    heroImage: "/images/Launchpad.png",
    heroImageAlt: "Launchpad main project preview",

    github: "https://github.com/victorbratov/launchpad",

    sections: [
      {
        title: "About the project",
        text:
          "Launchpad was developed as a team project to create an online crowdfunding service where users could create and interact with crowdfunding projects.",
      },
      {
        title: "My role",
        text:
          "My primary responsibilities within the team were frontend design and documentation. I worked on creating and refining the user-facing parts of the application while helping document the project and its development.",
      },
      {
        title: "Frontend development",
        text:
          "The frontend was developed using TypeScript alongside React and jQuery. The application also included support for handling images and videos as media.",
      },
      {
        title: "AI integration",
        text:
          "Alongside my frontend responsibilities, I worked on integrating AI language model APIs into the application.",
      },
      {
        title: "Working as a team",
        text:
          "The project gave me experience developing a larger application collaboratively, coordinating my frontend and documentation work with the other parts of the project being developed by the team.",
      },
    ],
  },

  {
    slug: "timer-app",
    title: "Time Management App",
    subtitle: "Mobile Time Tracking Application",

    date: "2025-03-01",
    duration: "2 Months",

    description:
      "A mobile-focused time management application designed to help users track their time and view trends across different periods. Built using HTML and JavaScript with a focus on providing a simple way to understand how time is being spent.",

    tags: [
      "JavaScript",
      "HTML",
      "Mobile",
      "Time Management",
      "Application Development",
    ],

    role: "Solo Developer",
    type: "Personal Project",

    thumbnailImage: "/images/WorkLife.PNG",
    thumbnailImageAlt: "Time Management App thumbnail",

    heroImage: "/images/WorkLife.PNG",
    heroImageAlt: "Time Management App main project preview",

    link: "https://jamiet1ll.github.io/TimerApp/",
    github: "https://github.com/JamieT1ll/TimerApp",

    sections: [
      {
        title: "About the project",
        text:
          "The Time Management App is a personal project created to help users manage their time and better understand how they spend it.",
      },
      {
        title: "The goal",
        text:
          "The application was designed to provide a straightforward way of tracking time while allowing users to view their time trends over different periods.",
      },
      {
        title: "Development",
        text:
          "I developed the application using HTML and JavaScript, with the interface designed around use on mobile devices.",
      },
      {
        title: "Time trends",
        text:
          "Alongside managing time in the present, the application allows users to look back at their activity across different periods, helping make patterns in their time usage easier to understand.",
      },
    ],
  },
]

// Sort newest projects first.
projects.sort(
  (a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
)

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
