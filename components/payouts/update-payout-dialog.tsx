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
    driver: z.string().min(2, { message: "Driver name is required." }),
    amount: z.string().min(1, { message: "Amount is required." }),
    status: z.string().min(1, { message: "Status is required." }),
    bank: z.string().min(1, { message: "Bank is required." }),
})

type PayoutFormValues = z.infer<typeof formSchema>

interface UpdatePayoutDialogProps {
    payout: any | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
    typeLabel: string
}

export function UpdatePayoutDialog({ payout, open, onOpenChange, onSuccess, typeLabel }: UpdatePayoutDialogProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<PayoutFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            driver: "",
            amount: "",
            status: "",
            bank: "",
        },
    })

    React.useEffect(() => {
        if (payout) {
            form.reset({
                id: payout.id,
                driver: payout.driver,
                amount: payout.amount,
                status: payout.status,
                bank: payout.bank,
            })
        }
    }, [payout, form])

    async function onSubmit(data: PayoutFormValues) {
        setIsSubmitting(true)
        try {
            // Mock API delay
            await new Promise(resolve => setTimeout(resolve, 800))

            toast.success(`${typeLabel} updated successfully`, {
                description: `${typeLabel} ${data.id} has been updated in the system.`,
            })
            onOpenChange(false)
            onSuccess?.()
        } catch (error) {
            toast.error(`Error updating ${typeLabel.toLowerCase()}`, {
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
                    <DialogTitle>Update {typeLabel} {payout?.id}</DialogTitle>
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
                                    <FormLabel>Driver</FormLabel>
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
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bank"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Account</FormLabel>
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
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Processing">Processing</SelectItem>
                                            <SelectItem value="Approved">Approved</SelectItem>
                                            <SelectItem value="Completed">Completed</SelectItem>
                                            <SelectItem value="Cancelled">Cancelled</SelectItem>
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
