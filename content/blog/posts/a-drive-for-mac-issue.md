---
title: How to Fix Deleted Files on Disk Still Syncing via Google Drive for Desktop on Mac!
author: adarshrkumar
date: 09/22/26
categories: ["general"]
---
This is most definitely not going to be a 100% accurate tutorial. This is just going to be what I did in order to fix this issue for myself.

## The Issue

You may have a really large file that you may not have created.
Maybe an app you used to open a file in Google Drive created it as some sort of backup, but you don't need it.

You may wish to stop syncing or delete that file so that it doesn't start syncing to the cloud, take a long time (perhaps never finishing), and block other files from syncing.

### Possible Failed Solutions

If you try to stop syncing in Google Drive for Desktop on Windows, you'll be able to click "Stop syncing" after hovering over the file name.
But on macOS, when you try to do this, nothing changes on screen, and there's no button or area to click.

You might think, "I might be able to delete the file. I don't need it anyway, so I don't mind deleting it. Since there will no longer be a copy on disk, Google Drive won't be able to pull any file content to keep syncing, especially if I delete it permanently."

On Windows, when you do this, you might get the desired result, but on Mac, the file will keep syncing.

So I kept going through all the Drive caches, looked online in the Google Support forums with responses from volunteers, and checked other places one might look to find a solution to this. For a while, it was all to no avail, and I gave up.

## My Temporary Solution

My solution so far for files that aren't too large is to just let them upload, even though they won't actually exist when they finish uploading. After it uploads, the deletion might then happen, resulting in a net change of nothing. But why the wasted effort, and possibly also the wasted network resources, computing power, etc.?

## My "Investigative" Work

Then I decided to do some digging. I found that when I renamed the `~/Library/Application Support/Google/DriveFS` folder to something like `DriveFS copy` or something similar, Google Drive reset back to its freshly installed state.

This was no good because I no longer had my accounts, so then I decided I would just rename the folder for my account. That fixed the problem: the file was no longer being uploaded. But now I didn't have any of my files, and the Drive folder associated with that account had also disappeared.

## The Final Solution

So then I decided to spin up an instance of Claude Code, and I told it to look for that file name, noting that it might be encoded. This was the result from the AI:

```text
Found it — it's referenced inside Google DriveFS's internal metadata databases, not as a regular file in the tree:

- metadata_sqlite_db and metadata_sqlite_db-wal
- mirror_metadata_sqlite.db and mirror_metadata_sqlite.db-wal

Let me pull the surrounding context to see what record it's tied to.

  Ran 1 shell command

Confirmed: ~~My File Name~~ isn't a real file in the visible tree — it's an entry inside Google DriveFS's internal SQLite metadata caches:

- metadata_sqlite_db / metadata_sqlite_db-wal
- mirror_metadata_sqlite.db / mirror_metadata_sqlite.db-wal

It shows up multiple times as a local-title with mimeType: application/octet-stream, associated with Drive file IDs like !1jFRT1O32A1CoYCza4hNtk_NmdR1BcCx8, an md5 checksum e3aaa7e0ff4d765cd84bdbd9b5144b8b, and account 111947515509907655804 / your gmail.com account. It's tracked as a child of a folder.

This is DriveFS's naming pattern for a temporary local placeholder/pack file created during sync (before Drive assigns/receives the real filename) — it's not something you created directly; it's sync-layer bookkeeping. It's not present as an actual file on disk in this copy, only as a metadata row.
```

The mysterious ghost file had been found. Now, how to delete it? Well, I didn't ask the AI to delete the references to the file inside those databases. Instead, I just deleted those database files myself entirely. That did fix the issue, and now the ghost file is no longer syncing.

This might be a semi-destructive action, deleting these databases without really looking at whether there's anything of use in them, but in my case, there was nothing in them, and I was able to safely (I hope) delete those databases without any issues.
