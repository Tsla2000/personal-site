---
image: /images/claude-duet/cover.jpg
title: "Anthropic's Claude Duet Is an Official AI Butler App — Isn't That the Muse and GrokBot I've Been Using All Along?"
description: "Anthropic's proactive AI assistant Claude Duet: a morning brief, scheduled check-ins, and approval before it acts. Compared side by side with Meta Muse and OpenAI Dots, and with the self-built assistant I have run for months."
keywords: "Claude Duet, AI assistant, AI butler, Anthropic, proactive AI, Claude, OpenAI Dots, Meta Muse"
date: 2026-10-22
category: AI
tags: [AI, Claude, Anthropic, AI assistant, Agent]
draft: false
faq:
  - q: What is Claude Duet?
    a: A proactive AI assistant released by Anthropic as a research preview. It rolls up information across your connected apps, checks your accounts on a schedule, and messages you when something needs your attention. Tasks run in the cloud, so they keep going even when your phone or computer is off.
  - q: Who can use Claude Duet, and what does it cost?
    a: It is rolling out first to Claude Pro and Max subscribers in the US, through a waitlist. There is no separate charge, but the morning brief, check-ins and other background tasks draw on your existing subscription usage. Team and Enterprise plans are not included yet.
  - q: Will Claude Duet spend money or send messages on its own?
    a: Sending messages, paying, signing documents and deleting content all require your approval first, and buying securities or moving money between accounts is prohibited outright. Payments also pass through their own confirmation flow. Approval gates do not remove all risk, though, so you still need to review the task and the scope of access you grant.
  - q: How does Claude Duet differ from OpenAI Dots and Meta Muse?
    a: All three are proactive assistants that spot problems and act across apps. They differ in entry point, connector ecosystem, background-task design, approval rules and pricing. Duet stresses business-app connections and fixed approval gates; Dots builds on ChatGPT and office tools; Muse distributes through Meta's messaging products.
  - q: Can users in China use Claude Duet?
    a: There is no announced timeline for mainland China. In the meantime, it is worth organizing your recurring tasks, the triggers worth a notification, and your approval rules, so you know what you would hand to an AI and what you would always decide yourself.
---

# Anthropic's Claude Duet Is an Official AI Butler App — Isn't That the Muse and GrokBot I've Been Using All Along?

<div class="meta-line">2026.10.22 · AI · 15 min read</div>

<div class="article-cover">

![Claude Duet: the AI butler is here](/images/claude-duet/cover.jpg)

*Claude Duet — it spots the work, prepares a plan, then waits for your call.*

</div>

I have not used Claude Duet yet.

For now, it is open only to Pro and Max subscribers in the US. You join a waitlist, and when your turn comes, you get an email.

This article is based on Anthropic's launch post, the Duet product page, and reporting from six tech outlets. I cross-checked the claims one by one.

For the past few months, I have run a personal assistant built on Muse to handle everyday work. Reading the Duet launch materials, I noticed something interesting: the four lines Anthropic uses to introduce Duet are, almost exactly, my daily routine for the past few months.

AI is shifting from "waiting for your question" to "spotting problems on its own, preparing to act, then waiting for your decision."

That may be the most important direction in this round of AI products.

## What is Claude Duet?

At 3:09 a.m. Beijing time on October 22, Anthropic posted the research preview of Claude Duet on X.

The launch post is short. Its core is four capabilities:

It reaches out to you and tells you what needs handling.

Tasks you hand it, it carries out.

After you walk away, it keeps working.

Before it acts outward, it asks for your consent.

Behind those four lines sit four product design choices. Reaching out first is about attention. Working while you are away is about execution time. Taking the task off your hands is about execution cost. Asking before acting is about the boundary of authorization.

Duet is a standalone AI assistant product, on iOS, Android and claude.ai, designed around Claude Opus 5.5.

The official demo video runs about ninety seconds, and it reveals a lot.

On screen is a phone, with an interface that looks like an ordinary chat app. At the top, instead of an empty box waiting for your question, there are task cards Claude pushed to you. At the bottom is an input field that reads "Reply to Claude."

One card proposes a concrete task: build a sales dashboard for your business from the latest data.

Notice that detail.

It does not wait for you to say "make me a sales dashboard." It spots a potentially valuable action first, then puts the proposal in front of you. Your job is to decide whether it runs.

Older software waited for you to operate it. Chatbots waited for you to ask. This kind of assistant starts proposing actions on its own.

Between "taking requests" and "making proposals" lies an entire change in how products are interacted with.

Anthropic's target users are equally clear: professionals and small business owners, especially people with too much on their plate to watch everything themselves.

So Duet does not add another standalone Q&A box. You hand it tasks by text or voice, the way you would message a colleague, and everything stays in one continuous conversation thread.

More importantly, it inherits the memory, skills and connected apps you have built up in Claude. You do not have to introduce yourself from scratch, or reconfigure your working habits.

## How does it spend its day?

Duet's rhythm is simple: a brief in the morning, scheduled check-ins during the day, and a message only when something turns up.

Every morning, it rolls up your connected apps and lays out what deserves your attention that day. It does the checking; you just read the conclusions.

During the day, it checks your connected accounts every few hours. It messages you only when it finds something that needs you. When nothing matters, it stays silent.

Why not check in real time?

Anthropic's explanation is blunt: frequent check-ins burn through your subscription allowance faster.

There is a cost here that is easy to miss. Duet's briefs, check-ins and other background tasks all count against your existing Claude subscription usage. There is no separate fee, but the more background work runs, the less allowance remains for everyday conversation.

Where tasks run matters just as much.

Duet has its own cloud virtual machine and a separate browser. Tasks run in the cloud, so turning off your phone or computer does not interrupt them.

It notifies you when a task finishes, or when it reaches a step that needs your decision.

I have used this exact mechanism for months.

Every morning, my personal assistant rolls up the open items across my main chat and side chats, plus the status of my scheduled jobs. During US market hours, it checks the handful of stocks I watch once an hour; if none has moved more than 5%, it does not disturb me.

My website's traffic, top pages and trends arrive as a daily report, at 8:30 every morning.

The logic underneath is the same: scheduled summaries, threshold triggers, silence when there is nothing.

I also have an automatic posting job for my X account. Every evening at nine, my assistant prepares a topic and a draft. I confirm it in the main chat, or tweak a few words, and it publishes.

Of course, a self-built assistant is unreliable at times.

I once had it patrol my comment section, and it hit the platform's login wall four evenings in a row, until I had to pause the job.

Duet cannot dodge these problems either. It reaches external accounts through connectors; authorizations expire, platforms change their rules, and risk systems can block actions. If any link in that chain breaks, the task stops.

The difference is that a commercial product has a team maintaining it. When a self-built system breaks, you debug and fix it yourself.

A proactive assistant's value is not just how much it can do. It is whether it can keep finishing the work, reliably, over the long run.

## What can it actually do for you?

The range is wide. At the simple end: scheduling meetings, tidying email, following up with customers. At the complex end: pulling multiple tools together to build dashboards, run financial and sales forecasts, prototype, even develop a web app.

Its other advantage is access to the 6,000-plus connectors and plug-ins in the Claude Marketplace.

Anthropic's published use cases center on the daily operations of small businesses.

| Scenario | What Duet can do |
|---|---|
| Accounts receivable | Find unpaid invoices in QuickBooks or Stripe and draft payment reminders |
| Payroll | Organize hours, bonuses and expenses in Gusto and prepare payroll |
| Customer follow-up | Read contacts and deals in HubSpot and draft follow-up emails |
| Contract signing | Start a signing flow in DocuSign and wait for the other side to sign |
| Online store | Create and manage a store in Shopify, with design and editing skills still growing |
| Hiring | Draft LinkedIn job posts, then publish only after your edits and approval |
| Marketing | Turn one product launch into a full set of Canva social assets |
| Message handling | Surface missed messages in Gmail and Slack and help draft replies |

What these cases share is that they string together work that used to mean switching apps, copying information and filling in forms by hand.

Before, the AI wrote you an email, and you still had to open your mailbox, find the contact, paste the text and click send yourself.

Now, ideally, the AI chains those steps together, and you decide only at the key points.

Payments, though, are where Duet gets visibly more careful.

Business purchasing runs through Stripe's Link wallet. Duet shows you what it is about to buy and waits for your confirmation; the purchase then passes Link's spending approval and is paid with a virtual card, so your real card number never reaches the merchant.

Personal shopping checks out through Shopify's Shop Pay, again with your approval.

Anthropic also plans a further capability: once authorized, Duet will be able to use logins stored in 1Password to sign in to websites and handle tasks for you.

Put together, the order of rollout is clear: read information first, then prepare and execute tasks, and only then, cautiously, open up anything involving money.

AI has been able to process information for you for a long time. Whether it can safely act for you is the threshold assistant products actually have to cross.

## How does it ask before it acts?

This is the part I care about most.

Duet can read information, draft content and prepare tasks on its own. But four kinds of action must stop, show you exactly what is about to happen, and wait for your approval:

* Sending a message
* Paying
* Signing a document
* Deleting content

Two more are banned outright: buying and selling securities, and moving money between accounts. Even if you ask, it will not do them.

On the security side, Anthropic built a dedicated classifier that checks messages before they are sent.

For highly sensitive data such as card numbers and government ID numbers, the system is designed to block unauthorized sending. Health and personal finance information requires your explicit instruction before it goes out.

Duet never reads your passwords directly either. It follows the credential design of Claude Managed Agents, so login tokens are never exposed to the model itself.

Every action also passes Anthropic's automatic-mode classifier before it runs. The same safeguard runs on claude.ai and Claude Code, and its job is to stop actions the user never asked for.

Before launch, Duet went through internal red-teaming and external penetration testing, and it joined HackerOne's public bug bounty program.

One more design point matters: app authorizations can be revoked at any time. You can disconnect any connected app and take back the assistant's access to that account.

It sounds ordinary, but it decides whether users dare hand their accounts to an AI at all.

Permission you can take back at any time is permission you can grant with confidence.

The reason this safety list feels familiar is that I set similar rules for my own assistant: ask before spending money, ask before messaging a real person, ask before deleting anything, ask before filling in real identity information.

These rules were not designed up front. They formed gradually, over months of actual use.

Now Anthropic has written similar constraints into its product.

That is no surprise. The more authority an assistant has, the higher the cost of a mistake. It needs clear boundaries before it can earn trust step by step.

Trust is not built on promises. It is built on a braking mechanism that works.

## What do the first users say?

Anthropic's own employees were the first users.

Boris Cherny, who leads the Claude Code team, tells Duet the to-dos circling in his head while he is out on a walk, and lets it handle them.

Chelsea Larsson, who works on model and product behavior, hands Duet her to-do list before spending the evening with her kids, then reads the summary when she comes back.

Karan Ahuja, who leads the Duet team, uses it to schedule user interviews, build prototypes and write code.

The small business cases show the value better, because their daily work is usually more fragmented.

Jess Provencher, who runs the real estate firm Pro Homes, says Duet once caught a showing appointment in her calendar with the wrong date — and nobody had asked it to check.

Amin Ebrahimi, whose South Florida restaurant business employs about 110 people, uses it for bookkeeping, customer service and marketing, and reconciles invoices store by store.

Brand strategist Mya Dalton received a brief prepared for a client call. Duet also noticed the meeting sat right up against her flight, and asked whether she wanted to move it.

What stands out in these cases is not how much content the AI generated. It is that it noticed problems the users themselves had missed.

A wrong date, a meeting you might not make, an invoice that could slip through. Each is small on its own, but together they are exactly the things that drain your energy every day.

Chatbots compete on who answers better. Assistants compete on who keeps track of how things are progressing, and reminds you at the right moment.

These are, of course, early cases published by Anthropic. They show the product's intended direction, but they do not yet prove it can stay this reliable over the long term.

## Is it late? Three proactive assistants, side by side

First, the timeline.

Meta's Muse launched on September 8. OpenAI's Dots launched on September 29. Claude Duet arrived on October 21.

Three products in about six weeks means the proactive AI assistant has become a direction every major lab is exploring at once.

Why now?

My read is that two conditions are maturing at the same time.

The first is model capability. An assistant has to run multi-step work without anyone watching, and judge when to continue, when to stop, and when to ask for help. That demands far more reliability than ordinary Q&A.

The second is the connector ecosystem. How many apps an assistant can reach decides how much work it can actually finish for you. Claude talks about more than 6,000 connectors; OpenAI has announced more than 4,000. Without that layer, even a smart model can only offer advice.

Here is what the public materials show, side by side.

| Dimension | Meta Muse | OpenAI Dots | Claude Duet |
|---|---|---|---|
| Launch | Sep 8, 2026 | Sep 29, 2026 | Oct 21, 2026 |
| Base model | Muse Spark | GPT-6 Astra | Claude Opus 5.5 |
| Entry points | App, WhatsApp | ChatGPT, Slack, Teams | Standalone app, claude.ai |
| Connectors | No unified total published; business tools like Shopify being added | 4,000+ | 6,000+ |
| Background work | Secure cloud environment, external access screened | Background research mostly read-only, permissions limited | Cloud-based, scheduled check-ins, speaks up only when needed |
| Approvals | Sensitive actions approved first; some can be set to always allow | User rules plus automatic pre-review | Four action types always need approval; two are banned outright |
| Visibility | Audit records provided | Activity View: watch, redirect or stop a task | Task progress and records visible; no full live browser view yet |
| Pricing | Free tier plus paid subscriptions | High-priced plans | Included in Pro and Max, drawing on shared usage |

Two differences deserve a closer look: the approval design, and the entry point.

Start with approvals.

I had assumed Duet's forced approval for sensitive actions was its most distinctive choice. After checking the materials, all three converged on the same pattern: gather information in the background, ask before sensitive actions, and let user or system rules draw the execution boundary.

The difference is who decides how far the leash can be loosened.

Muse lets users set "always allow" for some actions, handing part of the control to the user.

Dots combines rules the user sets with an automatic pre-review that checks work as it runs.

Duet stresses fixed approval gates, plus two hard bans: securities trading and transfers between accounts.

Three designs, three trade-offs: flexibility, degree of automation, and safety boundaries set in advance by the product.

Now the entry point.

Muse lives in WhatsApp, close to where users already talk. Dots lives in ChatGPT and office tools, close to the workflow. Duet has its own app, plus the web.

I have long held one view: the closer an assistant sits to where users already operate, the easier the habit forms.

If you have to open a dedicated app just to learn whether the AI has something for you, that is one more threshold to cross.

Duet has to answer this question. Its capability may be strong, but whether it becomes an entry point users open every day will take time to prove.

Pricing shows the strategy differences too.

Meta has a free tier and an existing product ecosystem to distribute through. OpenAI put Dots in high-priced plans, which reflects what this background work costs to run. Anthropic folds Duet into existing subscriptions, but background tasks share the same usage pool.

On the surface, Duet costs nothing extra. In practice, you are splitting one resource between chatting and a background assistant.

All three products have shown cracks, too.

Dots stalled during its live DevDay demo. Muse was reported to have proactively flagged a utility bill that had nothing wrong with it.

Both point at the same hard problem: a proactive assistant must not only know what happened, it must judge what is worth disturbing you for.

Too few alerts, and important things slip. Too many, and users learn to ignore it.

This is not solved by simply making the model more accurate. It involves alert thresholds, user preferences and long-term behavioral feedback.

## How does it compare with my own assistant?

| Dimension | Claude Duet | My self-built assistant |
|---|---|---|
| Base | Claude Opus 5.5 | Also Claude models |
| Runtime | Anthropic's cloud VMs | A cloud VM I maintain myself |
| App connections | 6,000+ connectors in the Marketplace | Connected one by one, as needed |
| Rhythm | Morning brief, scheduled check-ins, alerts when needed | Morning rollup, hourly checks in market hours, alerts when needed |
| Approval rules | Messages, payments, signing and deletion need approval | Spending, messaging, deletion and identity info need confirmation |
| Hard limits | No securities trading, no transfers between accounts | Stops at CAPTCHAs and human-verification steps and hands back to me |
| Cost | Shares the subscription usage pool | A mix of API and subscription, managed by me |
| Getting started | Works out of the box | Built, debugged and maintained by hand |

The most interesting rows are the rhythm and the approval rules.

Two systems, built independently, ended up working the same way: check on a schedule, speak up proactively, approve the key actions, and stop at the boundaries.

That suggests proactive assistants are converging on some stable product rules.

They may become the standard kit of this product generation, the way chatbots settled into theirs: always running, pushing proactively, acting across apps, with permission controls.

Converging form does not mean equal capability, of course.

Duet's strength is its connector count and zero setup; an individual developer cannot replicate that ecosystem quickly.

A self-built assistant's strength is control: you set the rules, keep the logs the way you want, and account for costs line by line. But whether data truly stays within your control still depends on how the underlying model services, APIs and connected apps actually handle it.

For me, the biggest value of building my own is not that it is smarter than a big lab's product. It is that I decide what it should do, what it must never do, and how to trace a problem when something goes wrong.

## What does Anthropic admit it cannot do yet?

Anthropic is explicit about Duet's current limits in its launch materials.

First, it can misread a conversation thread, and misjudge how urgent something is. What deserves an instant alert and what can wait is something it still has to learn.

Second, personal errands are not its strength. Tasks like booking tickets may not go well, because it is designed for work scenarios.

Third, it cannot yet show the full live view of its cloud browser. You can see what it has done and what it is doing, and you can steer it mid-task, but you cannot yet watch the actual pages it opens and operates.

Fourth, things that happen between two check-ins may not be caught in time. Checking every few hours means there is always a blind window in between.

Fifth, Duet is a separate product from the main Claude app for now. Whether they merge will depend on early user feedback, Anthropic says.

Sixth, more of the security design is still to be published. What is public today is not enough to fully evaluate its safety mechanisms.

The third one matters most to me: if you cannot see the process, small errors that never trigger an approval gate are hard to catch in time.

Suppose the AI slightly misunderstands what a client asked for, or marks something unimportant as urgent. Errors like these trip no safety check. By the time you see the final result, the problem may already have happened.

The three products lean differently here: Dots offers Activity View, to watch, redirect and stop tasks; Muse offers audit records, to trace afterwards; Duet offers task progress and records, but not the full browser view yet.

These three capabilities solve different problems.

Up-front approval controls risk. Execution records enable tracing. Live visibility helps you correct course in time. None of them substitutes for the others.

My own assistant keeps its operation records in my own system, so I can trace any task step by step. That gives me more confidence in its behavior, but I also carry the burden of log maintenance, permission management and security myself.

In the end, commercial product versus self-built system is a trade-off: one lowers the cost of getting started, the other gives you more room to customize.

## Who can use it? What does it cost?

For now, Claude Duet is open only to Claude Pro and Max subscribers in the US.

You join the waitlist, seats are released in batches, and when yours comes up you get an email. The application form even has an open question: what is the first thing you plan to hand to Duet?

That question is worth more than it looks.

If you cannot name one concrete, repetitive, time-consuming task, then even with access, you may not get much out of the product.

Team and Enterprise plans are out of scope for now, though Anthropic says it will consider expanding later.

On price: Duet has no separate charge, but its briefs, check-ins and background tasks all draw on your existing subscription usage.

So the real question is not whether there is an extra fee. It is how much of the allowance you would have spent on conversation and other work the background tasks take up.

The three products' pricing maps to three business logics.

Meta can use a free tier to widen distribution. OpenAI prices Dots into expensive plans, which directly reflects the compute cost of background work. Anthropic folds the background consumption into the subscription you already have.

My view: users will pay to remove chores and save time, but not necessarily for a pile of fruitless check-ins.

If an assistant checks dozens of times a day and finds nothing worth handling, users will struggle to feel the value, no matter how much allowance those checks consumed.

So in the long run, the business model for proactive assistants has to track delivered value more closely. A flat monthly fee, tiered allowances, or plans designed around specific workflows may all be easier for users to make sense of than raw background-call volume.

That is only my judgment. The answer depends on real usage frequency, task success rates and willingness to pay.

For users in mainland China, there is no announced timeline yet. The more useful move right now is to get your own workflows in order first.

## What should you do now?

If you already have an eligible US Pro or Max subscription, join the waitlist. When access arrives, start with low-risk apps like email and calendar, get the brief and the check-ins running, and only then consider higher-risk permissions like payments and signing.

If you cannot use Duet yet, there are three things you can do first.

First, build a morning brief.

Spend ten minutes each morning rolling up the to-dos scattered across your apps, and decide which ones truly matter. You may find that the things most worth doing today are only two or three.

That is the brief's value: it turns time spent gathering information into time spent solving problems.

Second, build a check-in list.

Write down exactly which changes are worth an alert from your assistant.

For example: an email from an important client, an anomaly in an account, a business metric dropping below a threshold you set, or a task that has stalled for too long.

The clearer the trigger, the more reliably an assistant can act on it. If you cannot say what is worth watching, you cannot expect an AI to judge it for you.

Third, build an approval list.

Decide in advance what an assistant may finish on its own, and what it must always ask you about first.

For instance: whether ordinary work messages need confirmation, above what amount spending requires approval, which files must never be deleted, and which identity information it may never fill in on its own.

This list is the working agreement between you and your assistant. It defines both what the assistant can do and how much you are willing to hand over.

When Duet, or a product like it, opens up to you, you can turn these rules straight into configuration.

Without clear workflows and permission boundaries, even a powerful model will struggle to work for you reliably.

From here, I will watch three signals.

First, the security details Anthropic publishes next — especially how it defends against prompt injection, and how connector authorizations can be revoked.

Second, how Duet merges with the main Claude app. Whether a standalone app can become the main entrance to a user's workday is still unproven.

Third, visibility into the browser's execution. If you can watch page operations live and correct mistakes as they happen, users will trust it with more complex work.

Until that lands, I will not hand Duet anything that touches important business and walk away.

## The end

For the past two years, using AI has mostly meant opening a chat box, asking a question, waiting for an answer, then closing the page.

But people open their phones dozens of times a day, and what they see first is usually a list of messages.

That is the spot proactive assistants are competing for.

They want to change the order: no longer does the user start every interaction. The AI spots the problem first, proposes a course of action, and the user decides whether it runs.

Anthropic is the last of the three to ship this kind of product, but the direction is now clear: AI must not only answer questions, it must keep working; not only execute, but know when to stop and ask for consent.

The competition ahead is about more than model capability, tool ecosystems and execution speed. It comes down to a practical question: who can make users comfortable handing their work over?

My assistant will still patrol tonight, and still send its rollup tomorrow morning. It has no big product team behind it, and no 6,000 ready-made connectors.

But it has already let me experience, ahead of time, how a proactive assistant works.

What is worth watching next is not who shipped first. It is who makes it reliable enough that users genuinely want to keep using it.

The next thing you pin to the top of your phone may not be a chat window at all. It may be an assistant, ready to handle things for you.

---

## FAQ

### What is Claude Duet?

Claude Duet is a proactive AI assistant released by Anthropic as a research preview. It rolls up information across connected apps, checks your accounts on a schedule, and notifies you when something needs your attention. Tasks run in the cloud continuously, so they do not depend on your phone or computer staying on.

### Who can use Claude Duet, and what does it cost?

Based on the launch information, Duet is rolling out first to Claude Pro and Max subscribers in the US, through a waitlist. There is no separate charge, but background tasks draw on your existing subscription usage. Team and Enterprise are not open yet.

### Will Claude Duet spend money or send messages on its own?

It has mandatory approval gates for sending messages, paying, signing documents and deleting content. Buying securities and moving money between accounts are prohibited outright. Payments also pass through their own confirmation flow. Approval gates do not remove all risk, though — you still need to review the task content, the scope of access and the final result.

### How does Claude Duet differ from OpenAI Dots and Meta Muse?

All three explore assistants that proactively spot problems and act across apps. The main differences are entry point, connector ecosystem, background-task design, approval rules and pricing. Duet stresses business-app connections and fixed approval boundaries; Dots builds on the existing AI and office-tool stack; Muse can distribute through Meta's messaging product ecosystem.

### Can users in China use Claude Duet?

There is no clear timeline for mainland China yet. A good preparation is to organize your daily tasks, your alert triggers and your approval rules — decide what suits an AI and what you must always decide yourself — so you are ready when proactive assistants arrive.
