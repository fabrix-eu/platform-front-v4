import { createFileRoute } from "@tanstack/react-router";
import { RegisterPage } from "@/features/organizations/signup/RegisterPage";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});
