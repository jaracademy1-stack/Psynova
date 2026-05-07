import { Alert } from "@heroui/react";

type FormMessageProps = {
  message?: string;
  tone?: "danger" | "success";
  title?: string;
};

export function FormMessage({
  message,
  tone = "danger",
  title,
}: FormMessageProps) {
  if (!message) {
    return null;
  }

  const resolvedTitle =
    title ?? (tone === "success" ? "Request received" : "We could not complete that request");

  return (
    <Alert status={tone}>
      <Alert.Content>
        <Alert.Title>{resolvedTitle}</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
