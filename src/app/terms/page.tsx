import { LegalPage } from "@/components/legal/legal-page";

export const metadata = {
  title: "Terms",
};

const sections = [
  {
    title: "Platform purpose",
    body: [
      "Psynova is a booking platform that helps patients discover approved mental health professionals and request appointment times.",
      "The platform does not provide emergency care, automated diagnosis, prescriptions, crisis intervention, or guaranteed clinical outcomes.",
    ],
  },
  {
    title: "User responsibilities",
    body: [
      "Users are responsible for providing accurate account and booking information, keeping login credentials secure, and using the platform respectfully.",
      "Users should not include urgent crisis information in booking messages. If there is immediate danger or a medical emergency, local emergency services should be contacted directly.",
    ],
  },
  {
    title: "Doctor responsibilities",
    body: [
      "Doctor accounts are responsible for submitting accurate professional information for manual review and keeping availability accurate.",
      "Public listing is controlled by admin verification. Approval in the platform should not be treated as a final legal or regulatory determination without professional compliance review.",
    ],
  },
  {
    title: "Appointments",
    body: [
      "Appointments begin as requests and may be confirmed, declined, cancelled, completed, or otherwise updated according to the platform workflow.",
      "Cancellation, refund, payment, and rescheduling policies are placeholders until reviewed and finalized by the platform operator and qualified advisors.",
    ],
  },
  {
    title: "Accounts and access",
    body: [
      "The platform may restrict or deactivate accounts when needed for safety, abuse prevention, operational integrity, or compliance review.",
      "Role-based access is required for patient, doctor, and admin areas. Users should not attempt to access data or workflows outside their assigned role.",
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      title="Terms of use overview"
      description="Product-ready placeholder terms for how the booking platform is intended to be used before legal review."
      sections={sections}
    />
  );
}
