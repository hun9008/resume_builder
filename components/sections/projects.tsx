"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Link,
  MoveUp,
  MoveDown,
} from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { useRef } from "react"

type ProjectsProps = {
  data: {
    id: string
    name: string
    startDate: string
    endDate: string
    techStack: string[]
    githubUrl: string
    summary: string
    description: string
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Projects({ data, updateData, onReorder }: ProjectsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newTech, setNewTech] = useState<string>("")
  const descriptionRefs = useRef<{ [key: string]: string }>({})

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: any) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addProject = () => {
    const newProject = {
      id: uuidv4(),
      name: "",
      startDate: "",
      endDate: "",
      techStack: [],
      githubUrl: "",
      summary: "",
      description: "",
    }
    updateData([...data, newProject])
    setExpandedId(newProject.id)
  }

  const removeProject = (id: string) => {
    const updatedData = data.filter((item) => item.id !== id)
    updateData(updatedData)
  }

  const addTechStack = (id: string) => {
    if (!newTech.trim()) return

    const updatedData = data.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          techStack: [...item.techStack, newTech.trim()],
        }
      }
      return item
    })

    updateData(updatedData)
    setNewTech("")
  }

  const removeTechStack = (projectId: string, techIndex: number) => {
    const updatedData = data.map((item) => {
      if (item.id === projectId) {
        return {
          ...item,
          techStack: item.techStack.filter((_, index) => index !== techIndex),
        }
      }
      return item
    })

    updateData(updatedData)
  }

  const moveUp = (index: number) => {
    if (index === 0) return
    if (onReorder) {
      onReorder(index, index - 1)
    }
  }

  const moveDown = (index: number) => {
    if (index === data.length - 1) return
    if (onReorder) {
      onReorder(index, index + 1)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Show your relevant experience (last 10 years). Use bullet points to note your achievements, if possible - use
        numbers/facts (Achieved X, measured by Y, by doing Z).
      </p>

      {data.map((project, index) => (
        <div key={project.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              // Only toggle if clicking on the header, not on the buttons
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(project.id)
              }
            }}
          >
            <div>
              <h3 className="font-medium">{project.name || "Add Project"}</h3>
              {project.startDate && (
                <p className="text-sm text-gray-500">
                  {project.startDate} - {project.endDate || "Present"}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  moveUp(index)
                }}
                disabled={index === 0}
              >
                <MoveUp className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  moveDown(index)
                }}
                disabled={index === data.length - 1}
              >
                <MoveDown className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  removeProject(project.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>
                {expandedId === project.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {expandedId === project.id && (
            <div className="p-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <Label htmlFor={`name-${project.id}`}>Project Name</Label>
                <Input
                  id={`name-${project.id}`}
                  value={project.name}
                  onChange={(e) => handleChange(project.id, "name", e.target.value)}
                  placeholder="Project name"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start-date-${project.id}`}>Start Date</Label>
                  <Input
                    id={`start-date-${project.id}`}
                    value={project.startDate}
                    onChange={(e) => handleChange(project.id, "startDate", e.target.value)}
                    placeholder="e.g. Jan 2023"
                  />
                </div>
                <div>
                  <Label htmlFor={`end-date-${project.id}`}>End Date</Label>
                  <Input
                    id={`end-date-${project.id}`}
                    value={project.endDate}
                    onChange={(e) => handleChange(project.id, "endDate", e.target.value)}
                    placeholder="e.g. Mar 2023 or Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`tech-stack-${project.id}`}>Tech Stack</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {project.techStack.map((tech, index) => (
                    <div key={index} className="bg-gray-100 px-2 py-1 rounded-md flex items-center gap-1">
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => removeTechStack(project.id, index)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id={`tech-stack-${project.id}`}
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="e.g. React"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTechStack(project.id)
                      }
                    }}
                  />
                  <Button type="button" onClick={() => addTechStack(project.id)}>
                    Add
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor={`github-url-${project.id}`}>GitHub URL</Label>
                <Input
                  id={`github-url-${project.id}`}
                  value={project.githubUrl}
                  onChange={(e) => handleChange(project.id, "githubUrl", e.target.value)}
                  placeholder="e.g. https://github.com/username/project"
                />
              </div>

              <div>
                <Label htmlFor={`summary-${project.id}`}>Summary</Label>
                <Input
                  id={`summary-${project.id}`}
                  value={project.summary}
                  onChange={(e) => handleChange(project.id, "summary", e.target.value)}
                  placeholder="A brief one-line summary of your project"
                />
              </div>

              <div>
                <Label htmlFor={`description-${project.id}`}>Description</Label>
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.execCommand("bold", false)}
                      className="h-8 w-8 p-0"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.execCommand("italic", false)}
                      className="h-8 w-8 p-0"
                    >
                      <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.execCommand("underline", false)}
                      className="h-8 w-8 p-0"
                    >
                      <Underline className="h-4 w-4" />
                    </Button>
                    <div className="h-4 border-r border-gray-300 mx-1"></div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.execCommand("insertUnorderedList", false)}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => document.execCommand("insertOrderedList", false)}
                      className="h-8 w-8 p-0"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="h-4 border-r border-gray-300 mx-1"></div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const url = prompt("Enter URL:")
                        if (url) document.execCommand("createLink", false, url)
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Link className="h-4 w-4" />
                    </Button>
                  </div>
                  {/* <div
                    id={`description-editor-${project.id}`}
                    contentEditable
                    className="p-4 min-h-[150px] focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      handleChange(project.id, "description", content)
                    }}
                  ></div> */}
                  <div
                    id={`description-editor-${project.id}`}
                    contentEditable
                    dir="ltr"
                    className="p-4 min-h-[150px] focus:outline-none text-left"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      descriptionRefs.current[project.id] = content
                    }}
                    onBlur={() => {
                      const content = descriptionRefs.current[project.id]
                      if (content !== undefined) {
                        handleChange(project.id, "description", content)
                      }
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addProject} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add one more project
      </Button>
    </div>
  )
}
