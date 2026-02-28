"use client"

import * as React from "react"
import { DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface MultiUpdateDialogProps {
    rows: any[]
    label: string
    endpoint: string
    statuses: string[]
    onSuccess: () => void
}

export function MultiUpdateDialog({ rows, label, endpoint, statuses, onSuccess }: MultiUpdateDialogProps) {
    const [status, setStatus] = React.useState<string>("")
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    async function handleSave() {
        if (!status) {
            toast.error("Please select a status")
            return
        }

        setIsSubmitting(true)
        try {
            const ids = rows.map((r: any) => r.id || r.driverId || r.vehicleId || r.payoutId || r.orderId)
            const response = await fetch(`/api/${endpoint}/bulk`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids, data: { status } })
            })

            if (!response.ok) throw new Error("Update failed")

            toast.success(`Updated ${ids.length} ${label.toLowerCase()} successfully`)
            onSuccess()
        } catch (error) {
            toast.error("Failed to update items")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-4">
            <DialogHeader>
                <DialogTitle>Bulk Update {label}</DialogTitle>
                <DialogDescription>
                    Update the status for {rows.length} selected items to a new value.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="flex flex-col gap-2">
                    <span className="text-sm font-medium">New Status</span>
                    <Select onValueChange={setStatus} value={status}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent>
                            {statuses.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
                <Button onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? "Updating..." : "Save changes"}
                </Button>
            </DialogFooter>
        </div>
    )
}
