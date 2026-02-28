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
    name: z.string().min(2, { message: "Name is required." }),
    status: z.string().min(1, { message: "Status is required." }),
    contact: z.string().min(1, { message: "Contact is required." }),
    experience: z.string().min(1, { message: "Experience is required." }),
})

type DriverFormValues = z.infer<typeof formSchema>

interface UpdateDriverDialogProps {
    driver: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UpdateDriverDialog({ driver, open, onOpenChange, onSuccess }: UpdateDriverDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<DriverFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            status: "",
            contact: "",
            experience: "",
        },
    })

    React.useEffect(() => {
        if (driver) {
            form.reset({
                id: driver.id,
                name: driver.name,
                status: driver.status,
                contact: driver.contact,
                experience: driver.experience,
            })
        }
    }, [driver, form])

    async function onSubmit(data: DriverFormValues) {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            toast.success(`Driver updated successfully`, {
                description: `Driver ${data.id} has been updated.`,
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error(`Error updating driver`, {
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
                    <DialogTitle>Update Driver {driver?.id}</DialogTitle>
                    <DialogDescription>
                        Modify the details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="contact"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contact Info</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="experience"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Experience</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                            <SelectItem value="Offline">Offline</SelectItem>
                                            <SelectItem value="On Break">On Break</SelectItem>
                                            <SelectItem value="Busy">Busy</SelectItem>
                                        </SelectContent>
                                    </Select>
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
