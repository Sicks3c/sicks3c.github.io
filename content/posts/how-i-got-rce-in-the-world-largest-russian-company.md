---
title: "How I RCE'd the Largest RU Company"
date: "2021-08-19T07:32:53+08:00"
author: "sicks3c"
authorTwitter: "OriginalSicksec" #do not include @
cover: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*6I1qONtwJ1kgELMI"
tags: ["bugbounty", "rce"]
description: ""
categories: ["finding"]
showFullContent: true
readingTime: true
hideComments: false
--- 

**Hello Security Researchers**

In this writeup I will explain how I was able to find RCE in `Mail.ru` which is considered the world largest internet company,
Before starting to hack I was wondering on how I should approach the target and what most people would miss in the program, they have a huge scope which means it should be something out there sitting for me to find

I started looking with the Favicon using this [script](https://gist.github.com/yehgdotnet/b9dfc618108d2f05845c4d8e28c5fc6a)
Where I replace the link with the Mail.ru favicon, once generate I go to shodan.io and search for it

![img1](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QaglJY1N4ZmUe7x65Wru3w.png)

Now we search this hash on shodan.io with the `http.favicon.hash` syntax

![img2](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*pmEgkNtfn3FhxTLg4U8Uiw.png)

Now I went to see page by page and look for something suspicious with an unusual port number so I kept going till I found a host with port 8080
That has a Welcome to Nginx page

Once found I wanted to dig further on what’s going on, so I started to FUZZ directories and I found `/static/shards/html` Publicly accessible and it looked Juicy


From here I guessed that most of these hosts are Internal host and it will be difficult to reach them and I decided to [Nmap](https://nmap.org/) all of them
Found one that has a JDWP stands for (Java Debug Wire Protocol)

![nmap](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*1SOscii9_Beb5q4xEn-8-A.png)

So I started my research about this service / port and it turns out that it may be vulnerable to RCE by reading this [article](https://ioactive.com/hacking-java-debug-wire-protocol-or-how/)

With the help of this [jdwp-shellifier](https://github.com/IOActive/jdwp-shellifier) I was able to show the RCE and the team triaged and paid `$$$` since the server belongs to their infrastructure not the main assets

![bounty](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*SRItvaGIGW_67n-mvXNBcA.png)

Hope you enjoyed reading this and catch you in the next adventure

Stay curious ❤