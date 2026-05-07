import { Alert } from "@heroui/react";

type FormMessageProps = {
  message?: string;
};

export function FormMessage({ message }: FormMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <Alert status="danger">
      <Alert.Content>
        <Alert.Title>We could not complete that request</Alert.Title>
        <Alert.Description>{message}</Alert.Description>
      </Alert.Content>
    </Alert>
  );
}
