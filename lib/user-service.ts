import type { User } from "@/types/auth"
import type { ResumeData } from "@/components/resume-builder"

// 메모리 내 사용자 저장소 (실제로는 데이터베이스를 사용해야 함)
const users: User[] = [
  {
    username: "hun",
    password: "dydgns135",
    resumeData: {
      personalDetails: {
        name: "YongHun Jeong",
        jobTitle: "Software Developer",
        email: "younghune135@gmail.com",
        phone: "010-3234-9008",
        address: "Yeongtong-Gu Suwon-Si, South Korea",
        links: [
          { platform: "GitHub", url: "https://github.com/hun9008" },
          { platform: "Blog", url: "https://velog.io/@hun9008" },
          { platform: "LinkedIn", url: "https://linkedin.com/in/younghun-jeong" },
        ],
      },
      professionalSummary:
        "I am a backend engineer with experience in deploying and managing services in both personal server and cloud environments, using technologies like FastAPI, Docker, and NGINX. Skilled in optimizing database structures, I migrated NoSQL to RDBMS in the Maitutor project to efficiently normalize data and design systems for tracking user progress and rankings. I am passionate about developing AI-driven applications and excel at quickly learning and applying new frameworks and technologies, driven by a commitment to building smart, adaptable systems.",
      education: [
        {
          id: "edu1",
          school: "Ajou University",
          location: "Yeongtong-Gu Suwon-Si",
          degree: "Bachelor of Science",
          fieldOfStudy: "Software and Computer Engineering",
          startDate: "Mar 2020",
          endDate: "Present",
          description: "",
        },
        {
          id: "edu2",
          school: "SK FLY AI",
          location: "SK Telecom Boramae Building",
          degree: "",
          fieldOfStudy: "SK Telecom AI BootCamp",
          startDate: "Jun 2024",
          endDate: "Aug 2024",
          description: "",
        },
        {
          id: "edu3",
          school: "Naver AI Boost Class",
          location: "Online",
          degree: "",
          fieldOfStudy: "NAVER Connect Foundation",
          startDate: "Apr 2024",
          endDate: "Jun 2024",
          description: "",
        },
      ],
      projects: [
        {
          id: "proj1",
          name: "Maitutor at SK FLY AI",
          startDate: "07/2024",
          endDate: "08/2024",
          techStack: ["Backend", "AI"],
          githubUrl: "https://github.com/hun9008/SKT_FLY_AI_Maitutor",
          summary:
            "m.AI Tutor is a personalized LLM-based, AI-powered math tutoring platform for students in underserved areas.",
          description: "Managed Backend, AI",
        },
        {
          id: "proj2",
          name: "Personal Server Development",
          startDate: "07/2024",
          endDate: "07/2024",
          techStack: ["OS", "Network"],
          githubUrl: "https://github.com/hun9008/Personal_Ubuntu_Server",
          summary:
            "This project involves building a personal server to host multiple services, including web pages, backend APIs, and AI models, as a cost-effective alternative to cloud services like AWS and Azure.",
          description: "Managed OS, Network",
        },
        {
          id: "proj3",
          name: "Development of Cataract Detection Model",
          startDate: "04/2024",
          endDate: "06/2024",
          techStack: ["AI"],
          githubUrl: "https://github.com/hun9008/ML_TeamProject_24SS",
          summary:
            "This project aims to develop a classification model using a Vision Transformer (ViT) to determine the presence and severity of cataracts in dogs.",
          description: "Managed AI",
        },
        {
          id: "proj4",
          name: "Development of SignTranslation Glove",
          startDate: "04/2024",
          endDate: "06/2024",
          techStack: ["System Programming", "C"],
          githubUrl: "https://github.com/hun9008/signTranslateMachine",
          summary:
            "This project is a real-time sign language translation system to improve communication between hearing-impaired individuals and hearing people using a Smart Glove.",
          description: "System Programming, C",
        },
        {
          id: "proj5",
          name: "Development of Web Service - PostMeeting",
          startDate: "01/2024",
          endDate: "02/2024",
          techStack: ["React"],
          githubUrl: "https://github.com/hun9008/post_meeting",
          summary:
            "I developed and operated a web service that facilitates introductions using school-verified, campus-based virtual post-it notes.",
          description: "Used React",
        },
        {
          id: "proj6",
          name: "NoNoConect - HackerThon",
          startDate: "07/2023",
          endDate: "08/2023",
          techStack: ["React Native"],
          githubUrl: "https://github.com/hun9008/nonoconnect",
          summary:
            "Nonoconnect is a location-based real-time community app designed to create supportive environments where seniors can live well together.",
          description: "Used React Native",
        },
      ],
      experience: [
        {
          id: "exp1",
          company: "DI Lab",
          position: "Undergraduate Intern",
          location: "UNIST, Ulsan, Korea",
          startDate: "Jan 2025",
          endDate: "Present",
          description: "",
        },
      ],
      skills: [
        { id: "skill1", name: "FastAPI", level: "Expert" },
        { id: "skill2", name: "Docker", level: "Advanced" },
        { id: "skill3", name: "Keras", level: "Advanced" },
        { id: "skill4", name: "NGINX", level: "Intermediate" },
        { id: "skill5", name: "MySQL", level: "Advanced" },
        { id: "skill6", name: "MongoDB", level: "Intermediate" },
        { id: "skill7", name: "React", level: "Intermediate" },
        { id: "skill8", name: "NextJS", level: "Intermediate" },
        { id: "skill9", name: "C++", level: "Intermediate" },
        { id: "skill10", name: "Python", level: "Expert" },
        { id: "skill11", name: "Java", level: "Intermediate" },
        { id: "skill12", name: "JavaScript", level: "Intermediate" },
      ],
      awards: [
        {
          id: "award1",
          title: "SKT FLY AI Individual Category",
          issuer: "SK Telecom",
          date: "Aug 2024",
          url: "",
          description: "Excellence Award",
        },
        {
          id: "award2",
          title: "Side Impact",
          issuer: "",
          date: "",
          url: "https://github.com/hun9008/Dev_Cataract",
          description: "Passed Round 1\nUsed FastAPI, NextJS",
        },
        {
          id: "award3",
          title: "Generative AI Software Idea Contest",
          issuer: "",
          date: "",
          url: "https://github.com/hun9008/GenAI_ideaton",
          description: "Encouragement Award\nUsed FastAPI",
        },
        {
          id: "award4",
          title: "National Science and Engineering Scholarship",
          issuer: "",
          date: "",
          url: "",
          description: "Full Scholarship for 2 Years",
        },
        {
          id: "award5",
          title: "AjouTon (Ajou University Internal Hackathon)",
          issuer: "",
          date: "",
          url: "https://github.com/hun9008/ajouton_tutor",
          description: "Excellence Award\nUsed React",
        },
      ],
      publications: [
      ],
      sectionOrder: ["experience", "education", "projects", "awards", "skills", "publications"],
    },
  },
]

// 사용자명으로 사용자 조회
export function getUserByUsername(username: string): User | undefined {
  return users.find((user) => user.username === username)
}

// 사용자 등록
export function registerUser(username: string, password: string): boolean {
  // 이미 존재하는 사용자명인지 확인
  if (getUserByUsername(username)) {
    return false
  }

  // 새 사용자 추가
  users.push({
    username,
    password,
    resumeData: {},
  })

  return true
}

// 사용자의 이력서 데이터 업데이트
export function updateUserResumeData(username: string, resumeData: ResumeData): boolean {
  const userIndex = users.findIndex((user) => user.username === username)

  if (userIndex === -1) {
    return false
  }

  users[userIndex] = {
    ...users[userIndex],
    resumeData,
  }

  return true
}
