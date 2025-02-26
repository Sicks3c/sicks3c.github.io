---
title: "Abusing Url Shortners for Fun and Profit"
date: "2025-02-26T07:32:53+08:00"
author: "sicks3c"
authorTwitter: "OriginalSicksec" #do not include @
cover: "https://miro.medium.com/v2/resize:fit:1400/format:webp/0*EfOdlUz3Y7H7EHn6"
tags: ["bugbounty"]
description: ""
categories: ["research"]
showFullContent: true
readingTime: true
hideComments: false
--- 

**Hello Security Researchers**

Have you ever encountered a bug where it’s hard to show impact due to the lack of enumeration of a certain value of a parameter ?
Well if yes, In this writeup I will talk about how you can find and abuse URL shortners to ATO or Information disclosure

Many companies use URL shortners to send private invite and passwordless logins and things along those lines and it’s really difficult to guess or to brute these but there’s always a way to do things by thinking outside the box 📦

### Let’s talk about URL shortners and their types:

URL shortners are mostly linked to 3rd party services like https://bitly.com https://cutt.ly/ and others are made by company and they have custom built
Like : https://indd.jobs | https://inst.cr

### How can we approach this:

We can use multiple scenarios first we can test functionalities that triggers email and view the source of them if they contain a URL shortner check twitter account of company and extract all the links they share

### How URL Shortners Work:

Most of the case we should look for something that has this kind of behavior
`URLshortner.com/{HASH}` -> `Website.com/?token={YOU-CANT-GUESS-THIS}`
and based on that we can enumerate more and see more

### Complexity Level:

The complexity is based on the `HASH` used after the URL so it’s either integer strings and or both `Uppercase / Lowercase` length of the hash that starts from 5 characters plus
Examples:

https://url.com/12345 | https://url.com/A2B4C | https://url.com/A2B4CGFDFF33434

So if we are facing only integers it’s the easiest case here we can of course generate all the possible and it’s kinda difficult for other case OR IS IT ? 😈

### Exploitation:

For our write up we will focus on `inst.cr` since it has a custom built and it’s so difficult to guess http://inst.cr/t/UEJBUThINjYx
So how can we guess the `hash` ?

We don’t, we don’t need to we can basically throw the domain into `waybackurls` or `gau` and see the results

![image](https://miro.medium.com/v2/resize:fit:350/format:webp/1*ftwj3Zsk04oeCYyhpiHaRA.png)

Now we need to see where the links are redirecting and see if something useful is the paths that we can make a use of
we simply do this

`gau inst.cr | httpx -location -mc 301,302 | grep -Eo ‘\[(.*?)\]`

In order to `grep` the value of all the rediction and spit it out in your terminal

![image2](https://miro.medium.com/v2/resize:fit:550/format:webp/1*wWGo3BhNsyuHUnAcFNb0Qg.png)

Now based on the application logic, you can search for keywords that are interesting like `token` `id` `uuid` nd things along those lines
after that you will have a very good argument to convince the team that you were able to get the value of a certain parameter that they made difficult to guess

### Results?

Blind ATO twice in a private program due to valide token on URLshortner
`site.com/?basket=token`

![image3](https://miro.medium.com/v2/resize:fit:1160/format:webp/1*F6qL02Q0fJNiwcbIw4NOfg.png)

Multiple IDORS went from Invalid to valid

![indeed](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-8KmXrZc6p0bTo6z3svwoA.png)


I hope you enjoyed reading this and I will catch you in the next one

Stay curious ❤
