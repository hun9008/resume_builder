"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { v4 as uuidv4 } from "uuid"

type PublicationsProps = {
  data: {
    id: string
    title: string
    authors: string
    conference: string
    status: string
    date: string
    url: string
    summary: string
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Publications({ data, updateData, onReorder }: PublicationsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addPublication = () => {
    const newPub = {
      id: uuidv4(),
      title: "",
      authors: "",
      conference: "",
      status: "Submitted",
      date: "",
      url: "",
      summary: "",
    }
    updateData([...data, newPub])
    setExpandedId(newPub.id)
  }

  const removePublication = (id: string) => {
    updateData(data.filter((item) => item.id !== id))
  }

  const moveUp = (index: number) => {
    if (index === 0 || !onReorder) return
    onReorder(index, index - 1)
  }

  const moveDown = (index: number) => {
    if (index === data.length - 1 || !onReorder) return
    onReorder(index, index + 1)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Add your academic publications. If not accepted yet, mark status as "Submitted" or "Under Review".
      </p>

      {data.map((pub, index) => (
        <div key={pub.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(pub.id)
              }
            }}
          >
            <div>
              <h3 className="font-medium">{pub.title || "Untitled Publication"}</h3>
              {pub.conference && <p className="text-sm text-gray-500">{pub.conference}</p>}
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
                  removePublication(pub.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>{expandedId === pub.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
            </div>
          </div>

          {expandedId === pub.id && (
            <div className="p-4 border-t space-y-4" onClick={(e) => e.stopPropagation()}>
              <div>
                <Label htmlFor={`title-${pub.id}`}>Title</Label>
                <Input
                  id={`title-${pub.id}`}
                  value={pub.title}
                  onChange={(e) => handleChange(pub.id, "title", e.target.value)}
                  placeholder="Title of the paper"
                />
              </div>

              <div>
                <Label htmlFor={`authors-${pub.id}`}>Authors</Label>
                <Input
                  id={`authors-${pub.id}`}
                  value={pub.authors}
                  onChange={(e) => handleChange(pub.id, "authors", e.target.value)}
                  placeholder="e.g. J. Kim, Y. Jeong, etc."
                />
              </div>

              <div>
                <Label htmlFor={`conference-${pub.id}`}>Conference</Label>
                <Input
                  id={`conference-${pub.id}`}
                  value={pub.conference}
                  onChange={(e) => handleChange(pub.id, "conference", e.target.value)}
                  placeholder="e.g. MICCAI 2025"
                />
              </div>

              <div>
                <Label htmlFor={`date-${pub.id}`}>Date</Label>
                <Input
                  id={`date-${pub.id}`}
                  value={pub.date}
                  onChange={(e) => handleChange(pub.id, "date", e.target.value)}
                  placeholder="e.g. Mar 2025"
                />
              </div>

              <div>
                <Label htmlFor={`status-${pub.id}`}>Status</Label>
                <Input
                  id={`status-${pub.id}`}
                  value={pub.status}
                  onChange={(e) => handleChange(pub.id, "status", e.target.value)}
                  placeholder="e.g. Submitted / Under Review / Accepted"
                />
              </div>

              <div>
                <Label htmlFor={`url-${pub.id}`}>Link (optional)</Label>
                <Input
                  id={`url-${pub.id}`}
                  value={pub.url}
                  onChange={(e) => handleChange(pub.id, "url", e.target.value)}
                  placeholder="Link to paper or repository"
                />
              </div>

              <div>
                <Label htmlFor={`summary-${pub.id}`}>Summary</Label>
                <Input
                  id={`summary-${pub.id}`}
                  value={pub.summary}
                  onChange={(e) => handleChange(pub.id, "summary", e.target.value)}
                  placeholder="Short description of contribution"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addPublication} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add one more publication
      </Button>
    </div>
  )
}