"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function DangerZone({ project }: { project: any }) {
  const [confirmText, setConfirmText] = React.useState("")
  const [isDeleting, setIsDeleting] = React.useState(false)
  const required = project.slug
  const router = useRouter()

  const onDelete = async () => {
    try {
      setIsDeleting(true)
      const response = await fetch(`/api/projects/${project.slug}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectId: project.id
          })
        },

      )

      if (!response.ok) {
        toast.error("Failed to delete the project")
      }
      toast.success("Project deleted successfully")
      router.push("/dashboard")
    } catch (err) {
      toast.error("Project deletion simulated")
    } finally {
      setIsDeleting(false)
    }
  }

  const canDelete = confirmText.trim().toLowerCase() === required

  return (
    <Card className="border border-destructive/30 bg-card">
      <CardHeader>
        <CardTitle className="text-destructive">Danger Zone</CardTitle>
        <CardDescription className="text-muted-foreground">
          Permanently delete your project and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="rounded-md border border-destructive/20 bg-background p-4">
          <div className="grid gap-2">
            <Label htmlFor="confirm" className="text-foreground">
              Type <span className="font-medium text-destructive">{required}</span> to enable deletion
            </Label>
            <Input
              id="confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="bg-background"
              placeholder={required}
              aria-describedby="confirm-help"
            />
            <p id="confirm-help" className="text-xs text-muted-foreground">
              This extra step helps prevent accidental deletions.
            </p>
          </div>

          <div className="mt-4 flex items-center justify-end gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="bg-destructive text-destructive-foreground disabled:opacity-50"
                  disabled={!canDelete}
                >
                  Delete project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-foreground">Confirm deletion</AlertDialogTitle>
                  <AlertDialogDescription className="text-muted-foreground">
                    This will permanently remove your project. There is no way to recover it.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border border-border cursor-pointer">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive-20 hover:cursor-pointer"
                    onClick={onDelete}
                  >
                    {isDeleting ? "Deleting..." : "Yes, delete it"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
