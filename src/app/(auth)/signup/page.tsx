// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { Button } from "~/app/_components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "~/app/_components/ui/form";
// import { Input } from "~/app/_components/ui/input";
// import { api } from "~/trpc/react";

// const SignUpSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   password: z.string().min(8, "Password must be at least 8 characters long"),
// });

// export default function SignUp() {
//   const form = useForm<z.infer<typeof SignUpSchema>>({
//     resolver: zodResolver(SignUpSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });
//   const signUpUserMutation = api.user.signUp.useMutation();

//   async function onSubmit(values: z.infer<typeof SignUpSchema>) {
//     signUpUserMutation.mutate(
//       {
//         ...values,
//         role: "ADMIN",
//       },
//       {
//         onSuccess: (data: any) => {
//           console.log(data);
//         },
//         onError: (error: any) => {
//           console.log(error);
//         },
//       }
//     );
//   }

//   return (
//     <div>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Name</FormLabel>
//                 <FormControl>
//                   <Input placeholder="" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input placeholder="" {...field} type="password" />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit">Submit</Button>
//         </form>
//       </Form>
//     </div>
//   );
// }
