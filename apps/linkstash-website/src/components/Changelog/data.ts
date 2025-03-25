
export type ChangeType = "new" | "improved" | "fixed" | "deprecated" | "chore"

export interface ChangelogEntry {
  type: ChangeType
  description: string
  version: string
}

export interface VersionChangelog {
  version: string
  date: string
  changes: Omit<ChangelogEntry, "version">[]
}

function compareVersions(v1:string, v2:string):number {
  const semverRegex = /^(\d+)(?:\.(\d+))?(?:\.(\d+))?([a-zA-Z]*)$/;

  const parse = (v:string) => {
    const match = v.match(semverRegex);
    if (!match) return null;
    const [, major, minor, patch, suffix] = match;
    return {
      major: Number(major),
      minor: Number(minor || 0),
      patch: Number(patch || 0),
      suffix: suffix || ''
    };
  };

  const p1 = parse(v1);
  const p2 = parse(v2);

  // If both are invalid, compare strings directly
  if (!p1 && !p2) return v1.localeCompare(v2);

  // If one is invalid, it's considered bigger
  if (!p1) return 1;
  if (!p2) return -1;

  // Compare numeric parts
  if (p1.major !== p2.major) return p1.major - p2.major;
  if (p1.minor !== p2.minor) return p1.minor - p2.minor;
  if (p1.patch !== p2.patch) return p1.patch - p2.patch;

  // Compare suffix: empty suffix is considered greater
  if (p1.suffix === p2.suffix) return 0;
  if (!p1.suffix) return 1;
  if (!p2.suffix) return -1;
  return p1.suffix.localeCompare(p2.suffix);
}



const logs: VersionChangelog[] = [
  {
    version: "1.0.0",
    date: "2024-12-30",
    changes: [
      { type: "new", description: "Initial release. Core features introduced." },
      { type: "new", description: "Manage and organize bookmarks." },
      { type: "new", description: "Filter bookmarks using tags." },
      { type: "new", description: "Import bookmarks via Netscape bookmark file format." },
      { type: "new", description: "Archive pages for offlline reading using Readability format." },
      { type: "new", description: "Deploy using Docker." },
    ],
  },
  {
    version: "1.1.0",
    date: "2025-03-25",
    changes: [
      { type: "new", description: "Added bulk operations to tag, delete, or archive multiple bookmarks." },
      { type: "improved", description: "Refined UI for better usability." },
      { type: "improved", description: "Enhanced frontend performance by minimizing unnecessary re-renders during filtering." },
      { type: "chore", description: "Refactored repository structure to support future development of the client library." },
      { type: "new", description: "Permalink in the url bar in the bookmarks page" },
    ],
  },
]

export const changelog: VersionChangelog[] = logs.toSorted((a: VersionChangelog, b: VersionChangelog) => { return compareVersions( a.version, b.version)})

