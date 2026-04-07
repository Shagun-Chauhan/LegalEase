// Real Indian Legal Templates (Master Base: English)
// We avoid AI hallucinations by relying on fixed strings mapping to forms.

const getSenderBlock = (f) => [f.yourName || 'Client Name', f.yourEmail && `Email: ${f.yourEmail}`, f.yourAddress || 'Client Address'].filter(Boolean).join('\\n');
const getRecipientBlock = (f) => [f.opponentName || 'Recipient Name', f.opponentEmail && `Email: ${f.opponentEmail}`, f.opponentAddress || 'Recipient Address'].filter(Boolean).join('\\n');
const getToday = () => new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });

const templates = {
  legal_notice: (f) => `LEGAL NOTICE
Under Section 80 CPC / As Applicable

Date: ${getToday()}

FROM:
${getSenderBlock(f)}

TO:
${getRecipientBlock(f)}

SUBJECT: Legal Notice for ${f.issueType || 'Dispute'} — Demand for Immediate Redressal

Sir / Madam,

UNDER INSTRUCTIONS AND ON BEHALF OF my client, ${f.yourName || 'Client'}, residing at ${f.yourAddress || 'Address'} (hereinafter referred to as the "Complainant"), I hereby serve upon you this Legal Notice in the matter described herein:

1. BACKGROUND & FACTS:
${f.description || 'Facts of the case...'}

2. LEGAL PROVISIONS INVOKED:
The aforementioned acts constitute violations of applicable laws including but not limited to the Indian Penal Code, 1860 and relevant statutes.

3. DEMAND:
In view of the above, my client hereby demands that you:
(a) ${f.reliefSought || 'Provide full compensation and cease unlawful acts immediately.'}
(b) Provide a written acknowledgment of this notice within 15 days of receipt.

If you fail to comply with this notice within 15 days, my client will be compelled to initiate civil and/or criminal proceedings against you in a competent court of law at your entire cost and peril.

Yours faithfully,

_______________________
${f.yourName || 'Client Name'}
Date: ${getToday()}
`,

  complaint: (f) => `FORMAL COMPLAINT
Date: ${getToday()}

TO:
The Relevant Authority / ${f.opponentName || 'Authority Name'}
${f.opponentAddress || 'Address'}

FROM:
${getSenderBlock(f)}

SUBJECT: Formal Complaint regarding ${f.issueType || 'Dispute'}

Respected Sir / Madam,

I, ${f.yourName || 'Complainant'}, am writing to formally lodge a complaint regarding the following incident(s) that took place on or about ${f.incidentDate || 'the specified date'}.

1. PARTICULARS OF THE INCIDENT:
${f.description || 'Facts of the incident...'}

2. RELIEF / ACTION REQUESTED:
To resolve this issue, I request the following action be taken:
${f.reliefSought || 'Appropriate action and investigation.'}

I have attached copies of the relevant documents supporting this complaint (if any). I kindly request you to look into this matter urgently and ensure that justice is served.

Thanking you,

Yours sincerely,

_______________________
${f.yourName || 'Client Name'}
Date: ${getToday()}
`,

  demand: (f) => `DEMAND NOTICE
Date: ${getToday()}

FROM:
${getSenderBlock(f)}

TO:
${getRecipientBlock(f)}

SUBJECT: Demand Notice regarding ${f.issueType || 'Outstanding Dues / Breach'}

Sir / Madam,

This notice is formally served to you regarding your failure to fulfill the obligations under our mutual agreement.

1. STATEMENT OF FACTS:
${f.description || '[Insert description of how the breach occurred and what is owed]'}

2. DEMAND:
You are hereby called upon to immediately:
${f.reliefSought || '[Insert specific demand, e.g., pay the outstanding amount]'}

Please treat this notice as a final demand. Failure to fulfill the above demand within a reasonable timeframe (not exceeding 15 days from the date of this letter) will result in appropriate legal recovery proceedings.

Yours faithfully,

_______________________
${f.yourName || 'Name'}
`,

  noc: (f) => `NO OBJECTION CERTIFICATE (NOC)

Date: ${getToday()}

TO WHOMSOEVER IT MAY CONCERN

This is to certify that I, ${f.yourName || '[Name]'}, residing at ${f.yourAddress || '[Address]'}, do hereby declare that I have NO OBJECTION regarding the matter of ${f.issueType || '[Issue]'}.

DETAILS OF THE MATTER:
${f.description || '[Describe the entity, person, or property for which NOC is being issued]'}

I issue this No Objection Certificate willfully, without any coercion, and in sound mind. 

Signature:

_______________________
${f.yourName || 'Name'}
Date: ${getToday()}
`,

  affidavit: (f) => `AFFIDAVIT

I, ${f.yourName || '[Name]'}, residing at ${f.yourAddress || '[Address]'}, do hereby solemnly affirm and declare as follows:

1. That I am a citizen of India and am competent to swear this affidavit.
2. That the following facts are true to the best of my knowledge and belief:
${f.description || '[Insert facts to be affirmed]'}

3. That I am executing this affidavit to attest to the truth of the aforementioned facts in relation to ${f.issueType || '[Matter]'}.

VERIFICATION
Verified at ____________ on this ${getToday()} that the contents of paragraphs 1 to 3 of this affidavit are true and correct to the best of my knowledge and belief, and nothing material has been concealed therefrom.

DEPONENT:

_______________________
${f.yourName || 'Name'}
`,

  agreement: (f) => `RENTAL / LEASE AGREEMENT

This Agreement is made on this ${getToday()}, between:

LANDLORD / FIRST PARTY:
${getSenderBlock(f)}

AND

TENANT / SECOND PARTY:
${getRecipientBlock(f)}

WHEREAS the First Party is the lawful owner of the premises located at ${f.yourAddress || '[Premises Address]'}, and the Second Party has approached the First Party to let out the said premises on rent.

NOW THIS AGREEMENT WITNESSETH AS UNDER:
1. The tenancy shall commence from ${f.incidentDate || '[Date]'} and is valid for a standard period of 11 months.
2. The Second Party shall pay a monthly rent as mutually agreed, on or before the 5th of every calendar month.
3. PREMISES DETAILS & TERMS:
${f.description || '[Insert rules, security deposit, and specific terms]'}

4. Both parties shall provide one month's prior written notice in case of early termination of this agreement.

IN WITNESS WHEREOF, both parties have set their hands to this Agreement on the day, month and year first above written.

FIRST PARTY (Landlord):                           SECOND PARTY (Tenant):

_______________________                           _______________________
${f.yourName || 'Name'}                            ${f.opponentName || 'Name'}
`
};

const sanitizeInput = (form) => {
  return form; // In a production app, strip HTML tags/XSS here
};

exports.generateDraft = (docType, form) => {
  const f = sanitizeInput(form || {});
  const generator = templates[docType] || templates['legal_notice'];
  return generator(f);
};
