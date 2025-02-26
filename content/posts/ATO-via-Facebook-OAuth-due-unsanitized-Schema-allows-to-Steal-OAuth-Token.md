---
title: "ATO via Facebook OAuth Due Unsanitized Schema Allows to Steal OAuth Token"
date: "2023-09-01T07:32:53+08:00"
author: "sicks3c"
authorTwitter: "OriginalSicksec" #do not include @
cover: "https://neelbhatt.com/wp-content/uploads/2018/01/fb13.png"
tags: ["ATO"]
description: "Exploiting OAuth flow to Takeover accounts via Login with FB"
categories: ["research"]
showFullContent: true
readingTime: true
hideComments: false
---

# Deep Dive into an OAuth Exploit: A 0-Day Case Study

**Hello Everyone,**

In our continuous hunt for novel attack vectors and security challenges, [**mainteemoforfun**](https://x.com/wld_basha) and I embarked on an in-depth exploration of **mobile authentication mechanisms**. Our efforts culminated in the discovery of a striking **0-day vulnerability** back in **2023** that has since been patched.

This vulnerability enabled us to potentially hijack user sessions on websites utilizing **Facebook’s “Login With Facebook”** feature. By manipulating the **`redirect_uri`** parameter in the **OAuth** flow, an attacker could redirect authentication tokens to a host under their control.

Below, I provide an expert breakdown of the exploit, our proof-of-concept, and the impact it generated.

---

## Understanding the Vulnerability

### OAuth Basics and the Attack Surface

**OAuth** is the de facto standard for delegated authorization. Typically, during an OAuth transaction, the client application registers a trusted **`redirect_uri`** (often in a custom scheme format, such as `fb://clientID`). This URI is used by the authorization server (**Facebook**, in this case) to send back the authentication token after a user successfully logs in.

When testing OAuth implementations, it is common to experiment with modifying the **`redirect_uri`** parameter to see if the endpoint strictly enforces whitelist validations. In our research, we hypothesized that if we could subtly alter this parameter without triggering a verification error, the token might be redirected to an unintended destination.

### The Exploit Mechanism

1. **Initial Experimentation:**  
   We began by modifying the **`redirect_uri`** in the OAuth flow. Our initial test—attempting to change the **clientID** directly (e.g., `fb://anotherClientID`) produced a “mismatch” error, as expected.

2. **Refined Modification:**  
   By appending an extra character to the **clientID** (e.g., `fb://clientIDa`), we observed that the authentication token was redirected to the newly specified scheme. This minor change bypassed the strict check, allowing the token to be delivered to an endpoint not originally whitelisted by the service.

3. **Verification:**  
   To rule out any anomalies, we repeated the process several times. The results were consistent, confirming that this behavior was not a fluke but a genuine vulnerability.

---

## Proof-of-Concept

To demonstrate the impact of this vulnerability, I developed a small **Android** application with a custom intent filter designed to capture the redirected token. Here’s an excerpt from the app’s manifest:

    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="fbClientIDa" />
    </intent-filter>

When the OAuth flow was initiated, the token was unexpectedly sent to this malicious app instead of the legitimate one. This confirmed that the modified **`redirect_uri`** could indeed be exploited to intercept sensitive **authentication tokens**.

![Proof of Concept](https://i.imgur.com/5HcVciv.png)

---

## Reporting and Bounty Results

We responsibly disclosed this vulnerability to the **Facebook Bug Bounty Program** and also submitted reports via **HackerOne** and **Bugcrowd**. Here’s a summary of our findings:

### HackerOne
- **Total Reports:** 20  
  - **Severity Breakdown:** 5 reports categorized between **medium** and **high** severity, which resulted in bounties totaling approximately **15K USD**.
  - **Additional Insights:** Some targets, although not immediately vulnerable, were noted for having partial **backend verifications**, hinting at broader issues.

### Bugcrowd
- **Total Reports:** 10  
  - **Outcome:** The majority of these were marked as requiring highly unlikely conditions in a real-world scenario, rendering them inapplicable for payouts.

Visual summaries of our bounty earnings are available below:

![Bounties](https://i.imgur.com/kV8G3NY.png)  
![Bounties2](https://i.imgur.com/FVozCeK.png)

---

## Facebook’s Response

The **Facebook** security team promptly acknowledged our disclosure. They confirmed that the issue was known, addressed, and has since been fixed. Our verification tests post-patch indicate that the fix is effective, reinforcing the importance of vigilant **OAuth validation**.

---

## Key Takeaways

- **Innovation in Testing:**  
  **OAuth** implementations may harbor subtle vulnerabilities. Experimenting with unconventional modifications—like tweaking the **`redirect_uri`** it can sometimes reveal significant security flaws.

- **Real-World Implications:**  
  Even minor oversights in **OAuth validation** can have severe repercussions, including the potential for **account hijacking**.

- **Continuous Vigilance:**  
  The evolving landscape of **authentication mechanisms** demands constant scrutiny. As attackers and defenders, embracing creativity in testing is essential to uncovering and mitigating emerging threats.

Stay curious 🖤

---

By sharing this in-depth analysis, I hope to encourage fellow security professionals to explore every nuance of **authentication protocols**. Remember, in the world of cybersecurity, even “stupid” ideas can lead to groundbreaking discoveries.

**Happy Hunting!**

{{< subscribe >}}

