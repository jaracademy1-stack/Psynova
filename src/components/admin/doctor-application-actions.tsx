import { Card } from "@heroui/react";

import { AdminActionForm } from "@/components/admin/admin-action-form";
import {
  approveDoctorApplication,
  rejectDoctorApplication,
  setDoctorPublicStatus,
  setProfileActiveStatus,
} from "@/services/admin/actions";
import type { DoctorApplication } from "@/types/admin";

type DoctorApplicationActionsProps = {
  application: DoctorApplication;
};

const textAreaClass =
  "min-h-24 rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/20";

export function DoctorApplicationActions({
  application,
}: DoctorApplicationActionsProps) {
  const canTogglePublic = application.verification_status === "approved";

  return (
    <div className="grid gap-4">
      <Card className="border bg-card shadow-sm">
        <Card.Header>
          <Card.Title>Approve application</Card.Title>
          <Card.Description>
            Approving verifies the doctor. You can publish the profile
            immediately or keep it private.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <AdminActionForm
            action={approveDoctorApplication}
            submitLabel="Approve doctor"
            pendingLabel="Approving..."
            tone="primary"
          >
            <input
              type="hidden"
              name="doctorProfileId"
              value={application.id}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="makePublic"
                defaultChecked
                className="size-4 rounded border"
              />
              Make profile public after approval
            </label>
            <label className="flex items-start gap-2 text-sm leading-6">
              <input
                type="checkbox"
                required
                className="mt-1 size-4 rounded border"
              />
              I reviewed the professional details before approving this doctor.
            </label>
            <textarea
              name="reviewNote"
              maxLength={1000}
              className={textAreaClass}
              placeholder="Optional internal review note"
            />
          </AdminActionForm>
        </Card.Content>
      </Card>

      <Card className="border bg-card shadow-sm">
        <Card.Header>
          <Card.Title>Reject application</Card.Title>
          <Card.Description>
            Rejection keeps the profile private. The note is internal to admin
            review records.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <AdminActionForm
            action={rejectDoctorApplication}
            submitLabel="Reject doctor"
            pendingLabel="Rejecting..."
            tone="danger"
          >
            <input
              type="hidden"
              name="doctorProfileId"
              value={application.id}
            />
            <textarea
              name="reviewNote"
              maxLength={1000}
              className={textAreaClass}
              placeholder="Optional internal reason"
            />
            <label className="flex items-start gap-2 text-sm leading-6">
              <input
                type="checkbox"
                required
                className="mt-1 size-4 rounded border"
              />
              I understand this will keep the doctor private and mark the
              application rejected.
            </label>
          </AdminActionForm>
        </Card.Content>
      </Card>

      <Card className="border bg-card shadow-sm">
        <Card.Header>
          <Card.Title>Public listing</Card.Title>
          <Card.Description>
            Only approved doctors can be visible in the public directory.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <AdminActionForm
            action={setDoctorPublicStatus}
            submitLabel={application.is_public ? "Make private" : "Make public"}
            pendingLabel="Updating..."
            tone="neutral"
            isDisabled={!canTogglePublic}
          >
            <input
              type="hidden"
              name="doctorProfileId"
              value={application.id}
            />
            <input
              type="hidden"
              name="isPublic"
              value={application.is_public ? "false" : "true"}
            />
            {!canTogglePublic ? (
              <p className="text-sm leading-6 text-muted-foreground">
                Approve this doctor before changing public visibility.
              </p>
            ) : null}
          </AdminActionForm>
        </Card.Content>
      </Card>

      <Card className="border bg-card shadow-sm">
        <Card.Header>
          <Card.Title>Account status</Card.Title>
          <Card.Description>
            Deactivated accounts are kept out of public doctor results and
            protected workflows.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <AdminActionForm
            action={setProfileActiveStatus}
            submitLabel={application.is_active ? "Deactivate" : "Reactivate"}
            pendingLabel="Updating..."
            tone={application.is_active ? "danger" : "primary"}
          >
            <input type="hidden" name="profileId" value={application.user_id} />
            <input
              type="hidden"
              name="doctorProfileId"
              value={application.id}
            />
            <input
              type="hidden"
              name="isActive"
              value={application.is_active ? "false" : "true"}
            />
          </AdminActionForm>
        </Card.Content>
      </Card>
    </div>
  );
}
