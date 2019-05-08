---
title: guitarragrams (process)
date: 2018-09-23 18:02:06
tags:
  - music
  - software
categories:
type: post
subtitle: Guitar chord diagrams
target_url:
parent_page: music
feat_img: /images/guitarragrams/sketch-thumb.jpg
post_images:
  - /images/guitarragrams/sketch-1.jpg
  - /images/guitarragrams/sketch-2.jpg
  - /images/guitarragrams/sketch-3.jpg
external_url: https://rjsalvadorr.github.io/guitarragrams/
---

Around early 2018, I started compiling guitar chord diagrams as I studied different chord patterns and inversions. That turned into a huge Visio document, which was a pain in the ass to update. I figured that putting it on the web would be a much cooler idea.

<!-- more -->

This was also a neat opportunity to learn some tech stuff, so I decided to jump on the Vue bandwagon for this one. That turned out to be a great decision. I found that the [Vue CLI tools](https://cli.vuejs.org/guide/creating-a-project.html) didn't get in my way at all, and the Vue documentation made for an gentle learning curve for a React dev.

With this project, I just needed to figure out two things, and all the hard stuff was finished in one afternoon:

1. Data format for the chord diagrams. I laid it out in a few JSON files here.
1. Vue component scheme. I settled for four components here:
  + ChordGroup
  + FretboardDiagram
  + FretboardMarker
  + PatternGroup

If you're already familiar with web dev frameworks and the Node stack, the view from Vue is majestic.

For more info, check out the project repository at [github.com/rjsalvadorr/guitarragrams](https://github.com/rjsalvadorr/guitarragrams)
