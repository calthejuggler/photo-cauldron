import { Button } from "./ui/button";
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormDescription,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const fileSchema = z.object({
	location: z.string().min(1, "Photo location is required"),
	good: z.string().min(1, "Good folder is required"),
	bad: z.string().min(1, "Bad folder is required"),
	maybe: z.string().min(1, "Maybe folder is required"),
});

type FileSchema = z.infer<typeof fileSchema>;

export const FoldersForm = () => {
	const form = useForm<FileSchema>({
		resolver: zodResolver(fileSchema),
		defaultValues: {
			location: "",
			good: "",
			bad: "",
			maybe: "",
		},
	});

	const onSubmit: SubmitHandler<FileSchema> = (values: FileSchema) => {
		console.log(values);
	};

	const onError: SubmitErrorHandler<FileSchema> = (error) => {
		if (error.bad) toast(error.bad.message);
		if (error.good) toast(error.good.message);
		if (error.maybe) toast(error.maybe.message);
		if (error.location) toast(error.location.message);
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit, onError)}
				className="space-y-2"
			>
				<h1 className="text-3xl font-bold">Photos</h1>
				<FormField
					control={form.control}
					name="location"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Photos Location</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
							<FormDescription>
								This is the folder where the photos are currently.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="good"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Good</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
							<FormDescription>
								This is the folder where "good" photos will be stored.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="bad"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Bad</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
							<FormDescription>
								This is the folder where "bad" photos will be stored.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="maybe"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Maybe</FormLabel>
							<FormControl>
								<Input type="file" {...field} />
							</FormControl>
							<FormDescription>
								This is the folder where "maybe" photos will be stored.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Ready?</Button>
			</form>
		</Form>
	);
};
