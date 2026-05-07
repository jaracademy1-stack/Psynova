import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Consent",
};

const sections = [
  {
    title: "Booking consent",
    body: [
      "By requesting an appointment, a patient acknowledges that Psynova is used to coordinate booking with a selected professional, not to deliver emergency or crisis care.",
      "The patient understands that appointment requests may need confirmation by the professional and that availability can change before a request is accepted.",
    ],
  },
  {
    title: "Telehealth and session consent placeholder",
    body: [
      "Mental health sessions may involve sensitive personal conversations. Session format, clinical consent, professional obligations, and jurisdiction-specific requirements must be reviewed by qualified legal and clinical professionals before launch.",
      "The current platform scope does not store clinical notes, diagnosis, prescriptions, chat, video links, or payment details.",
    ],
  },
  {
    title: "Privacy expectations",
    body: [
      "Patient appointment data is intended to be visible only to the patient, the selected professional, and authorized admin operations where needed.",
      "Patients should avoid entering urgent crisis information or highly detailed clinical history in booking messages. Those details are better handled directly with the professional through an appropriate care process.",
    ],
  },
  {
    title: "Limits of the platform",
    body: [
      "Psynova does not replace professional judgment, emergency services, or local healthcare systems.",
      "If you are in immediate danger, experiencing suicidal thoughts, or facing a medical emergency, contact local emergency services or go to the nearest emergency department.",
    ],
  },
  {
    title: "Acknowledgement language",
    body: [
      "Before launch, the operator should replace this placeholder with reviewed consent language and a clear user acknowledgement flow.",
    ],
  },
];

export default function ConsentPage() {
  return (
    <LegalPage
      eyebrow="Consent"
      title="Consent overview"
      description="A plain-English placeholder for booking and telehealth consent expectations in the current product scope."
      sections={sections}
    />
  );
}
