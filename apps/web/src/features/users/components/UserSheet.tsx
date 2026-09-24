"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Separator } from "@/components/ui/separator"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"

import { useUsers, useUser } from "@/features/users/hooks/useUsers"
import { UserStatus } from "@/features/users/types"
import { UserForm, UserFormValues } from "./UserForm"

export type UserSheetMode = "create" | "view" | "edit"

export interface UserSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
  mode?: UserSheetMode
}

function UserFormSkeleton() {
  return (
    <div className="px-4 py-4 space-y-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  )
}

const HEADER: Record<
  UserSheetMode,
  { title: (name?: string) => string }
> = {
  create: {
    title: () => "New User",
  },
  view: {
    title: (name) => `View User: ${name}`,
  },
  edit: {
    title: (name) => `Edit User: ${name}`,
  },
}

export function UserSheet({
  open,
  onOpenChange,
  userId,
  mode = "create",
}: UserSheetProps) {
  const { addUser, editUser } = useUsers()
  const [isPending, setIsPending] = useState(false)

  const {
    data: user,
    isLoading: userLoading,
  } = useUser(userId ?? "")

  const isCreate = mode === "create"
  const isView = mode === "view"

  const header = HEADER[mode]

  const initialData: UserFormValues | undefined =
    !isCreate && user
      ? {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status as UserStatus,
      }
      : undefined

  const submitText = isPending
    ? isCreate
      ? "Creating…"
      : "Saving…"
    : isCreate
      ? "Create User"
      : "Save Changes"

  const handleCreate = async (data: UserFormValues) => {
    setIsPending(true)
    const { error } = await addUser({
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status,
    })
    setIsPending(false)

    if (!error) {
      toast.success("User created successfully")
      onOpenChange(false)
    } else {
      toast.error(error || "Failed to create user")
    }
  }

  const handleEdit = async (data: UserFormValues) => {
    if (!userId) return

    setIsPending(true)
    const { error } = await editUser(userId, {
      name: data.name,
      email: data.email,
      role: data.role,
      status: data.status as UserStatus,
    })
    setIsPending(false)

    if (!error) {
      toast.success("User updated successfully")
      onOpenChange(false)
    } else {
      toast.error(error || "Failed to update user")
    }
  }

  const handleSubmit = isCreate ? handleCreate : handleEdit

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex flex-col gap-0 p-0 sm:max-w-md overflow-y-auto"
        side="right"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="h-0.5 w-full bg-primary shrink-0" />

        <SheetHeader className="px-6 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <SheetTitle className="text-lg font-semibold tracking-tight">
              {header.title(user?.name)}
            </SheetTitle>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex-1 px-2 py-2">
          {!isCreate && userLoading ? (
            <UserFormSkeleton />
          ) : (
            <UserForm
              key={`${mode}-${userId}`}
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              title=""
              description=""
              submitText={submitText}
              isReadOnly={isView}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
