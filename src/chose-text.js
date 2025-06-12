document.getElementById("ownParagraphe").addEventListener("click", () => {
    console.log("clicked");
    window.location.href = "./write-your-text.html";
});

document.getElementById("backArrow").addEventListener("click", () => {
  window.location.href = "./main-menu.html";
});

const randomTexts = [
  "In accordance with the provisions stipulated under Section 17B of the Municipal Oversight Act, prior notification must be effected before occupancy alteration procedures may commence.",
  "All residents are hereby advised that failure to comply with the aforementioned regulations may result in administrative repercussions subject to procedural enforcement.",
  "Your eligibility for continued participation in the subsidized waste collection initiative is contingent upon quarterly compliance verification, effective immediately.",
  "The undersigned acknowledges receipt of documentation relevant to the herein referenced procedural matter under subsection 3.4 of the administrative code.",
  "Beneficiaries must, without exception, fulfill all documentation requirements as delineated in the annexed procedural addendum.",
  "Applicants intending to engage in commercial operations within designated municipal zones are required to submit a formal declaration of intent, accompanied by all requisite ancillary documentation, to the Economic Development Office no less than 30 calendar days prior to the anticipated initiation of such activities.",
  "In order to maintain alignment with interdepartmental fiscal reporting protocols, all budgetary submissions are to be formatted according to the Financial Oversight Template (v.2024.2) and uploaded via the secure portal no later than 17:00 CET on the final working day of Q3.",
  "Due to unforeseen infrastructural maintenance, all water utility clients situated within zones 4A through 6C should anticipate intermittent service disruptions throughout the aforementioned period, and are advised to implement provisional mitigation strategies accordingly.",
  "Pursuant to the Integrated Waste Management Directive, the improper disposal of categorized recyclable materials may lead to the imposition of corrective measures, including but not limited to monetary penalties, community service obligations, and temporary suspension of waste collection privileges.",
  "The procedure for applying for parental leave benefits requires completion of the digitally-verified PLB-09 Form, to be co-signed by the employer, submitted via the eServices Portal, and confirmed through dual-factor authentication, within a timeframe not exceeding 14 working days post-employment change notification.",
  "All individuals seeking to initiate property boundary reassessment must first obtain written consent from all adjacent landholders, submit a topographic survey conducted by a certified geospatial analyst, and complete Form B-LR17 with the Land Use and Infrastructure Department. Failure to adhere strictly to this multi-phase process will result in automatic rejection of the application without further notice or right to appeal. Once received, the application will undergo preliminary administrative screening before being passed on to the cadastral verification committee for formal review and site inspection scheduling.",
  "This communication serves as official notification of the upcoming public consultation process concerning the Revised Urban Transit Infrastructure Plan (RUTIP-2025). All stakeholders, including private citizens, nonprofit representatives, and corporate entities, are encouraged to submit formal commentary via the Consultation Feedback Interface between May 10 and June 15. Submissions should be no longer than 1,200 words, adhere to civil tone guidelines, and reference specific subsections of the RUTIP documentation where applicable. Anonymous feedback will not be considered.",
  "In the context of fiscal accountability and inter-agency transparency, departmental leads are hereby mandated to submit quarterly procurement audits reflecting all expenditures exceeding €500, inclusive of VAT, by the 10th day of the month following quarter closure. Audit documentation must conform to the Unified Procurement Ledger Template and be verified by an authorized cost control officer prior to submission.",
  "Citizens engaged in the pursuit of legal name alterations must first initiate a background verification process with the Department of Citizen Identity, followed by notarized affirmation of intent to amend personal data records. Upon successful verification, a certified declaration of change must be filed alongside a biometric renewal request with the Central Registry of Population Services.",
  "Failure to comply with the environmental containment standards as set forth in subsection 9.4 of the Regional Hazardous Materials Ordinance shall be grounds for the issuance of a formal compliance notice, followed by an environmental impact audit. This may, where applicable, trigger liability under both local and federal remediation policies.",
  "We kindly ask you to refrain from engaging in unsolicited utilization of the parking allocation units beyond their designated temporal allotment as defined by the Guidelines on Vehicular Resource Distribution (GV-RD 2022).",
  "The administrative issuance of non-essential verification codes shall remain suspended until such time as procedural harmonization has been achieved across interdepartmental authentication streams.",
  "The undersigned applicant must ensure the appropriate deployment of authentication credentials when interacting with the secure digital administration interface, particularly when submitting asynchronous feedback concerning service inconsistencies.",
  "We are currently undergoing a realignment of the participatory infrastructure review mechanism, which may result in temporal shifts to stakeholder engagement protocols and thematic input loops.",
  "Please be informed that the submission of physical documents without corresponding eConfirmation receipts will be rendered procedurally incomplete and therefore remain unprocessed within the active administrative cycle."
];

document.getElementById("pickForMe").addEventListener("click", () => {
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  const pickedText = randomTexts[randomIndex];
  sessionStorage.setItem("pickedText", pickedText);
  window.location.href = "./write-your-text.html";
});

