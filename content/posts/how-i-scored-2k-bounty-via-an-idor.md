---
title: "How I Scored 2K Bounty via an Easy IDOR"
date: "2025-02-26T07:32:53+08:00"
author: "sicks3c"
authorTwitter: "OriginalSicksec" #do not include @
cover: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*UGPX9sjyXDzUQbq6"
tags: ["bugbounty"]
description: "Easiest IDOR Ever"
categories: ["finding"]
showFullContent: true
readingTime: true
hideComments: false
--- 

**Hello Security Researchers**

In this writeup I will talk how I was able to find an IDOR in one of the largest Russian Company nothing other than Mail.ru
So approaching targets with huge scope can be frustrating sometimes since you don’t know where to start, For me I started looking in the main scope of `Mail.ru Games`

1. I fired up Burp
2. Created an account
3. Adding things in my cart
4. Viewing the `blog`
5. Creating a support ticket

Before testing anything the ticket link looked kind of suspicious since it had `/ticket/INTEGER`

![ticket](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ErP1l5Al5QOK8_O5qfdP5w.png)

Let’s breakdown what can go wrong here
We have few parameters `project_id/user_id/sign` and the ticket number
First thing I did is to remove the sign which is the signature and see if I can access it from an unauthenticated browser

This looks easy no way that works right ?!!

![img2](https://miro.medium.com/v2/resize:fit:400/format:webp/0*jE5ml_v7U8wAzl9H)

Well you’re wrong it worked and I was able to see my ticket and the conversation with the agent and also any attached file, I could also speak in the conversation as anonymous user 😁

Further testing showed that changing the ticket number can allow viewing others ticket and changing the `user_id` can allow viewing other ticket of that matched ID

went and wrapped up a good report with [my friend](https://x.com/wld_basha) , and it was triaged within minutes an paid after few days

![bounty](https://miro.medium.com/v2/resize:fit:590/format:webp/1*WXV_nYEgIwyAQ0HnWSpizA.png)

### Takeaways

* Don’t be afraid of diving the Main app it’s where all the juicy things exist
* Never underestimate yourself from finding bugs everyone has a unique view for the target
* Don’t be discouraged if you didn’t find a bug today tomorrow you will

I hope you enjoyed reading this and I will catch you in the next one

Stay curious ❤


