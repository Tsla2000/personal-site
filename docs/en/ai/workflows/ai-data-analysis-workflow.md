---
title: AI Data Analysis Workflow: From Raw Data to Verifiable Decisions
description: A reliable AI-assisted data analysis workflow covering data quality, metric definitions, reproducible calculations, anomaly interpretation, uncertainty, and report handoff.
date: 2026-10-19
keywords: AI data analysis, data analysis workflow, CSV analysis, data quality checks, decision report
aside: false
---

# AI Data Analysis Workflow: From Raw Data to Verifiable Decisions

Asking AI to summarize a spreadsheet is easy. The hard part is ensuring conclusions come from the data, calculations can be reproduced, and correlation is not presented as causation. A useful analysis skill turns raw data into auditable evidence and decisions—not just a polished-looking report.

This workflow applies to CSV files, spreadsheets, product analytics, and operating reports. For sensitive data, confirm authorization and the processing environment before uploading anything to a third-party model.

## 1. Check data quality first

Record the source, time range, field definitions, row count, duplicates, missing values, outliers, and units. Check date formats, time zones, currency units, and unique keys so data defects are not mistaken for business changes.

If a field is ambiguous, ask for its definition instead of guessing what “conversion,” “active user,” or “revenue” means.

## 2. Define the question and metrics

Translate the business question into measurable metrics with explicit numerators, denominators, time windows, and filters. “Conversion dropped” is incomplete unless it specifies which funnel step, user segment, period, and denominator are being measured.

Write the analysis plan before looking for results to reduce the temptation to select only favorable metrics afterward.

## 3. Calculate with deterministic tools

Prefer SQL, Python, spreadsheet formulas, or other reproducible tools for counts, ratios, segments, and time series. Let the model help write code, explain anomalies, and organize findings—but do not treat mental arithmetic from a model as data evidence.

Keep calculation logic, input ranges, and useful intermediate results for important figures.

## 4. Separate facts, interpretations, and recommendations

Organize the report into three layers:

- **Observed facts:** what the data directly shows.
- **Possible explanations:** mechanisms that may explain the change, including alternatives.
- **Recommended actions:** what to do and which metric would validate the outcome.

Without an experiment or sufficient evidence, do not turn sequence into causation. Small samples, changed definitions, and missing data should be stated as limitations.

## 5. Deliver auditable artifacts

A useful handoff includes data-cleaning notes, metric definitions, scripts or queries, core tables, a concise findings summary, limitations, and a plan for the next validation step. Charts should answer a question rather than merely decorate the report.

## Analysis brief template

```text
Business question:
Data source and authorization:
Analysis period:
Field definitions and metric rules:
Data quality checks:
Planned calculation method:
Required tables or charts:
How facts and recommendations will be separated:
Limitations and hypotheses to validate:
Required deliverable format:
```

## How to evaluate analysis quality

Can important numbers be reproduced from the source data and calculations? Are metric definitions consistent across periods? Does the report acknowledge uncertainty? Can the recommendation be tested with a follow-up metric? If not, fluent writing alone does not make the report decision-ready.

Start with the [data analysis and decisions skill](../../skills/data-analysis) to make these checks repeatable. For larger work, use the [AI project delivery workflow](./ai-project-delivery-workflow) to manage implementation and acceptance.
