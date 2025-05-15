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

type AwardsProps = {
  data: {
    id: string
    title: string
    issuer: string
    date: string
    url: string
    description: string
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Awards({ data, updateData, onReorder }: AwardsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addAward = () => {
    const newAward = {
      id: uuidv4(),
      title: "",
      issuer: "",
      date: "",
      url: "",
      description: "",
    }
    updateData([...data, newAward])
    setExpandedId(newAward.id)
  }

  const removeAward = (id: string) => {
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
        Include awards, recognitions, and achievements that are relevant to your career.
      </p>

      {data.map((award, index) => (
        <div key={award.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              // Only toggle if clicking on the header, not on the buttons
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(award.id)
              }
            }}
          >
            <div>
              <h3 className="font-medium">{award.title || "Add Award"}</h3>
              {award.issuer && <p className="text-sm text-gray-500">{award.issuer}</p>}
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
                  removeAward(award.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>
                {expandedId === award.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {expandedId === award.id && (
            <div className="p-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <Label htmlFor={`title-${award.id}`}>Award Title</Label>
                <Input
                  id={`title-${award.id}`}
                  value={award.title}
                  onChange={(e) => handleChange(award.id, "title", e.target.value)}
                  placeholder="e.g. Excellence Award"
                />
              </div>

              <div>
                <Label htmlFor={`issuer-${award.id}`}>Issuer</Label>
                <Input
                  id={`issuer-${award.id}`}
                  value={award.issuer}
                  onChange={(e) => handleChange(award.id, "issuer", e.target.value)}
                  placeholder="e.g. University, Company, Organization"
                />
              </div>

              <div>
                <Label htmlFor={`date-${award.id}`}>Date</Label>
                <Input
                  id={`date-${award.id}`}
                  value={award.date}
                  onChange={(e) => handleChange(award.id, "date", e.target.value)}
                  placeholder="e.g. May 2023"
                />
              </div>

              <div>
                <Label htmlFor={`url-${award.id}`}>URL</Label>
                <Input
                  id={`url-${award.id}`}
                  value={award.url}
                  onChange={(e) => handleChange(award.id, "url", e.target.value)}
                  placeholder="e.g. https://example.com/award"
                />
              </div>

              <div>
                <Label htmlFor={`description-${award.id}`}>Description</Label>
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
                    id={`description-editor-${award.id}`}
                    contentEditable
                    className="p-4 min-h-[150px] focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: award.description }}
                    onInput={(e) => {
                      const content = (e.target as HTMLDivElement).innerHTML
                      handleChange(award.id, "description", content)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addAward} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add one more award
      </Button>
    </div>
  )
}
