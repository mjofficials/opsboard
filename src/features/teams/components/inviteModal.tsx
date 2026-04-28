"use client"

import { AppForm } from "@/components/form/AppForm"
import { AppInput } from "@/components/form/inputs/AppInput"
import { AppSelect } from "@/components/form/inputs/AppSelect"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { z } from "zod"

const inviteSchema = z.object({
    email: z.string().email("Invalid email address"),
    role: z.enum(["MEMBER"])
})

export type InviteFormValues = z.infer<typeof inviteSchema>

interface InviteModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    initialData?: InviteFormValues;
    onSubmit: (data: InviteFormValues) => void;
}

export default function InviteModal({
    isOpen,
    setIsOpen,
    initialData,
    onSubmit
}: InviteModalProps) {

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-sm" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Invite Team Member</DialogTitle>
                    <DialogDescription>
                        Invite a new team member to your organization.
                    </DialogDescription>
                </DialogHeader>

                <AppForm
                    schema={inviteSchema}
                    onSubmit={onSubmit}
                    defaultValues={initialData || {
                        email: "",
                        role: "MEMBER"
                    }}
                >
                    <CardContent className="space-y-4">
                        <AppInput
                            name="email"
                            label="Email"
                            placeholder="Enter Email"
                        />

                        <AppSelect
                            name="role"
                            label="Role"
                            options={[
                                { value: "MEMBER", label: "Member" },
                            ]}
                            placeholder="Select Role"
                        />
                    </CardContent>

                    <DialogFooter className="mt-5">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Invite</Button>
                    </DialogFooter>

                </AppForm>
            </DialogContent>
        </Dialog>
    )
}