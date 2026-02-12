'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
    message: z.string().min(20, "Please include details about your background and the service you are requesting")
});

type FormValues = z.infer<typeof formSchema>;

export function ContactForm() {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            message: ""
        },
    });

    const onSubmit = async (values: FormValues) => {
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                console.log("Success!");
            } else {
                const data = await response.json();
                console.error("Error:", data.error);
            }

            reset();
        } catch (err) {
            console.error("Unexpected error:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full gap-4 items-center">
            <div className="flex flex-row gap-4 w-full">
                <div className="w-1/2">
                    <label className="fd-form-label block mb-1">First Name</label>
                    <input className="fd-form-input" {...register("firstName")} />
                    {errors.firstName && <p className="fd-form-error">{errors.firstName.message}</p>}
                </div>
                <div className="w-1/2">
                    <label className="fd-form-label block mb-1">Last Name</label>
                    <input className="fd-form-input" {...register("lastName")} />
                    {errors.lastName && <p className="fd-form-error">{errors.lastName.message}</p>}
                </div>
            </div>
            <div className="flex flex-row gap-4 w-full">
                <div className="w-1/2">
                    <label className="fd-form-label block mb-1">Email</label>
                    <input className="fd-form-input" {...register("email")} />
                    {errors.email && <p className="fd-form-error">{errors.email.message}</p>}
                </div>
                <div className="w-1/2">
                    <label className="fd-form-label block mb-1">Phone Number</label>
                    <input className="fd-form-input" {...register("phoneNumber")} />
                    {errors.phoneNumber && <p className="fd-form-error">{errors.phoneNumber.message}</p>}
                </div>
            </div>
            <div className="w-full">
                <label className="fd-form-label block mb-1">Message</label>
                <textarea className="fd-form-input" placeholder="Describe the service you're requesting" {...register("message")} />
                {errors.message && <p className="fd-form-error">{errors.message.message}</p>}
            </div>
            <div className="w-full">
                <button type="submit" className="fd-btn w-full mt-2">Submit</button>
            </div>
        </form>
    );
}
