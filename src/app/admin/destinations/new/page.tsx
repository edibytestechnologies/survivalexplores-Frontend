"use client";

import { AdminHeader } from "@/components/admin/ui";
import { DestinationForm, EMPTY_DESTINATION } from "@/components/admin/destination-form";

export default function NewDestinationPage() {
  return (
    <>
      <AdminHeader title="Add Destination" subtitle="Create a new trip / popular destination." />
      <DestinationForm initial={EMPTY_DESTINATION} />
    </>
  );
}
