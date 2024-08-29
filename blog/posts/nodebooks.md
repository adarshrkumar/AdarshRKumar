---
title: Introducing NodeBooks
author: adarshrkumar
date: 06/02/24
categories: ["general","projects"]
---
Hello everyone,

I was just wasting time, fiddling with [node.js](https://nodejs.org), and I thought i'd make a notebook application.  

## Process

### Basic File Parser

At first, I just made a way to view MarkDown (`.md`) based notebooks that were stored on your filesystem and served to the user. The user could edit the file in markdown and it would autosave back to the filesystem.  

### Next Steps

I then integraded the [tinymce](https://tiny.cloud) rich-text editor and parsed the MarkDown using [marked](https://marked.js.org) to serve to the user in the editor, but soon realized that saving in MarkDown was working well.  
I then switched to saving in [HTML](https://akum.site/p/HTMLInfo) (then Base64 Encoded HTML) instead.  

### Ability to create

I know that creating a folder or a file was as simple as one `fs` `sync` command.  
I then worked to implement this functionality and he we go, the final product.

### Name

At first, this application was simply titled `Notebook Application`, but one time I accidently started to type `Nodebook` and thus the name `NodeBooks` came about.

## Download

You can download NodeBooks [here](https://downloads.adarshrkumar.dev/zip/NodeBooks).  

-- Adarsh