"use client"

import type { ResumeData } from "./resume-builder"
import { useRef, useEffect, useState } from "react"
import React from "react"

type ResumePreviewProps = {
  resumeData: ResumeData
}

export default function ResumePreview({ resumeData }: ResumePreviewProps) {
  const { personalDetails, professionalSummary, education, projects, experience, skills, awards, publications } = resumeData
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageContents, setPageContents] = useState<JSX.Element[][]>([])
  const resumeRef = useRef<HTMLDivElement>(null)
  const pageHeight = 1123 // A4 height in pixels at 96 DPI
  const headerHeight = 200 // Approximate height for header section
  const topMargin = 32 // 8 * 4 = 32px (p-8)
  const bottomMargin = topMargin // Make bottom margin equal to top margin

  // Calculate page breaks and distribute content across pages
  useEffect(() => {
    if (resumeRef.current) {
      // Get the sections in the order they should appear
      const sectionOrder = resumeData.sectionOrder || ["education", "projects", "experience", "skills", "awards", "publications"]

      // Generate all section elements
      const header = (
        <div className="mb-6" key="header">
          <div className="flex justify-between items-start">
            <div className="w-3/4">
              <h1 className="text-3xl font-bold text-gray-900">{personalDetails.name}</h1>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-gray-700">Address</span>
                    <span className="text-gray-800">{personalDetails.address}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-gray-700">Phone</span>
                    <span className="text-gray-800">{personalDetails.phone}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-gray-700">Email</span>
                    <a href={`mailto:${personalDetails.email}`} className="text-blue-600 hover:underline">
                      {personalDetails.email}
                    </a>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-gray-700">Links</span>
                    <div className="flex flex-wrap">
                      {personalDetails.links.map((link, index) => (
                        <React.Fragment key={index}>
                          <a
                            href={link.url}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.platform}
                          </a>
                          {index < personalDetails.links.length - 1 && <span className="mx-1">,</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-8 h-8 bg-black"></div>
          </div>

          {/* Profile */}
          <div className="mb-6 mt-6">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">01. PROFILE</h2>
            <div
              className="text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: professionalSummary }}
            ></div>
          </div>
        </div>
      )

      // Generate all section elements
      const allSections = sectionOrder
        .map((sectionKey, index) => {
          const sectionNumber = index + 2 // Start from 02

          switch (sectionKey) {
            case "education":
              return education.length > 0 ? (
                <div className="mb-6" key="education">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. EDUCATION
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu, index) => (
                      <div key={index} className="grid grid-cols-[1fr_2fr] gap-3">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium">
                            {edu.startDate} — {edu.endDate}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {edu.school} {edu.degree && `(${edu.degree})`}
                          </h3>
                          <div className="text-sm text-gray-700">{edu.fieldOfStudy}</div>
                          <div className="text-sm text-gray-600">{edu.location}</div>
                          {edu.description && (
                            <div
                              className="text-sm mt-1 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: edu.description }}
                            ></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            case "projects":
              return projects.length > 0 ? (
                <div className="mb-6" key="projects">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. PROJECTS
                  </h2>
                  <div className="space-y-3">
                    {projects.map((project, index) => (
                      <div key={index} className="grid grid-cols-[1fr_2fr] gap-3">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium">
                            {project.startDate} — {project.endDate}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <div className="text-sm text-gray-700 font-medium">
                            {project.techStack.length > 0 && `Used ${project.techStack.join(", ")}`}
                          </div>
                          {project.summary && <div className="text-sm text-gray-700 mt-1">{project.summary}</div>}
                          {project.description && (
                            <div
                              className="text-sm mt-1 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: project.description }}
                            ></div>
                          )}
                          {project.githubUrl && (
                            <div className="text-xs mt-1">
                              <a
                                href={project.githubUrl}
                                className="text-blue-600 hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {project.githubUrl}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            case "publications":
              return publications.length > 0 ? (
                <div className="mb-6" key="publications">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. PUBLICATIONS
                  </h2>
                  <div className="space-y-2">
                    {publications.map((pub, index) => (
                      <div key={index} className="grid grid-cols-[1fr_2fr] gap-2">
                        <div className="text-sm text-gray-700">
                          {pub.date && <div className="font-medium">{pub.date}</div>}
                        </div>
                        <div>
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                            <div className="text-sm text-gray-700">{pub.authors}</div>
                            <div className="text-sm text-gray-600 italic">{pub.conference}</div>
                            <div className="text-sm text-gray-500">{pub.status}</div>
                            {pub.summary && (
                              <div className="text-sm text-gray-700 break-words whitespace-pre-wrap">{pub.summary}</div>
                            )}
                            {pub.url && (
                              <div className="text-xs mt-0.5">
                                <a
                                  href={pub.url}
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {pub.url}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            case "experience":
              return experience.length > 0 ? (
                <div className="mb-6" key="experience">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. EXPERIENCE
                  </h2>
                  <div className="space-y-3">
                    {experience.map((exp, index) => (
                      <div key={index} className="grid grid-cols-[1fr_2fr] gap-3">
                        <div className="text-sm text-gray-700">
                          <div className="font-medium">
                            {exp.startDate} — {exp.endDate}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                          <div className="text-sm text-gray-700">
                            {exp.company}, {exp.location}
                          </div>
                          {exp.description && (
                            <div
                              className="text-sm mt-1 text-gray-700"
                              dangerouslySetInnerHTML={{ __html: exp.description }}
                            ></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            case "skills":
              return skills.length > 0 ? (
                <div className="mb-6" key="skills">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. SKILLS
                  </h2>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {skills.map((skill, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-800 font-medium">{skill.name}</span>
                        <div className="flex gap-1 items-center">
                          {skill.level === "Expert" && (
                            <>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            </>
                          )}
                          {skill.level === "Advanced" && (
                            <>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            </>
                          )}
                          {skill.level === "Intermediate" && (
                            <>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            </>
                          )}
                          {skill.level === "Basic" && (
                            <>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            </>
                          )}
                          {skill.level === "Beginner" && (
                            <>
                              <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                              <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            case "awards":
              return awards.length > 0 ? (
                <div className="mb-6" key="awards">
                  <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                    {String(sectionNumber).padStart(2, "0")}. AWARDS
                  </h2>
                  <div className="space-y-2">
                    {awards.map((award, index) => (
                      <div key={index} className="grid grid-cols-[1fr_2fr] gap-2">
                        <div className="text-sm text-gray-700">
                          {award.date && <div className="font-medium">{award.date}</div>}
                        </div>
                        <div>
                          <div className="flex flex-col">
                            <h3 className="font-semibold text-gray-900">{award.title}</h3>
                            <div className="text-sm text-gray-700">{award.issuer}</div>
                            {award.description && (
                              <div
                                className="text-sm text-gray-700"
                                dangerouslySetInnerHTML={{ __html: award.description }}
                              ></div>
                            )}
                            {award.url && (
                              <div className="text-xs mt-0.5">
                                <a
                                  href={award.url}
                                  className="text-blue-600 hover:underline"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {award.url}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            default:
              return null
          }
        })
        .filter(Boolean) as JSX.Element[]

      // 섹션을 더 작은 단위로 분할하여 페이지 간에 자연스럽게 흐르도록 합니다
      const splitSectionsIntoItems = () => {
        // 헤더는 항상 첫 페이지에 고정
        const items: JSX.Element[] = [header]

        // 각 섹션을 개별 항목으로 분할
        allSections.forEach((section) => {
          const sectionKey = section.key as string

          if (sectionKey === "education") {
            // 섹션 헤더 추가
            const sectionIndex = sectionOrder.indexOf("education") + 2
            items.push(
              <div key={`education-header`} className="mb-3">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. EDUCATION
                </h2>
              </div>,
            )

            // 각 교육 항목을 개별적으로 추가
            education.forEach((edu, index) => {
              items.push(
                <div key={`education-item-${index}`} className="mb-3">
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">
                        {edu.startDate} — {edu.endDate}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.school} {edu.degree && `(${edu.degree})`}
                      </h3>
                      <div className="text-sm text-gray-700">{edu.fieldOfStudy}</div>
                      <div className="text-sm text-gray-600">{edu.location}</div>
                      {edu.description && (
                        <div
                          className="text-sm mt-1 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: edu.description }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>,
              )
            })
          } else if (sectionKey === "projects") {
            // 섹션 헤더 추가
            const sectionIndex = sectionOrder.indexOf("projects") + 2
            items.push(
              <div key={`projects-header`} className="mb-3">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. PROJECTS
                </h2>
              </div>,
            )

            // 각 프로젝트 항목을 개별적으로 추가
            projects.forEach((project, index) => {
              items.push(
                <div key={`project-item-${index}`} className="mb-3">
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">
                        {project.startDate} — {project.endDate}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <div className="text-sm text-gray-700 font-medium">
                        {project.techStack.length > 0 && `Used ${project.techStack.join(", ")}`}
                      </div>
                      {project.summary && <div className="text-sm text-gray-700 mt-1">{project.summary}</div>}
                      {project.description && (
                        <div
                          className="text-sm mt-1 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: project.description }}
                        ></div>
                      )}
                      {project.githubUrl && (
                        <div className="text-xs mt-1">
                          <a
                            href={project.githubUrl}
                            className="text-blue-600 hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.githubUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>,
              )
            })
          } else if (sectionKey === "experience") {
            // 섹션 헤더 추가
            const sectionIndex = sectionOrder.indexOf("experience") + 2
            items.push(
              <div key={`experience-header`} className="mb-3">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. EXPERIENCE
                </h2>
              </div>,
            )

            // 각 경험 항목을 개별적으로 추가
            experience.forEach((exp, index) => {
              items.push(
                <div key={`experience-item-${index}`} className="mb-3">
                  <div className="grid grid-cols-[1fr_2fr] gap-3">
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">
                        {exp.startDate} — {exp.endDate}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <div className="text-sm text-gray-700">
                        {exp.company}, {exp.location}
                      </div>
                      {exp.description && (
                        <div
                          className="text-sm mt-1 text-gray-700"
                          dangerouslySetInnerHTML={{ __html: exp.description }}
                        ></div>
                      )}
                    </div>
                  </div>
                </div>,
              )
            })
          } else if (sectionKey === "publications") {
            const sectionIndex = sectionOrder.indexOf("publications") + 2
            items.push(
              <div key={`publications-header`} className="mb-3">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. PUBLICATIONS
                </h2>
              </div>,
            )

            publications.forEach((pub, index) => {
              items.push(
                <div key={`publication-item-${index}`} className="mb-3">
                  <div className="grid grid-cols-[1fr_2fr] gap-2">
                    <div className="text-sm text-gray-700">
                      {pub.date && <div className="font-medium">{pub.date}</div>}
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900">{pub.title}</h3>
                        <div className="text-sm text-gray-700">{pub.authors}</div>
                        <div className="text-sm text-gray-600 italic">{pub.conference}</div>
                        <div className="text-sm text-gray-500">{pub.status}</div>
                        {pub.summary && (
                          <div className="text-sm text-gray-700">{pub.summary}</div>
                        )}
                        {pub.url && (
                          <div className="text-xs mt-0.5">
                            <a
                              href={pub.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {pub.url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>,
              )
            })
          } else if (sectionKey === "awards") {
            // 섹션 헤더 추가
            const sectionIndex = sectionOrder.indexOf("awards") + 2
            items.push(
              <div key={`awards-header`} className="mb-3">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. AWARDS
                </h2>
              </div>,
            )

            // 각 수상 항목을 개별적으로 추가
            awards.forEach((award, index) => {
              items.push(
                <div key={`award-item-${index}`} className="mb-3">
                  <div className="grid grid-cols-[1fr_2fr] gap-2">
                    <div className="text-sm text-gray-700">
                      {award.date && <div className="font-medium">{award.date}</div>}
                    </div>
                    <div>
                      <div className="flex flex-col">
                        <h3 className="font-semibold text-gray-900">{award.title}</h3>
                        <div className="text-sm text-gray-700">{award.issuer}</div>
                        {award.description && (
                          <div
                            className="text-sm text-gray-700"
                            dangerouslySetInnerHTML={{ __html: award.description }}
                          ></div>
                        )}
                        {award.url && (
                          <div className="text-xs mt-0.5">
                            <a
                              href={award.url}
                              className="text-blue-600 hover:underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {award.url}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>,
              )
            })
          } else if (sectionKey === "skills") {
            // 스킬 섹션은 분할하기 어려우므로 하나의 항목으로 추가
            const sectionIndex = sectionOrder.indexOf("skills") + 2
            items.push(
              <div key={`skills-section`} className="mb-6">
                <h2 className="text-sm font-bold border-b border-gray-300 pb-1 mb-3 text-gray-800">
                  {String(sectionIndex).padStart(2, "0")}. SKILLS
                </h2>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-800 font-medium">{skill.name}</span>
                      <div className="flex gap-1 items-center">
                        {skill.level === "Expert" && (
                          <>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                          </>
                        )}
                        {skill.level === "Advanced" && (
                          <>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                          </>
                        )}
                        {skill.level === "Intermediate" && (
                          <>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                          </>
                        )}
                        {skill.level === "Basic" && (
                          <>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                          </>
                        )}
                        {skill.level === "Beginner" && (
                          <>
                            <span className="h-2 w-2 bg-gray-800 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>,
            )
          }
        })

        return items
      }

      // 각 항목의 높이를 추정하는 함수
      const estimateItemHeight = (item: JSX.Element): number => {
        const itemKey = item.key as string

        if (itemKey === "header") {
          // 헤더 높이 추정
          const summaryLength = professionalSummary.length
          return 180 + Math.ceil(summaryLength / 100) * 20 + personalDetails.links.length * 10
        }

        if (
          itemKey?.includes("education-header") ||
          itemKey?.includes("projects-header") ||
          itemKey?.includes("experience-header") ||
          itemKey?.includes("awards-header") ||
          itemKey?.includes("publications-header")
        ) {
          return 40 // 섹션 헤더 높이
        }

        if (itemKey?.includes("education-item")) {
          const index = Number.parseInt(itemKey.split("-").pop() || "0")
          const edu = education[index]
          let height = 80 // 기본 높이

          if (edu.description) {
            height += Math.ceil(edu.description.length / 100) * 20
          }

          return height
        }

        if (itemKey?.includes("project-item")) {
          const index = Number.parseInt(itemKey.split("-").pop() || "0")
          const project = projects[index]
          let height = 100 // 기본 높이

          if (project.summary) {
            height += Math.ceil(project.summary.length / 100) * 20
          }

          if (project.description) {
            height += Math.ceil(project.description.length / 100) * 20
          }

          return height
        }

        if (itemKey?.includes("experience-item")) {
          const index = Number.parseInt(itemKey.split("-").pop() || "0")
          const exp = experience[index]
          let height = 80 // 기본 높이

          if (exp.description) {
            height += Math.ceil(exp.description.length / 100) * 20
          }

          return height
        }

        if (itemKey?.includes("publication-item")) {
          const index = Number.parseInt(itemKey.split("-").pop() || "0")
          const pub = publications[index]
          let height = 80
          if (pub.summary) height += Math.ceil(pub.summary.length / 100) * 20
          return height
        }

        if (itemKey?.includes("award-item")) {
          const index = Number.parseInt(itemKey.split("-").pop() || "0")
          const award = awards[index]
          let height = 70 // 기본 높이

          if (award.description) {
            height += Math.ceil(award.description.length / 100) * 20
          }

          return height
        }

        if (itemKey?.includes("skills-section")) {
          return 80 + Math.ceil(skills.length / 2) * 30 // 스킬 섹션 높이
        }

        return 50 // 기본 높이
      }

      // 항목들을 페이지로 분할
      const items = splitSectionsIntoItems()
      const pages: JSX.Element[][] = []
      let currentPage: JSX.Element[] = []
      let currentHeight = 0
      const maxHeight = pageHeight - topMargin - bottomMargin // 페이지 최대 높이

      // 항목들을 페이지에 분배
      items.forEach((item) => {
        const itemHeight = estimateItemHeight(item)

        // 현재 페이지에 항목을 추가할 수 있는지 확인
        if (currentHeight + itemHeight <= maxHeight) {
          currentPage.push(item)
          currentHeight += itemHeight
        } else {
          // 현재 페이지가 가득 찼으면 새 페이지 시작
          pages.push(currentPage)
          currentPage = [item]
          currentHeight = itemHeight
        }
      })

      // 마지막 페이지 추가
      if (currentPage.length > 0) {
        pages.push(currentPage)
      }

      setPageContents(pages)
      setTotalPages(pages.length)

      // 페이지 변경 시 현재 페이지 조정
      if (currentPage > totalPages) {
        setCurrentPage(1)
      }
    }
  }, [resumeData, personalDetails, professionalSummary, education, projects, experience, skills, awards, publications])

  const handlePrevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))
  }

  return (
    <div className="relative">
      {/* Resume content */}
      <div
        className="bg-white shadow-lg"
        style={{
          position: "relative",
          height: `${pageHeight}px`,
          overflow: "hidden",
          marginBottom: "40px", // Add space between PDF and navigation
        }}
      >
        <div
          ref={resumeRef}
          className="p-8 font-sans"
          style={{
            height: "100%",
            overflow: "hidden",
            wordWrap: "break-word", // 텍스트 잘림 방지를 위한 단어 줄바꿈 설정
            wordBreak: "normal",
            textOverflow: "ellipsis", // 텍스트가 넘칠 경우 말줄임표 표시
            lineHeight: "1.5",
          }}
          id="resume-preview-content"
        >
          {/* Render current page content */}
          {pageContents[currentPage - 1]?.map((content, index) => (
            <div key={index}>{content}</div>
          ))}
        </div>

        {/* Page number watermark */}
        <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Page navigation - clearly separated from the PDF content */}
      <div
        className="flex justify-center items-center mt-6 gap-4 page-navigation bg-gray-100 py-3 rounded-md"
        id="page-navigation"
      >
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous Page
        </button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages <= 1}
        >
          Next Page
        </button>
      </div>
    </div>
  )
}
