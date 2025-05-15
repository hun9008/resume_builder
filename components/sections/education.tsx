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
import { useRef } from "react"

type EducationProps = {
  data: {
    id: string
    school: string
    location: string
    degree: string
    fieldOfStudy: string
    startDate: string
    endDate: string
    description: string
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Education({ data, updateData, onReorder }: EducationProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const descriptionRefs = useRef<Record<string, string>>({})
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addEducation = () => {
    const newEducation = {
      id: uuidv4(),
      school: "",
      location: "",
      degree: "",
      fieldOfStudy: "",
      startDate: "",
      endDate: "",
      description: "",
    }
    updateData([...data, newEducation])
    setExpandedId(newEducation.id)
  }

  const removeEducation = (id: string) => {
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
        A varied education on your resume sums up the value that your learnings and background will bring to job.
      </p>

      {data.map((education, index) => (
        <div key={education.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              // Only toggle if clicking on the header, not on the buttons
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(education.id)
              }
            }}
          >
            <div>
              <h3 className="font-medium">{education.school || "Add School"}</h3>
              {education.startDate && (
                <p className="text-sm text-gray-500">
                  {education.startDate} - {education.endDate || "Present"}
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
                  removeEducation(education.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>
                {expandedId === education.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {expandedId === education.id && (
            <div className="p-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`school-${education.id}`}>School</Label>
                  <Input
                    id={`school-${education.id}`}
                    value={education.school}
                    onChange={(e) => handleChange(education.id, "school", e.target.value)}
                    placeholder="School name"
                  />
                </div>
                <div>
                  <Label htmlFor={`location-${education.id}`}>Location</Label>
                  <Input
                    id={`location-${education.id}`}
                    value={education.location}
                    onChange={(e) => handleChange(education.id, "location", e.target.value)}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`degree-${education.id}`}>Degree</Label>
                  <Input
                    id={`degree-${education.id}`}
                    value={education.degree}
                    onChange={(e) => handleChange(education.id, "degree", e.target.value)}
                    placeholder="e.g. Bachelor of Science"
                  />
                </div>
                <div>
                  <Label htmlFor={`field-${education.id}`}>Field of Study</Label>
                  <Input
                    id={`field-${education.id}`}
                    value={education.fieldOfStudy}
                    onChange={(e) => handleChange(education.id, "fieldOfStudy", e.target.value)}
                    placeholder="e.g. Computer Science"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`start-date-${education.id}`}>Start Date</Label>
                  <Input
                    id={`start-date-${education.id}`}
                    value={education.startDate}
                    onChange={(e) => handleChange(education.id, "startDate", e.target.value)}
                    placeholder="e.g. Mar 2018"
                  />
                </div>
                <div>
                  <Label htmlFor={`end-date-${education.id}`}>End Date</Label>
                  <Input
                    id={`end-date-${education.id}`}
                    value={education.endDate}
                    onChange={(e) => handleChange(education.id, "endDate", e.target.value)}
                    placeholder="e.g. Feb 2022 or Present"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${education.id}`}>Description</Label>
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
                    id={`description-editor-${education.id}`}
                    contentEditable
                    dir="ltr"
                    className="p-4 min-h-[150px] focus:outline-none text-left"
                    dangerouslySetInnerHTML={{ __html: education.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      handleChange(education.id, "description", content)
                    }}
                  ></div> */}
                  <div
                    id={`description-editor-${education.id}`}
                    contentEditable
                    dir="ltr"
                    className="p-4 min-h-[150px] focus:outline-none text-left"
                    dangerouslySetInnerHTML={{ __html: education.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      descriptionRefs.current[education.id] = content
                    }}
                    onBlur={() => {
                      const content = descriptionRefs.current[education.id]
                      if (content !== undefined) {
                        handleChange(education.id, "description", content)
                      }
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addEducation} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add one more education
      </Button>
    </div>
  )
}
