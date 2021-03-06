# Vuepress quick start

## Overview

Designed for getting a blog-style project off the ground quickly, this project starts with
a basic blog-style page, with content sorted in different categories.

For more info, check out the [GitHub repo](https://github.com/rjsalvadorr/portfolio-v3)

## Usage

#### 1. Install

`npm i -g vuepress`  
or  
`yarn global add vuepress`

#### 2. Dev

`npm start`  
or  
`yarn start`

#### 3. Deploy

`npm run build`  
or  
`yarn build`

Read more about Vuepress here: https://vuepress.vuejs.org/guide/

## Post Thumbnails

_NOTE: THIS ONLY ACCEPTS JPG IMAGES (for now)_

In order to work, these have to go in `.vuepress/public/images/thumbs`. A page with content
in `/category1/sample-title/README.md` would have a corresponding image in
`/.vuepress/public/images/thumbs/sample-title.jpg`

## Page excerpts

See the [VuePress docs](https://vuepress.vuejs.org/guide/custom-themes.html#content-excerpt) for more info.

## Fonts

The site uses [Google Fonts](https://fonts.google.com/about) to load fonts. See the stylesheet reference in the theme config (`.vuepress/config.js`)

## Front-matter data

Added on top of every markdown document in the site. Looks like this:

```
---
title: Writing words is neat
date: 2019-03-24 13:35:57
subtitle:
type: post
category: deep-thoughts
---

# Words words words

Bacon ipsum dolor amet in est pork belly ex excepteur.
Ipsum cow leberkas adipisicing, in picanha strip steak
burgdoggen commodo ullamco et sausage brisket nulla cupim.
```

This site has been configured to use these settings to build the page flow
for various categories and pages.

#### title

Title of the post/category

#### date

Date for post/category. Appears in the post list of its category page.
Also used for sorting.  
Expected values: date/time, formatted like `2019-03-26 13:35:57` or simply `2019-04-23` (YYYY-MM-DD)

#### subtitle

Subtitle of post. Appears in the post list of its category page.

#### type

Type of the object.  
Expected values: `post | category | link`

#### category

Category of this object. This can be customized for the categories in the page.
For example, a portfolio page could have categories like:  
`software | art | contact`.

#### target_url

Used for `link` objects. Defines the target of the link. For example:

```
---
title: Click this thing
date: 2019-03-24 13:35:57
type: link
category: deep-thoughts
target_url: https://example.org
---

# Words words words

Bacon ipsum dolor amet in est pork belly ex excepteur.
```

#### classes

A list of classes that are applied alongside the `.content-wrapper` element. For the given example:

```
---
title: Writing words is neat
date: 2019-03-24 13:35:57
type: post
category: deep-thoughts
classes:
  - high-level
  - woke
---

# Words words words

Bacon ipsum dolor amet in est pork belly ex excepteur.
``` 

We'll end up with an element like:  
`<div class="content-wrapper content-wrapper--high-level content-wrapper--woke">`

#### options

A list of options that trigger changes to site/post rendering. Available options:

```
options:
  - hideDate   # hides date on post list
```
