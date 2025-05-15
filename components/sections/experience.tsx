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

type ExperienceProps = {
  data: {
    id: string
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    description: string
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Experience({ data, updateData, onReorder }: ExperienceProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addExperience = () => {
    const newExperience = {
      id: uuidv4(),
      company: "",
      position: "",
      location: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    updateData([...data, newExperience])
    setExpandedId(newExperience.id)
  }

  const removeExperience = (id: string) => {
    const updatedData = data.filter((item) => item.id !== id)
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
        Show your relevant work experience. Include position, company, dates, and responsibilities.
      </p>

      {data.map((experience, index) => (
        <div key={experience.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              // Only toggle if clicking on the header, not on the buttons
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(experience.id)
              }
            }}
          >
            <div>
              <h3 className="font-medium">
                {experience.position
                  ? `${experience.position}${experience.company ? ` at ${experience.company}` : ""}`
                  : "Add Experience"}
              </h3>
              {experience.startDate && (
                <p className="text-sm text-gray-500">
                  {experience.startDate} - {experience.endDate || "Present"}
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
                  removeExperience(experience.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>
                {expandedId === experience.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {expandedId === experience.id && (
            <div className="p-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`company-${experience.id}`}>Company</Label>
                  <Input
                    id={`company-${experience.id}`}
                    value={experience.company}
                    onChange={(e) => handleChange(experience.id, "company", e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <Label htmlFor={`position-${experience.id}`}>Position</Label>
                  <Input
                    id={`position-${experience.id}`}
                    value={experience.position}
                    onChange={(e) => handleChange(experience.id, "position", e.target.value)}
                    placeholder="e.g. Software Developer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`location-${experience.id}`}>Location</Label>
                  <Input
                    id={`location-${experience.id}`}
                    value={experience.location}
                    onChange={(e) => handleChange(experience.id, "location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start-date-${experience.id}`}>Start Date</Label>
                  <Input
                    id={`start-date-${experience.id}`}
                    value={experience.startDate}
                    onChange={(e) => handleChange(experience.id, "startDate", e.target.value)}
                    placeholder="e.g. Mar 2022"
                  />
                </div>
                <div>
                  <Label htmlFor={`end-date-${experience.id}`}>End Date</Label>
                  <Input
                    id={`end-date-${experience.id}`}
                    value={experience.endDate}
                    onChange={(e) => handleChange(experience.id, "endDate", e.target.value)}
                    placeholder="e.g. Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${experience.id}`}>Description</Label>
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
                  <div
                    id={`description-editor-${experience.id}`}
                    contentEditable
                    className="p-4 min-h-[150px] focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: experience.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      handleChange(experience.id, "description", content)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addExperience} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add one more employment
      </Button>
    </div>
  )
}
