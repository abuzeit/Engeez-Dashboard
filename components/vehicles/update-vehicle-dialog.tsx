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
    model: z.string().min(1, { message: "Model is required." }),
    status: z.string().min(1, { message: "Status is required." }),
    vin: z.string().min(1, { message: "VIN is required." }),
    type: z.string().min(1, { message: "Type is required." }),
})

type VehicleFormValues = z.infer<typeof formSchema>

interface UpdateVehicleDialogProps {
    vehicle: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UpdateVehicleDialog({ vehicle, open, onOpenChange, onSuccess }: UpdateVehicleDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<VehicleFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            model: "",
            status: "",
            vin: "",
            type: "",
        },
    })

    React.useEffect(() => {
        if (vehicle) {
            form.reset({
                id: vehicle.id,
                model: vehicle.model,
                status: vehicle.status,
                vin: vehicle.vin,
                type: vehicle.type,
            })
        }
    }, [vehicle, form])

    async function onSubmit(data: VehicleFormValues) {
        setIsSubmitting(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 800))
            toast.success(`Vehicle updated successfully`, {
                description: `Vehicle ${data.id} has been updated.`,
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error(`Error updating vehicle`, {
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
                    <DialogTitle>Update Vehicle {vehicle?.id}</DialogTitle>
                    <DialogDescription>
                        Modify the details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Vehicle Model</FormLabel>
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
                                name="vin"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>VIN / License</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
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
                                            <SelectItem value="In Transit">In Transit</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="Out of Service">Out of Service</SelectItem>
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
