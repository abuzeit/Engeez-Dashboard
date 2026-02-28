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
    customer: z.string().min(2, {
        message: "Customer name must be at least 2 characters.",
    }),
    destination: z.string().min(2, {
        message: "Destination must be at least 2 characters.",
    }),
    status: z.string().min(1, {
        message: "Please select a status.",
    }),
    priority: z.string().min(1, {
        message: "Please select a priority.",
    }),
    serviceType: z.string().optional(),
})

type OrderFormValues = z.infer<typeof formSchema>

interface UpdateOrderDialogProps {
    order: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function UpdateOrderDialog({ order, open, onOpenChange, onSuccess }: UpdateOrderDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            customer: "",
            destination: "",
            status: "",
            priority: "",
            serviceType: "Standard Delivery",
        },
    })

    React.useEffect(() => {
        if (order) {
            form.reset({
                id: order.id,
                customer: order.customer,
                destination: order.destination,
                status: order.status,
                priority: order.priority,
                serviceType: order.serviceType || "Standard Delivery",
            })
        }
    }, [order, form])

    async function onSubmit(data: OrderFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/orders/${data.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error("Failed to update order")
            }

            toast.success("Order updated successfully", {
                description: `Order ${data.id} has been updated in the fleet system.`,
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error("Error updating order", {
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
                    <DialogTitle>Update Order {order?.id}</DialogTitle>
                    <DialogDescription>
                        Modify the shipment details below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="customer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Customer</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nordic Group" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="destination"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Destination</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jeddah" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
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
                                                <SelectItem value="Pending">Pending</SelectItem>
                                                <SelectItem value="Processing">Processing</SelectItem>
                                                <SelectItem value="Pickup">Pickup</SelectItem>
                                                <SelectItem value="In Transit">In Transit</SelectItem>
                                                <SelectItem value="Delivered">Delivered</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select priority" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Low">Low</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="High">High</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="serviceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Service Type</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
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
