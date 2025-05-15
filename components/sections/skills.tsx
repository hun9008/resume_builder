"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Plus, Trash2, MoveUp, MoveDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { v4 as uuidv4 } from "uuid"

type SkillsProps = {
  data: {
    id: string
    name: string
    level: "Expert" | "Advanced" | "Intermediate" | "Basic" | "Beginner"
  }[]
  updateData: (data: any) => void
  onReorder?: (fromIndex: number, toIndex: number) => void
}

export default function Skills({ data, updateData, onReorder }: SkillsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showLevels, setShowLevels] = useState(true)
  const [newSkill, setNewSkill] = useState("")

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleChange = (id: string, field: string, value: string) => {
    const updatedData = data.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    updateData(updatedData)
  }

  const addSkill = () => {
    if (!newSkill.trim()) return

    const newSkillItem = {
      id: uuidv4(),
      name: newSkill.trim(),
      level: "Intermediate" as const,
    }

    updateData([...data, newSkillItem])
    setNewSkill("")
  }

  const removeSkill = (id: string) => {
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

  const renderLevelDots = (level: string) => {
    switch (level) {
      case "Expert":
        return (
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
          </div>
        )
      case "Advanced":
        return (
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
          </div>
        )
      case "Intermediate":
        return (
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
          </div>
        )
      case "Basic":
        return (
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
          </div>
        )
      case "Beginner":
        return (
          <div className="flex gap-1">
            <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
            <span className="h-2 w-2 bg-gray-300 rounded-full"></span>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Choose 5 important skills that show you fit the position. Make sure they match the key skills mentioned in the
        job listing (especially when applying via an online system).
      </p>

      <div className="flex items-center space-x-2">
        <Switch id="show-levels" checked={showLevels} onCheckedChange={setShowLevels} />
        <Label htmlFor="show-levels">Don't show experience level</Label>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {["SQL", "PHP", "Git", "HTML & CSS", "HTML", "CSS", "Node.js", "jQuery", "Microsoft Office", "HTML5"].map(
          (skill) => (
            <Button
              key={skill}
              variant="outline"
              size="sm"
              onClick={() => {
                setNewSkill(skill)
                addSkill()
              }}
              className="flex items-center gap-1"
            >
              {skill}
              <Plus className="h-3 w-3" />
            </Button>
          ),
        )}
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              addSkill()
            }
          }}
        />
        <Button onClick={addSkill}>Add</Button>
      </div>

      {data.map((skill, index) => (
        <div key={skill.id} className="border rounded-md overflow-hidden">
          <div
            className="p-4 cursor-pointer flex justify-between items-center"
            onClick={(e) => {
              // Only toggle if clicking on the header, not on the buttons
              if ((e.target as HTMLElement).closest("button") === null) {
                toggleExpand(skill.id)
              }
            }}
          >
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{skill.name}</h3>
              <span className="text-sm text-gray-500">{skill.level}</span>
              {showLevels && renderLevelDots(skill.level)}
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
                  removeSkill(skill.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <span>
                {expandedId === skill.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {expandedId === skill.id && (
            <div className="p-4 border-t" onClick={(e) => e.stopPropagation()}>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor={`name-${skill.id}`}>Skill Name</Label>
                  <Input
                    id={`name-${skill.id}`}
                    value={skill.name}
                    onChange={(e) => handleChange(skill.id, "name", e.target.value)}
                    placeholder="e.g. JavaScript"
                  />
                </div>
                <div>
                  <Label htmlFor={`level-${skill.id}`}>Level</Label>
                  <Select value={skill.level} onValueChange={(value) => handleChange(skill.id, "level", value)}>
                    <SelectTrigger id={`level-${skill.id}`}>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Expert">Expert</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
