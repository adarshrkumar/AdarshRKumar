---
title: Getting YouTube Channel Videos Without an API Key
author: adarshrkumar
date: 11/19/26
categories: ["general","projects"]
---
Intro: why I wanted a channel's latest videos on my site, and why I skipped the official API.

## The Problem

Section on the YouTube Data API's key, quotas and setup, and why that's too much for a small site.

## The RSS Feed Trick

Section on the public channel feed URL (`videos.xml?channel_id=...`) and what it contains.

## Turning the Feed Into JSON

Section on using `rss2json` to convert the feed, with a short code example.

## Showing the Videos

Section on rendering the results, including limiting the number of videos per channel.

## Limits and Gotchas

Section on rate limits, missing fields, caching and what happens if the service goes down.
