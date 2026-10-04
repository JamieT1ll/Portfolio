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

  heroImage?: string

  role?: string
  type?: string
  duration?: string

  link?: string
  github?: string

  sections: ProjectSection[]
}


export const projects: Project[] = [
  {
    slug: "forestscape",
    title: "Forestscape",
    subtitle: "Mobile 3D Therapeutic Game",

    description:
      "A 3D therapeutic game developed in Unity for my honours project. Designed to promote relaxation and help interrupt negative thought patterns through an interactive environment informed by research into game design, soundscapes, wellbeing, and therapeutic practices.",

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

    link: "https://jamiet1ll.github.io/forestscape/",
    github: "https://github.com/JamieT1ll/TileGame",

    sections: [
      {
        title: "About the project",
        text:
          "Forestscape was developed for my honours project over just three months. I began the project with no previous experience using Unity and little familiarity with the assigned topic of therapeutic practices.",
      },
      {
        title: "The goal",
        text:
          "The primary goal was to create an experience that could help users relax, reduce negative thought patterns, and provide a therapeutic experience through an interactive 3D environment.",
      },
      {
        title: "Research and design",
        text:
          "Design decisions were informed by research into the effects of game design and soundscapes on wellbeing and how these ideas could be applied through therapeutic practices.",
      },
      {
        title: "Testing and results",
        text:
          "Through conducted playtests and interviews, participants reported calm and positive headspaces after using the program. The program was also reported as effective at interrupting negative thought patterns.",
      },
      {
        title: "What I would improve",
        text:
          "Looking back, I would spend more time refining the user interface, fine-tuning the balance of the soundscape, and adding more variety to the placeable tile elements.",
      },
    ],
  },

  {
    slug: "launchpad",
    title: "Launchpad",
    subtitle: "Crowdfunding Web Application",

    description:
      "A team-developed crowdfunding web application. I worked primarily on frontend design and documentation, as well as the integration of AI language model APIs. The application included support for handling image and video media.",

    tags: [
      "TypeScript",
      "React",
      "jQuery",
      "Frontend",
      "AI APIs",
      "Team Project",
    ],

    role: "Frontend Developer",
    type: "Team Project",

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

    description:
      "A mobile-focused time management application designed to help users track their time and view trends across different periods. Built using HTML and JavaScript with a focus on providing a simple way to understand how time is being spent.",

    tags: [
      "JavaScript",
      "HTML",
      "Mobile",
      "Time Management",
    ],

    role: "Solo Developer",
    type: "Personal Project",

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

  {
    slug: "portfolio-website",
    title: "Interactive Portfolio Website",
    subtitle: "Interactive 3D Web Portfolio",

    description:
      "This portfolio website was built with Next.js and TypeScript with a focus on interactive design. It features custom 3D models created and rigged in Blender, rendered in the browser using Three.js and React Three Fiber. The site includes an interactive animated cat that reacts to and plays with a physics-based yarn ball controlled by the user's mouse.",

    tags: [
      "Next.js",
      "TypeScript",
      "Tailwind",
      "Three.js",
      "React Three Fiber",
      "Blender",
      "3D",
      "Animation",
    ],

    role: "Designer & Developer",
    type: "Personal Project",

    sections: [
      {
        title: "About the project",
        text:
          "I created this portfolio as both a place to present my work and an opportunity to experiment with combining traditional web development with interactive 3D elements.",
      },
      {
        title: "3D design with Blender",
        text:
          "The site's 3D elements were created and rigged in Blender before being exported for use on the web. This includes the animated cat that forms a central interactive element of the portfolio.",
      },
      {
        title: "Bringing 3D to the web",
        text:
          "The 3D scene is rendered in the browser using Three.js and React Three Fiber, allowing the models and animations to exist alongside the rest of the Next.js interface.",
      },
      {
        title: "Interactive cat",
        text:
          "The cat responds to the position of a yarn ball controlled by the user's mouse. Its head follows the yarn, its arm prepares and attacks when the ball comes within reach, and it can grab and release the yarn.",
      },
      {
        title: "Yarn physics",
        text:
          "The yarn uses a custom rope simulation to create a more physical interaction between the mouse, yarn ball, and cat. The ball can move freely, be caught by the cat, and be pushed or released back into the simulation.",
      },
      {
        title: "Design and development",
        text:
          "The rest of the portfolio is built with Next.js, TypeScript, and Tailwind CSS, with the 3D interaction designed to complement the portfolio content rather than replace the usability of the surrounding interface.",
      },
    ],
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}