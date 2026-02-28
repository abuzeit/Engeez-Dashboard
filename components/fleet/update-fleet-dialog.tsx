"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
    id: z.string(),
    driver: z.string().min(1, { message: "Driver is required." }),
    status: z.string().min(1, { message: "Status is required." }),
    location: z.string().min(1, { message: "Location is required." }),
    load: z.string().optional(),
})

type FleetFormValues = z.infer<typeof formSchema>

interface UpdateFleetDialogProps {
    fleet: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UpdateFleetDialog({ fleet, open, onOpenChange, onSuccess }: UpdateFleetDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<FleetFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            driver: "",
            status: "",
            location: "",
            load: "",
        },
    })

    React.useEffect(() => {
        if (fleet) {
            form.reset({
                id: fleet.id,
                driver: fleet.driver,
                status: fleet.status,
                location: fleet.location,
                load: fleet.load || "",
            })
        }
    }, [fleet, form])

    async function onSubmit(data: FleetFormValues) {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            toast.success(`Fleet updated successfully`, {
                description: `Fleet ID ${data.id} has been updated.`,
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error(`Error updating fleet`, {
                description: "There was a problem with your request. Please try again.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Update Fleet Item {fleet?.id}</DialogTitle>
                    <DialogDescription>
                        Modify the details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="driver"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Driver Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="location"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Location</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="In Transit">In Transit</SelectItem>
                                            <SelectItem value="Delayed">Delayed</SelectItem>
                                            <SelectItem value="Stopped">Stopped</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="load"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Load Information</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. Empty, 50%, Full..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
