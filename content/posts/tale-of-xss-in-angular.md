---
title: "Tale of XSS in Angular"
date: 2021-08-01T00:00:00Z
draft: false
categories: ["finding"]
---

![Angular XSS Featured Image](https://cdn-images-1.medium.com/max/800/0*67LG7dce-XrL1Pdk)

**Hello Security Researchers and Hackers**

In this writeup I explain how I found 2 rXSS vulnerabilities in Angular using automation.

---

## Tools Used
- [Findomain](https://findomain.app/) for subdomain monitoring
- Wappalyzer for technology detection

---

## Discovery Process
1. Received Telegram alert for new subdomains
2. Identified Angular 1.6 using Wappalyzer
3. Found reflected error parameter:
   
   `https://redacted.com/Home/Error?error=USER_NOT_AUTHORIZED`

---

## Exploitation
Used payload from [PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings):

![XSS Execution Proof](https://cdn-images-1.medium.com/max/800/1*cj_dJMkwSfiThMOIRyOMMA.png)

---

## Key Takeaways
- Demonstrate concrete impact for better severity rating
- Automate monitoring for fresh targets
- Know framework-specific vulnerabilities
