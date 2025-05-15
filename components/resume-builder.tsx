"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import PersonalDetails from "@/components/sections/personal-details"
import ProfessionalSummary from "@/components/sections/professional-summary"
import Education from "@/components/sections/education"
import Projects from "@/components/sections/projects"
import Experience from "@/components/sections/experience"
import Skills from "@/components/sections/skills"
import Awards from "@/components/sections/awards"
import ResumePreview from "@/components/resume-preview"
import { Download, GripVertical, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"
import { useAuth } from "@/contexts/auth-context"

export type ResumeData = {
  personalDetails: {
    name: string
    jobTitle: string
    email: string
    phone: string
    address: string
    links: { platform: string; url: string }[]
  }
  professionalSummary: string
  education: {
    id: string
    school: string
    location: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    description: string
  }[]
  projects: {
    id: string
    name: string
    startDate: string
    endDate: string
    techStack: string[]
    githubUrl: string
    summary: string
    description: string
  }[]
  experience: {
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    description: string
  }[]
  skills: {
    id: string
    name: string
    level: "Expert" | "Advanced" | "Intermediate" | "Basic" | "Beginner"
  }[]
  awards: {
    id: string
    title: string
    issuer: string
    date: string
    url: string
    description: string
  }[]
  sectionOrder?: string[]
}

// 빈 이력서 데이터 템플릿
const emptyResumeData: ResumeData = {
  personalDetails: {
    name: "",
    jobTitle: "",
    email: "",
    phone: "",
    address: "",
    links: [],
  },
  professionalSummary: "",
  education: [],
  projects: [],
  experience: [],
  skills: [],
  awards: [],
  sectionOrder: ["experience", "education", "projects", "awards", "skills"],
}

// Define section types for reordering
type SectionType = {
  id: string
  title: string
  key: string
}

const sectionTypes: SectionType[] = [
  { id: "experience", title: "Experience", key: "experience" },
  { id: "education", title: "Education", key: "education" },
  { id: "projects", title: "Projects", key: "projects" },
  { id: "awards", title: "Awards", key: "awards" },
  { id: "skills", title: "Skills", key: "skills" },
]

export default function ResumeBuilder() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [sections, setSections] = useState<SectionType[]>(sectionTypes)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  // 사용자의 이력서 데이터 불러오기
  useEffect(() => {
    const fetchResumeData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/resume")

        if (response.ok) {
          const data = await response.json()
          if (data.resumeData && Object.keys(data.resumeData).length > 0) {
            setResumeData(data.resumeData)

            // 섹션 순서 설정
            if (data.resumeData.sectionOrder) {
              const orderedSections = data.resumeData.sectionOrder
                .map((key: string) => sectionTypes.find((section) => section.key === key))
                .filter(Boolean) as SectionType[]

              setSections(orderedSections)
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch resume data:", error)
        toast({
          title: "Error",
          description: "Failed to load your resume data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (user) {
      fetchResumeData()
    }
  }, [user, toast])

  // 이력서 데이터 저장
  const saveResumeData = async () => {
    try {
      setIsSaving(true)
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Your resume has been saved",
        })
      } else {
        throw new Error("Failed to save resume data")
      }
    } catch (error) {
      console.error("Failed to save resume data:", error)
      toast({
        title: "Error",
        description: "Failed to save your resume data",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateResumeData = (section: keyof ResumeData, data: any) => {
    setResumeData((prev) => ({
      ...prev,
      [section]: data,
    }))
  }

  // Handle section reordering
  const handleSectionReorder = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)

    // Update the section order in resumeData
    const newSectionOrder = items.map((item) => item.key)
    setResumeData((prev) => ({
      ...prev,
      sectionOrder: newSectionOrder,
    }))
  }

  // Handle item reordering within a section
  const moveItem = (sectionKey: keyof ResumeData, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return

    setResumeData((prev) => {
      const section = [...(prev[sectionKey] as any[])]
      const [movedItem] = section.splice(fromIndex, 1)
      section.splice(toIndex, 0, movedItem)

      return {
        ...prev,
        [sectionKey]: section,
      }
    })
  }

  // Improved PDF download function with better text handling
  const handleDownloadPDF = async () => {
    try {
      toast({
        title: "PDF 준비 중...",
        description: "이력서를 생성하는 동안 잠시 기다려주세요.",
      })

      // Get the total number of pages
      const totalPages = document
        .querySelectorAll(".page-navigation .text-sm.font-medium")[0]
        ?.textContent?.match(/\d+/g)
      const numPages = totalPages ? Number.parseInt(totalPages[1]) : 1

      // Store the current page
      const currentPage = document
        .querySelectorAll(".page-navigation .text-sm.font-medium")[0]
        ?.textContent?.match(/\d+/g)
      const originalPage = currentPage ? Number.parseInt(currentPage[0]) : 1

      // Get the navigation buttons
      const prevButton = document.querySelector(".page-navigation button:first-child") as HTMLButtonElement
      const nextButton = document.querySelector(".page-navigation button:last-child") as HTMLButtonElement

      // First go to page 1
      while (
        Number.parseInt(
          (document.querySelectorAll(".page-navigation .text-sm.font-medium")[0]?.textContent?.match(/\d+/g) || [
            "1",
          ])[0],
        ) > 1
      ) {
        prevButton?.click()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Create a PDF document
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      })

      // Process each page
      for (let i = 1; i <= numPages; i++) {
        // Navigate to the page
        if (i > 1) {
          nextButton?.click()
          await new Promise((resolve) => setTimeout(resolve, 300))
        }

        // Get the current page content
        const resumeContent = document.getElementById("resume-preview-content")
        if (!resumeContent) continue

        // Create a temporary container to hold the content without page navigation
        const tempContainer = document.createElement("div")
        tempContainer.style.width = "210mm"
        tempContainer.style.height = "297mm"
        tempContainer.style.padding = "15mm" // 여백을 늘려 텍스트 잘림 방지
        tempContainer.style.backgroundColor = "white"
        tempContainer.style.position = "fixed"
        tempContainer.style.left = "-9999px"
        tempContainer.style.top = "0"
        tempContainer.style.zIndex = "-1"
        tempContainer.style.overflow = "hidden"
        tempContainer.style.boxSizing = "border-box"
        tempContainer.style.wordWrap = "break-word" // 단어 줄바꿈 설정
        tempContainer.style.wordBreak = "normal"
        tempContainer.style.fontSize = "12px" // 폰트 크기 조정으로 텍스트 잘림 방지
        tempContainer.style.lineHeight = "1.5" // 줄 간격 조정

        // Clone the content
        const clonedContent = resumeContent.cloneNode(true) as HTMLElement

        // Remove navigation elements and page numbers
        const navElements = clonedContent.querySelectorAll(".page-navigation")
        navElements.forEach((el) => el.remove())

        const pageNumbers = clonedContent.querySelectorAll(".absolute.bottom-4.right-4")
        pageNumbers.forEach((el) => el.remove())

        // Add the cloned content to the temp container
        tempContainer.appendChild(clonedContent)
        document.body.appendChild(tempContainer)

        // Wait a moment for the container to render properly
        await new Promise((resolve) => setTimeout(resolve, 300))

        // Generate canvas for this page
        const canvas = await html2canvas(tempContainer, {
          scale: 2, // 해상도 향상
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
          windowWidth: 1200, // 넓은 창 너비로 텍스트 줄바꿈 문제 방지
          onclone: (document, element) => {
            // 복제된 요소의 스타일 조정
            const allText = element.querySelectorAll("p, span, h1, h2, h3, h4, h5, h6, div")
            allText.forEach((el) => {
              // 텍스트 요소의 스타일 조정
              el.style.wordWrap = "break-word"
              el.style.wordBreak = "normal"
              el.style.whiteSpace = "normal"
              el.style.overflow = "visible"
            })
            return element
          },
        })

        // Add a new page for pages after the first
        if (i > 1) {
          pdf.addPage()
        }

        // Add the image to the PDF
        const imgData = canvas.toDataURL("image/png")
        const imgWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight > pageHeight ? pageHeight : imgHeight)

        // Collect all links
        const links: { x: number; y: number; width: number; height: number; url: string }[] = []
        const allLinks = tempContainer.querySelectorAll("a")
        const containerRect = tempContainer.getBoundingClientRect()

        allLinks.forEach((link) => {
          if (link.href) {
            const rect = link.getBoundingClientRect()

            // Calculate position relative to the container
            const x = ((rect.left - containerRect.left) * imgWidth) / containerRect.width
            const y = ((rect.top - containerRect.top) * imgHeight) / containerRect.height
            const width = (rect.width * imgWidth) / containerRect.width
            const height = (rect.height * imgHeight) / containerRect.height

            // Only add links that are within the page boundaries
            if (x >= 0 && x < imgWidth && y >= 0 && y < pageHeight) {
              links.push({
                x,
                y,
                width,
                height,
                url: link.href,
              })
            }
          }
        })

        // Add clickable links to the current page
        links.forEach((link) => {
          pdf.link(link.x, link.y, link.width, link.height, { url: link.url })
        })

        // Clean up
        document.body.removeChild(tempContainer)
      }

      // Restore the original page
      // Go to first page
      while (
        Number.parseInt(
          (document.querySelectorAll(".page-navigation .text-sm.font-medium")[0]?.textContent?.match(/\d+/g) || [
            "1",
          ])[0],
        ) > 1
      ) {
        prevButton?.click()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Then go to the original page
      for (let j = 1; j < originalPage; j++) {
        nextButton?.click()
        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      // Save the PDF
      pdf.save("resume.pdf")

      toast({
        title: "PDF 다운로드 완료",
        description: "이력서가 성공적으로 다운로드되었습니다.",
      })
    } catch (error) {
      console.error("PDF 생성 오류:", error)
      toast({
        title: "오류",
        description: "PDF 생성에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    }
  }

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section)
  }

  // Render section components based on their order
  const renderSectionComponent = (sectionKey: string) => {
    switch (sectionKey) {
      case "education":
        return (
          <Card className="border rounded-lg overflow-hidden" key="education">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("education")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Education</span>
              </div>
              <div className="flex items-center">
                <span>{activeSection === "education" ? "▲" : "▼"}</span>
              </div>
            </div>
            {activeSection === "education" && (
              <div className="p-4 pt-0 border-t">
                <Education
                  data={resumeData.education}
                  updateData={(data) => updateResumeData("education", data)}
                  onReorder={(fromIndex, toIndex) => moveItem("education", fromIndex, toIndex)}
                />
              </div>
            )}
          </Card>
        )
      case "projects":
        return (
          <Card className="border rounded-lg overflow-hidden" key="projects">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("projects")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Projects</span>
              </div>
              <div className="flex items-center">
                <span>{activeSection === "projects" ? "▲" : "▼"}</span>
              </div>
            </div>
            {activeSection === "projects" && (
              <div className="p-4 pt-0 border-t">
                <Projects
                  data={resumeData.projects}
                  updateData={(data) => updateResumeData("projects", data)}
                  onReorder={(fromIndex, toIndex) => moveItem("projects", fromIndex, toIndex)}
                />
              </div>
            )}
          </Card>
        )
      case "experience":
        return (
          <Card className="border rounded-lg overflow-hidden" key="experience">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("experience")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Experience</span>
              </div>
              <div className="flex items-center">
                <span>{activeSection === "experience" ? "▲" : "▼"}</span>
              </div>
            </div>
            {activeSection === "experience" && (
              <div className="p-4 pt-0 border-t">
                <Experience
                  data={resumeData.experience}
                  updateData={(data) => updateResumeData("experience", data)}
                  onReorder={(fromIndex, toIndex) => moveItem("experience", fromIndex, toIndex)}
                />
              </div>
            )}
          </Card>
        )
      case "skills":
        return (
          <Card className="border rounded-lg overflow-hidden" key="skills">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("skills")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Skills</span>
              </div>
              <div className="flex items-center">
                <span>{activeSection === "skills" ? "▲" : "▼"}</span>
              </div>
            </div>
            {activeSection === "skills" && (
              <div className="p-4 pt-0 border-t">
                <Skills
                  data={resumeData.skills}
                  updateData={(data) => updateResumeData("skills", data)}
                  onReorder={(fromIndex, toIndex) => moveItem("skills", fromIndex, toIndex)}
                />
              </div>
            )}
          </Card>
        )
      case "awards":
        return (
          <Card className="border rounded-lg overflow-hidden" key="awards">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("awards")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Awards</span>
              </div>
              <div className="flex items-center">
                <span>{activeSection === "awards" ? "▲" : "▼"}</span>
              </div>
            </div>
            {activeSection === "awards" && (
              <div className="p-4 pt-0 border-t">
                <Awards
                  data={resumeData.awards}
                  updateData={(data) => updateResumeData("awards", data)}
                  onReorder={(fromIndex, toIndex) => moveItem("awards", fromIndex, toIndex)}
                />
              </div>
            )}
          </Card>
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your resume data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 p-4 overflow-y-auto bg-white border-r">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Resume Builder</h1>
          <Button onClick={saveResumeData} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save Resume"}
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="border rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("personalDetails")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Personal Details</span>
              </div>
              <span>{activeSection === "personalDetails" ? "▲" : "▼"}</span>
            </div>
            {activeSection === "personalDetails" && (
              <div className="p-4 pt-0 border-t">
                <PersonalDetails
                  data={resumeData.personalDetails}
                  updateData={(data) => updateResumeData("personalDetails", data)}
                />
              </div>
            )}
          </Card>

          <Card className="border rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer flex justify-between items-center"
              onClick={() => toggleSection("professionalSummary")}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">Professional Summary</span>
              </div>
              <span>{activeSection === "professionalSummary" ? "▲" : "▼"}</span>
            </div>
            {activeSection === "professionalSummary" && (
              <div className="p-4 pt-0 border-t">
                <ProfessionalSummary
                  data={resumeData.professionalSummary}
                  updateData={(data) => updateResumeData("professionalSummary", data)}
                />
              </div>
            )}
          </Card>

          {/* Draggable section list */}
          <DragDropContext onDragEnd={handleSectionReorder}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="p-2 cursor-grab">
                              <GripVertical className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="flex-grow">{renderSectionComponent(section.key)}</div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Right side - Preview */}
      <div className="w-full lg:w-1/2 bg-gray-100 p-4 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gray-100 p-2 flex justify-between items-center mb-4">
          <div></div>
          <div className="flex items-center gap-2">
            <Button onClick={handleDownloadPDF} className="bg-blue-500 hover:bg-blue-600">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-lg mx-auto max-w-[210mm] min-h-[297mm]">
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  )
}
