import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy",
};

const sections = [
  {
    title: "Data the platform may collect",
    body: [
      "Psynova may collect account information such as your name, email address, phone number, role, and basic profile details needed to operate the booking platform.",
      "Patient profile information is kept minimal in the current product scope. It may include consent status, preferred name, general location, emergency contact fields, and basic booking preferences.",
    ],
  },
  {
    title: "Booking and professional data",
    body: [
      "Booking records may include the selected professional, appointment time, session type, booking status, cancellation reason, and an optional short booking message.",
      "Doctor profiles may include public professional details after admin approval, such as display name, title, bio, specialties, languages, experience, session duration, and pricing. License details and internal review notes are admin-only.",
    ],
  },
  {
    title: "How data is used",
    body: [
      "Data is used to create accounts, route users to the correct dashboard, display approved public doctor profiles, manage appointment requests, and support manual admin verification.",
      "The platform does not use patient profile data for public listings and does not add diagnosis, clinical notes, payment, chat, or video records in the current product scope.",
    ],
  },
  {
    title: "Access and security basics",
    body: [
      "Access is role-based. Patients can access their own appointment data, doctors can access appointments assigned to their profile, and admins can perform operational verification tasks.",
      "Supabase Row Level Security and server-side checks are used to reduce the risk of unauthorized access. Production security settings, rate limits, and legal compliance controls must be reviewed before launch.",
    ],
  },
  {
    title: "Contact placeholder",
    body: [
      "Before launch, replace this section with a real support and privacy contact address controlled by the platform operator.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy overview"
      description="A clear summary of the data Psynova expects to collect and how access is controlled in the current product scope."
      sections={sections}
    />
  );
}
