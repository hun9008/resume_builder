"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

type PersonalDetailsProps = {
  data: {
    name: string
    jobTitle: string
    email: string
    phone: string
    address: string
    links: { platform: string; url: string }[]
  }
  updateData: (data: any) => void
}

export default function PersonalDetails({ data, updateData }: PersonalDetailsProps) {
  const [showMore, setShowMore] = useState(false)

  const handleChange = (field: string, value: string) => {
    updateData({
      ...data,
      [field]: value,
    })
  }

  const handleLinkChange = (index: number, field: string, value: string) => {
    const updatedLinks = [...data.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    updateData({
      ...data,
      links: updatedLinks,
    })
  }

  const addLink = () => {
    updateData({
      ...data,
      links: [...data.links, { platform: "", url: "" }],
    })
  }

  const removeLink = (index: number) => {
    const updatedLinks = data.links.filter((_, i) => i !== index)
    updateData({
      ...data,
      links: updatedLinks,
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="jobTitle">Job Title</Label>
          <Input
            id="jobTitle"
            value={data.jobTitle}
            onChange={(e) => handleChange("jobTitle", e.target.value)}
            placeholder="e.g. Software Developer"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={data.name.split(" ")[0] || ""}
            onChange={(e) => {
              const lastName = data.name.split(" ").slice(1).join(" ")
              handleChange("name", `${e.target.value} ${lastName}`)
            }}
            placeholder="First Name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={data.name.split(" ").slice(1).join(" ") || ""}
            onChange={(e) => {
              const firstName = data.name.split(" ")[0] || ""
              handleChange("name", `${firstName} ${e.target.value}`)
            }}
            placeholder="Last Name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="010-1234-5678"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          value={data.address}
          onChange={(e) => handleChange("address", e.target.value)}
          placeholder="City, Country"
        />
      </div>

      <div className="space-y-2">
        <Label>Links</Label>
        {data.links.map((link, index) => (
          <div key={index} className="flex gap-2 items-center">
            <Input
              value={link.platform}
              onChange={(e) => handleLinkChange(index, "platform", e.target.value)}
              placeholder="Platform (e.g. GitHub)"
              className="flex-1"
            />
            <Input
              value={link.url}
              onChange={(e) => handleLinkChange(index, "url", e.target.value)}
              placeholder="URL"
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeLink(index)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addLink} className="mt-2">
          <Plus className="h-4 w-4 mr-2" />
          Add Link
        </Button>
      </div>

      {!showMore ? (
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowMore(true)} className="text-blue-500">
          Add more detail ▼
        </Button>
      ) : (
        <Button type="button" variant="ghost" size="sm" onClick={() => setShowMore(false)} className="text-blue-500">
          Show less ▲
        </Button>
      )}
    </div>
  )
}
