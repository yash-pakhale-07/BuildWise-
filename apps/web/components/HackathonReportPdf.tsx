import React from "react";
import { HackathonReport } from "@buildwise/shared";

interface HackathonReportPdfProps {
  report: HackathonReport;
}

export function handleDownloadPdf(report: HackathonReport) {
  // Create a temporary hidden iframe or print container to trigger pristine native PDF rendering
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to download the PDF report.");
    return;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${report.title} - Hackathon Report</title>
        <meta charset="utf-8" />
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

          @page {
            size: A4;
            margin: 20mm 15mm 20mm 15mm;
            @bottom-right {
              content: "Page " counter(page) " of " counter(pages);
              font-family: 'Inter', sans-serif;
              font-size: 9pt;
              color: #64748b;
            }
            @bottom-left {
              content: "BuildWise AI Research Platform • Generated Report";
              font-family: 'Inter', sans-serif;
              font-size: 9pt;
              color: #64748b;
            }
          }

          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            color: #0f172a;
            background-color: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 10.5pt;
            line-height: 1.6;
          }

          .page-break {
            page-break-before: always;
          }

          .avoid-break {
            page-break-inside: avoid;
          }

          /* Cover Page Styling */
          .cover-page {
            height: 90vh;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 40px;
          }

          .cover-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 20px;
          }

          .brand-badge {
            background-color: #4f46e5;
            color: #ffffff;
            font-weight: 700;
            font-size: 11pt;
            padding: 6px 14px;
            border-radius: 6px;
            letter-spacing: 0.5px;
          }

          .cover-title-container {
            margin-top: 60px;
          }

          .domain-tag {
            color: #4f46e5;
            font-weight: 700;
            font-size: 10pt;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 12px;
            display: block;
          }

          .cover-title {
            font-size: 26pt;
            font-weight: 800;
            color: #0f172a;
            line-height: 1.2;
            margin: 0 0 20px 0;
          }

          .cover-meta-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            background-color: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            margin-top: 40px;
          }

          .meta-item label {
            font-size: 8.5pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #64748b;
            display: block;
            margin-bottom: 4px;
          }

          .meta-item span {
            font-size: 11pt;
            font-weight: 700;
            color: #1e293b;
          }

          /* Section Styling */
          .section {
            margin-bottom: 28px;
          }

          .section-title {
            font-size: 14pt;
            font-weight: 800;
            color: #1e1b4b;
            border-bottom: 2px solid #e0e7ff;
            padding-bottom: 6px;
            margin-top: 24px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .section-num {
            color: #4f46e5;
          }

          .content-box {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
          }

          .key-value-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            margin-top: 10px;
          }

          .kv-card {
            background-color: #f8fafc;
            border: 1px solid #cbd5e1;
            padding: 10px 14px;
            border-radius: 6px;
          }

          .kv-card h4 {
            margin: 0 0 4px 0;
            font-size: 9pt;
            text-transform: uppercase;
            color: #4f46e5;
          }

          .kv-card p {
            margin: 0;
            font-size: 9.5pt;
            color: #334155;
          }

          /* Tables */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            margin-bottom: 16px;
            font-size: 9.5pt;
          }

          th {
            background-color: #f1f5f9;
            color: #1e293b;
            font-weight: 700;
            text-align: left;
            padding: 10px 12px;
            border: 1px solid #cbd5e1;
          }

          td {
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
          }

          tr:nth-child(even) td {
            background-color: #f8fafc;
          }

          a {
            color: #2563eb;
            text-decoration: underline;
            font-weight: 600;
          }

          .bullet-list {
            margin: 6px 0;
            padding-left: 20px;
          }

          .bullet-list li {
            margin-bottom: 4px;
          }

          /* Snapshot Card */
          .snapshot-card {
            background-color: #faf5ff;
            border: 2px solid #d8b4fe;
            border-radius: 12px;
            padding: 20px;
            margin-top: 20px;
          }

          .snapshot-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 14px;
            margin-top: 14px;
          }

          .snapshot-item {
            background: #ffffff;
            border: 1px solid #e9d5ff;
            padding: 10px 14px;
            border-radius: 8px;
          }

          .snapshot-item label {
            font-size: 8pt;
            text-transform: uppercase;
            font-weight: 700;
            color: #7e22ce;
            display: block;
          }

          .snapshot-item span {
            font-size: 10pt;
            font-weight: 700;
            color: #1e1b4b;
          }

          .footer-note {
            text-align: center;
            font-size: 8.5pt;
            color: #94a3b8;
            margin-top: 30px;
            border-top: 1px solid #e2e8f0;
            padding-top: 10px;
          }
        </style>
      </head>
      <body>
        <!-- COVER PAGE -->
        <div class="cover-page">
          <div class="cover-header">
            <div class="brand-badge">${report.coverPage.branding || "BuildWise AI Platform"}</div>
            <div style="font-size: 10pt; font-weight: 700; color: #64748b;">HACKATHON TECHNICAL REPORT</div>
          </div>

          <div class="cover-title-container">
            <span class="domain-tag">${report.domain}</span>
            <h1 class="cover-title">${report.title}</h1>
            <p style="font-size: 12pt; color: #475569; max-width: 90%;">
              A comprehensive technical specification, architecture blueprint, research synthesis, and execution roadmap generated by BuildWise AI.
            </p>
          </div>

          <div>
            <div class="cover-meta-grid">
              <div class="meta-item">
                <label>Team Name</label>
                <span>${report.teamName || "BuildWise Innovators"}</span>
              </div>
              <div class="meta-item">
                <label>Generated Date</label>
                <span>${report.generatedDate}</span>
              </div>
              <div class="meta-item">
                <label>Project Domain</label>
                <span>${report.domain}</span>
              </div>
              <div class="meta-item">
                <label>Readiness Level</label>
                <span>${report.projectSnapshot?.readiness || "Production Blueprint Ready"}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="page-break"></div>

        <!-- 1. EXECUTIVE SUMMARY -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">1.</span> Executive Summary</div>
          <div class="content-box">
            <p><strong>Project Overview:</strong> ${report.executiveSummary.overview}</p>
            <p><strong>Problem:</strong> ${report.executiveSummary.problem}</p>
            <p><strong>Proposed Solution:</strong> ${report.executiveSummary.solution}</p>
            <p><strong>Expected Outcome:</strong> ${report.executiveSummary.expectedOutcome}</p>
          </div>
        </div>

        <!-- 2. PROBLEM STATEMENT -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">2.</span> Problem Statement</div>
          <div class="content-box">
            <p><strong>Existing Problem:</strong> ${report.problemStatement.existingProblem}</p>
            <p><strong>Who Is Affected:</strong> ${report.problemStatement.whoIsAffected}</p>
            <p><strong>Current Challenges:</strong> ${report.problemStatement.currentChallenges}</p>
            <p><strong>Why Solving This Problem Matters:</strong> ${report.problemStatement.whyItMatters}</p>
          </div>
        </div>

        <!-- 3. PROPOSED SOLUTION -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">3.</span> Proposed Solution</div>
          <div class="content-box">
            <p><strong>Solution Overview:</strong> ${report.proposedSolution.overview}</p>
            <p><strong>Key Features:</strong></p>
            <ul class="bullet-list">
              ${report.proposedSolution.keyFeatures.map((f) => `<li>${f}</li>`).join("")}
            </ul>
            <div class="key-value-grid">
              <div class="kv-card">
                <h4>Innovation</h4>
                <p>${report.proposedSolution.innovation}</p>
              </div>
              <div class="kv-card">
                <h4>Unique Value Proposition</h4>
                <p>${report.proposedSolution.uniqueValueProposition}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. TECHNICAL APPROACH -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">4.</span> Technical Approach</div>
          <div class="content-box">
            <p><strong>System Architecture & Data Flow:</strong> ${report.technicalApproach.architectureOverview}</p>
            <table>
              <thead>
                <tr>
                  <th>Layer / Component</th>
                  <th>Technology Specification</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Frontend UI</td><td>${report.technicalApproach.frontend}</td></tr>
                <tr><td>Backend API</td><td>${report.technicalApproach.backend}</td></tr>
                <tr><td>Database & Persistence</td><td>${report.technicalApproach.database}</td></tr>
                <tr><td>AI Models</td><td>${report.technicalApproach.aiModels.join(", ")}</td></tr>
                <tr><td>API Services</td><td>${report.technicalApproach.apis.join(", ")}</td></tr>
                <tr><td>Deployment</td><td>${report.technicalApproach.deployment}</td></tr>
                <tr><td>Security</td><td>${report.technicalApproach.security}</td></tr>
                <tr><td>Development Workflow</td><td>${report.technicalApproach.developmentWorkflow}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="page-break"></div>

        <!-- 5. FEASIBILITY & VIABILITY -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">5.</span> Feasibility & Viability</div>
          <div class="content-box">
            <div class="key-value-grid">
              <div class="kv-card">
                <h4>Technical Feasibility</h4>
                <p>${report.feasibilityAndViability.technicalFeasibility}</p>
              </div>
              <div class="kv-card">
                <h4>Operational Feasibility</h4>
                <p>${report.feasibilityAndViability.operationalFeasibility}</p>
              </div>
              <div class="kv-card">
                <h4>Scalability</h4>
                <p>${report.feasibilityAndViability.scalability}</p>
              </div>
              <div class="kv-card">
                <h4>Cost Effectiveness</h4>
                <p>${report.feasibilityAndViability.costEffectiveness}</p>
              </div>
              <div class="kv-card">
                <h4>Sustainability</h4>
                <p>${report.feasibilityAndViability.sustainability}</p>
              </div>
              <div class="kv-card">
                <h4>Risks & Mitigation</h4>
                <p>${report.feasibilityAndViability.risksAndMitigation}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. IMPACT & BENEFITS -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">6.</span> Impact & Benefits</div>
          <div class="content-box">
            <p><strong>Target Users:</strong> ${report.impactAndBenefits.targetUsers}</p>
            <div class="key-value-grid">
              <div class="kv-card">
                <h4>Business Impact</h4>
                <p>${report.impactAndBenefits.businessImpact}</p>
              </div>
              <div class="kv-card">
                <h4>Social Impact</h4>
                <p>${report.impactAndBenefits.socialImpact}</p>
              </div>
              <div class="kv-card">
                <h4>Productivity Improvements</h4>
                <p>${report.impactAndBenefits.productivityImprovements}</p>
              </div>
              <div class="kv-card">
                <h4>Time Savings</h4>
                <p>${report.impactAndBenefits.timeSavings}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 7. RESEARCH & REFERENCES -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">7.</span> Research & References</div>
          <div class="content-box">
            <p><strong>Research Findings:</strong> ${report.researchAndReferences.findings}</p>
            <p><strong>Existing Solutions:</strong> ${report.researchAndReferences.existingSolutions}</p>
            <p><strong>Identified Research Gap:</strong> ${report.researchAndReferences.identifiedGap}</p>
            <p><strong>How This Project Addresses The Gap:</strong> ${report.researchAndReferences.howProjectAddressesGap}</p>

            <h4 style="margin-top: 16px; color: #1e1b4b;">Verified IEEE & Academic References Table</h4>
            <table>
              <thead>
                <tr>
                  <th style="width: 30%;">Paper / Article Title</th>
                  <th style="width: 20%;">Authors & Year</th>
                  <th style="width: 15%;">Source</th>
                  <th style="width: 35%;">Summary & Direct Link</th>
                </tr>
              </thead>
              <tbody>
                ${report.researchAndReferences.references
                  .map(
                    (ref) => `
                  <tr>
                    <td><strong>${ref.title}</strong></td>
                    <td>${ref.authors?.join(", ") || "N/A"}<br/><small>(${ref.year || "2024"})</small></td>
                    <td><span style="font-weight: 700; color: #4f46e5;">${ref.source}</span></td>
                    <td>
                      ${ref.summary}<br/>
                      <a href="${ref.url}" target="_blank" rel="noreferrer">🔗 View Direct Source Link</a>
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </div>

        <div class="page-break"></div>

        <!-- 8. FUTURE SCOPE -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">8.</span> Future Scope</div>
          <div class="content-box">
            <div class="key-value-grid">
              <div class="kv-card">
                <h4>Future Improvements</h4>
                <p>${report.futureScope.futureImprovements}</p>
              </div>
              <div class="kv-card">
                <h4>AI Enhancements</h4>
                <p>${report.futureScope.aiEnhancements}</p>
              </div>
              <div class="kv-card">
                <h4>Mobile Application</h4>
                <p>${report.futureScope.mobileApplication}</p>
              </div>
              <div class="kv-card">
                <h4>Cloud Deployment</h4>
                <p>${report.futureScope.cloudDeployment}</p>
              </div>
              <div class="kv-card">
                <h4>Commercialization</h4>
                <p>${report.futureScope.commercialization}</p>
              </div>
              <div class="kv-card">
                <h4>Scalability Horizon</h4>
                <p>${report.futureScope.scalability}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. CONCLUSION -->
        <div class="section avoid-break">
          <div class="section-title"><span class="section-num">9.</span> Conclusion</div>
          <div class="content-box">
            <p><strong>Summary:</strong> ${report.conclusion.summary}</p>
            <p><strong>Problem-Solution Fit:</strong> ${report.conclusion.problem} → ${report.conclusion.solution}</p>
            <p><strong>Expected Impact & Long-Term Vision:</strong> ${report.conclusion.expectedImpact} ${report.conclusion.longTermVision}</p>
          </div>
        </div>

        <!-- PROJECT SNAPSHOT PAGE -->
        <div class="page-break"></div>
        <div class="snapshot-card avoid-break">
          <h2 style="margin: 0 0 6px 0; color: #581c87; font-size: 16pt; font-weight: 800;">✓ Project Technical Snapshot</h2>
          <p style="margin: 0; color: #6b21a8; font-size: 9.5pt;">One-page executive readiness overview generated by BuildWise AI Platform.</p>

          <div class="snapshot-grid">
            <div class="snapshot-item">
              <label>Project Readiness</label>
              <span>${report.projectSnapshot.readiness}</span>
            </div>
            <div class="snapshot-item">
              <label>Estimated Timeline</label>
              <span>${report.projectSnapshot.estimatedTimeline}</span>
            </div>
            <div class="snapshot-item">
              <label>Innovation Level</label>
              <span>${report.projectSnapshot.innovationLevel}</span>
            </div>
            <div class="snapshot-item">
              <label>Feasibility Rating</label>
              <span>${report.projectSnapshot.feasibilityRating}</span>
            </div>
            <div class="snapshot-item">
              <label>Scalability Rating</label>
              <span>${report.projectSnapshot.scalabilityRating}</span>
            </div>
            <div class="snapshot-item">
              <label>Research Sources Count</label>
              <span>${report.projectSnapshot.researchSourcesCount} Verified References</span>
            </div>
          </div>

          <div style="margin-top: 16px; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e9d5ff;">
            <label style="font-size: 8pt; text-transform: uppercase; font-weight: 700; color: #7e22ce;">Technology Stack Summary</label>
            <p style="margin: 4px 0 0 0; font-size: 9.5pt; font-weight: 600; color: #1e1b4b;">${report.projectSnapshot.techStackSummary}</p>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e9d5ff;">
              <label style="font-size: 8pt; text-transform: uppercase; font-weight: 700; color: #7e22ce;">AI Models Used</label>
              <ul class="bullet-list" style="margin: 4px 0 0 0; font-size: 9pt; color: #334155;">
                ${report.projectSnapshot.aiModelsUsed.map((m) => `<li>${m}</li>`).join("")}
              </ul>
            </div>
            <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e9d5ff;">
              <label style="font-size: 8pt; text-transform: uppercase; font-weight: 700; color: #7e22ce;">APIs & Gateway Integration</label>
              <ul class="bullet-list" style="margin: 4px 0 0 0; font-size: 9pt; color: #334155;">
                ${report.projectSnapshot.apisUsed.map((a) => `<li>${a}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>

        <div class="footer-note">
          Report generated automatically on ${report.generatedDate} via BuildWise AI Research & Innovation Platform.
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 400);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
