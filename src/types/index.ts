export interface SearchParams {
	[key: string]: string | string[] | undefined;
}

export interface Option {
	label: string;
	value: string;
	icon?: React.ComponentType<{ className?: string }>;
	withCount?: boolean;
}

export interface DataTableFilterField<TData> {
	label: string;
	value: keyof TData;
	placeholder?: string;
	options?: Option[];
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	icon?: any;
}

export interface DataTableFilterOption<TData> {
	id: string;
	label: string;
	value: keyof TData;
	options: Option[];
	filterValues?: string[];
	filterOperator?: string;
	isMulti?: boolean;
}
