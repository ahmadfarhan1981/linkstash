"use client"

import { useState, useMemo, useEffect } from "react"
import { Badge } from "@site/src/components/shadcn/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@site/src/components/shadcn/card"
import { ScrollArea } from "@site/src/components/shadcn/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@site/src/components/shadcn/select"
import {useColorMode} from '@docusaurus/theme-common';

type ChangeType = "new" | "improved" | "fixed" | "deprecated"

interface ChangelogEntry {
  type: ChangeType
  description: string
  version: string
}

interface VersionChangelog {
  version: string
  date: string
  changes: Omit<ChangelogEntry, "version">[]
}

// Sample changelog data
const changelog: VersionChangelog[] = [
  {
    version: "2.0.0",
    date: "2024-01-15",
    changes: [
      { type: "new", description: "Introduced dark mode across the entire application" },
      { type: "improved", description: "Enhanced performance of data loading by 50%" },
      { type: "fixed", description: "Resolved issue with user profile picture uploads" },
      { type: "deprecated", description: "Removed support for legacy API endpoints" },
    ],
  },
  {
    version: "1.9.0",
    date: "2023-12-01",
    changes: [
      { type: "new", description: "Added multi-language support" },
      { type: "improved", description: "Redesigned dashboard for better user experience" },
      { type: "fixed", description: "Fixed a bug in the search functionality" },
    ],
  },
  {
    version: "1.8.5",
    date: "2023-11-15",
    changes: [
      { type: "fixed", description: "Patched security vulnerability in user authentication" },
      { type: "improved", description: "Optimized database queries for faster response times" },
    ],
  },
]

function getChangeTypeColor(type: ChangeType): string {
  switch (type) {
    case "new":
      return "bg-green-500"
    case "improved":
      return "bg-blue-500"
    case "fixed":
      return "bg-yellow-500"
    case "deprecated":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

interface ChangelogProps {
  isDarkMode: boolean
}

export default function Changelog() {
  const {colorMode, setColorMode} = useColorMode();
  const [isDarkMode, setIsDarkMode] = useState(colorMode === "dark");
  useEffect(() => {
    setIsDarkMode(colorMode === "dark");
  }, [colorMode]);
  const [startVersion, setStartVersion] = useState(changelog[changelog.length - 1].version)
  const [endVersion, setEndVersion] = useState(changelog[0].version)

  const filteredChanges = useMemo(() => {
    const startIndex = changelog.findIndex((v) => v.version === startVersion)
    const endIndex = changelog.findIndex((v) => v.version === endVersion)
    return changelog
      .slice(endIndex, startIndex + 1)
      .flatMap((v) => v.changes.map((c) => ({ ...c, version: v.version })))
  }, [startVersion, endVersion])

  const groupedChanges = useMemo(() => {
    return filteredChanges.reduce(
      (acc, change) => {
        if (!acc[change.type]) {
          acc[change.type] = []
        }
        acc[change.type].push(change)
        return acc
      },
      {} as Record<ChangeType, ChangelogEntry[]>,
    )
  }, [filteredChanges])

  return (
    <div className={`container mx-auto py-10 px-4 min-h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-100"}`}>
      <h1 className={`text-4xl font-bold mb-8 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>Changelog</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <Select onValueChange={setStartVersion} defaultValue={startVersion}>
          <SelectTrigger
            className={`w-[180px] border rounded-md shadow-sm ${
              isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <SelectValue placeholder="Start Version" />
          </SelectTrigger>
          <SelectContent
            className={`border rounded-md shadow-md ${
              isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {changelog.map((v) => (
              <SelectItem
                key={v.version}
                value={v.version}
                className={`${isDarkMode ? "text-gray-100 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}`}
              >
                {v.version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setEndVersion} defaultValue={endVersion}>
          <SelectTrigger
            className={`w-[180px] border rounded-md shadow-sm ${
              isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            <SelectValue placeholder="End Version" />
          </SelectTrigger>
          <SelectContent
            className={`border rounded-md shadow-md ${
              isDarkMode ? "bg-gray-800 border-gray-600 text-gray-100" : "bg-white border-gray-300 text-gray-900"
            }`}
          >
            {changelog.map((v) => (
              <SelectItem
                key={v.version}
                value={v.version}
                className={`${isDarkMode ? "text-gray-100 hover:bg-gray-700" : "text-gray-900 hover:bg-gray-100"}`}
              >
                {v.version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ScrollArea
        className={`h-[600px] rounded-lg border p-4 shadow-md ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <Card className={`shadow-none border-0 ${isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              Changes from {startVersion} to {endVersion}
            </CardTitle>
            <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Showing changes between selected versions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(Object.keys(groupedChanges) as ChangeType[]).map((changeType) => (
              <div key={changeType} className="mb-6">
                <h3
                  className={`text-lg font-semibold capitalize mb-3 ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}
                >
                  {changeType}
                </h3>
                <ul className="space-y-2">
                  {groupedChanges[changeType].map((change, index) => (
                    <li
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-md ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <Badge className={`${getChangeTypeColor(change.type)} text-white mt-1`}>{change.type}</Badge>
                      <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>
                        <strong className={isDarkMode ? "text-gray-100" : "text-gray-900"}>[{change.version}]</strong>{" "}
                        {change.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </ScrollArea>
    </div>
  )
}

