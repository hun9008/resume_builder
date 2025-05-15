"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, List, ListOrdered, Link } from "lucide-react"

type ProfessionalSummaryProps = {
  data: string
  updateData: (data: string) => void
}

export default function ProfessionalSummary({ data, updateData }: ProfessionalSummaryProps) {
  const [charCount, setCharCount] = useState(0)
  const [isEditorFocused, setIsEditorFocused] = useState(false)
  const maxChars = 600

  useEffect(() => {
    // Count characters without HTML tags
    const div = document.createElement("div")
    div.innerHTML = data
    setCharCount(div.textContent?.length || 0)
  }, [data])

  const handleBold = () => {
    document.execCommand("bold", false)
    const content = document.getElementById("summary-editor")?.innerHTML
    if (content) updateData(content)
  }

  const handleItalic = () => {
    document.execCommand("italic", false)
    const content = document.getElementById("summary-editor")?.innerHTML
    if (content) updateData(content)
  }

  const handleBulletList = () => {
    document.execCommand("insertUnorderedList", false)
    const content = document.getElementById("summary-editor")?.innerHTML
    if (content) updateData(content)
  }

  const handleNumberedList = () => {
    document.execCommand("insertOrderedList", false)
    const content = document.getElementById("summary-editor")?.innerHTML
    if (content) updateData(content)
  }

  const handleLinkInsert = () => {
    const url = prompt("Enter URL:")
    if (url) {
      document.execCommand("createLink", false, url)
      const content = document.getElementById("summary-editor")?.innerHTML
      if (content) updateData(content)
    }
  }

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const content = (e.target as HTMLDivElement).innerHTML
    updateData(content)

    // Count characters without HTML tags
    const div = document.createElement("div")
    div.innerHTML = content
    setCharCount(div.textContent?.length || 0)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Write 2-4 short, energetic sentences about how great you are. Mention the role and what you did. What were the
        big achievements? Describe your motivation and list your skills.
      </p>

      <div className="border rounded-md overflow-hidden">
        <div className="bg-gray-50 p-2 border-b flex items-center gap-2">
          <Button type="button" variant="ghost" size="sm" onClick={handleBold} className="h-8 w-8 p-0">
            <Bold className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleItalic} className="h-8 w-8 p-0">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <Button type="button" variant="ghost" size="sm" onClick={handleBulletList} className="h-8 w-8 p-0">
            <List className="h-4 w-4" />
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={handleNumberedList} className="h-8 w-8 p-0">
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="h-4 border-r border-gray-300 mx-1"></div>
          <Button type="button" variant="ghost" size="sm" onClick={handleLinkInsert} className="h-8 w-8 p-0">
            <Link className="h-4 w-4" />
          </Button>
          <div className="flex-grow"></div>
          <Button type="button" variant="ghost" size="sm" className="text-blue-500 text-xs">
            Get help with writing
          </Button>
        </div>
        <div
          id="summary-editor"
          contentEditable
          className={`p-4 min-h-[150px] focus:outline-none ${isEditorFocused ? "ring-2 ring-blue-500" : ""}`}
          dangerouslySetInnerHTML={{ __html: data }}
          onInput={handleContentChange}
          onFocus={() => setIsEditorFocused(true)}
          onBlur={() => setIsEditorFocused(false)}
        ></div>
      </div>

      <div className="flex justify-end items-center text-sm text-gray-500">
        <span>Recruiter tip: write 400-600 characters to increase interview chances</span>
        <span className="ml-2 font-medium">
          {charCount} / {maxChars}
        </span>
        {charCount > 400 && charCount < 600 && <span className="ml-2">😊</span>}
      </div>
    </div>
  )
}
