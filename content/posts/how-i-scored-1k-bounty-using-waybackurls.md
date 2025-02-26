---
title: "How I Scored 1K Bounty Using Waybackurls"
date: "2021-08-03T07:32:53+08:00"
author: "sicks3c"
authorTwitter: "OriginalSicksec" #do not include @
cover: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*LAhS-F4FRQKXUOnj"
tags: ["bugbounty"]
description: "waybackurl Finding"
categories: ["finding"]
showFullContent: true
readingTime: true
hideComments: false
--- 

**Hello Security Researchers**

In this write-up, I want to share with you a finding that I discovered in a public bug bounty program that ended up paying me 1K just using a single command on the terminal


I won’t be able to disclose the name of the program since the leak was huge and they are still merging all the previous algorithm they used before to a new one and the deprecated API is still reachable


The program exist in **Hackerone** in more than a decade with big names on them, I was familiar with the services they offer since I was a user so I started to enumerate subdomain where I noticed a weird link that may actually hold sensitive data since they are parsing everything in URL path so my first approach was checking the [waybackurls](https://github.com/tomnomnom/waybackurls) since [Tomnomnom](https://x.com/TomNomNom)

has a very unique tools I used it as follows

`waybackurls requests.redacted.com`

I was surprise with the amount of URLS that belongs to users with the tokens and I was like no way they’re valid right ?!

![gif](https://europe1.discourse-cdn.com/flex005/uploads/ewelinkforum/original/2X/2/26f9b6464e5ae5981f1c2c02375c3f264e2b94ad.gif)


Guess I was wrong, I went to the API page and it looks like a simple POST request with the link leaked and a simple data via curl can do the Proof Of Concept using something like this

![poc](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*wfnBQlHJQu79hgOFYi_jyA.png)

I tested in my own env and sent the report right away, It got paid under few days and the team started the fix

![poc2](https://miro.medium.com/v2/resize:fit:960/format:webp/1*JkJJxM8lYzpGWDgxsvER3w.png)

### Takeways

* Never say that this program has a lot of know hackers and I won’t find a thing
* everyone has it’s unique approach to a target and you may see something that other didn’t


